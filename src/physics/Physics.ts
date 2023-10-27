import { RigidBody, World } from '@dimforge/rapier3d';

import { Rigidbody } from './Rigidbody'; // Adjust the import path accordingly
import { Vector3 } from 'three';

export const PRIVATE = Symbol('@elixr/physics/rapier-physics');

export class Physics {
	private static instance: Physics;

	[PRIVATE]: {
		module: typeof import('@dimforge/rapier3d');
		world: World;
		rigidBodyMap: Map<RigidBody, Rigidbody>;
	};

	private constructor() {
		this[PRIVATE] = {
			module: null,
			world: null,
			rigidBodyMap: new Map(),
		};
	}

	public static getInstance(): Physics {
		if (!Physics.instance) {
			throw new Error('Rapier not initialized');
		}
		return Physics.instance;
	}

	public static async init(
		gravity: Vector3 = new Vector3(0, -9.81, 0),
	): Promise<Physics> {
		if (Physics.instance) {
			throw new Error('Rapier already initialized');
		}
		Physics.instance = new Physics();
		Physics.instance[PRIVATE].module = await import('@dimforge/rapier3d');
		Physics.instance[PRIVATE].world = new World({
			x: gravity.x,
			y: gravity.y,
			z: gravity.z,
		});
		return Physics.instance;
	}

	get module() {
		return this[PRIVATE].module;
	}

	get world() {
		return this[PRIVATE].world;
	}

	public associateRigidBody(
		rapierBody: RigidBody,
		wrapperBody: Rigidbody,
	): void {
		this[PRIVATE].rigidBodyMap.set(rapierBody, wrapperBody);
	}

	public getWrapperFromBody(rapierBody: RigidBody): Rigidbody | undefined {
		return this[PRIVATE].rigidBodyMap.get(rapierBody);
	}

	public dissociateRigidBody(rapierBody: RigidBody): void {
		this[PRIVATE].rigidBodyMap.delete(rapierBody);
	}

	public update(delta: number): void {
		if (!this.world) return;

		for (const rigidbody of this[PRIVATE].rigidBodyMap.values()) {
			if (rigidbody.enabled && rigidbody.isKinematic) {
				rigidbody.updateTransform();
			}
			rigidbody.colliders.forEach((collider) => {
				if (collider.needsUpdate) {
					collider.syncProperties();
				}
			});
		}

		this.world.timestep = delta;
		this.world.step();

		for (const rigidbody of this[PRIVATE].rigidBodyMap.values()) {
			if (rigidbody.enabled && !rigidbody.isKinematic) {
				rigidbody.syncTransform();
			}
		}
	}
}
