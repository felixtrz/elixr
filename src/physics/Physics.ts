import { RigidBody, World } from '@dimforge/rapier3d';
import { Rigidbody, RigidbodyOptions } from './Rigidbody'; // Adjust the import path accordingly

import { World as ECSWorld } from '../ecs/World';
import { Vector3 } from 'three';

export const PRIVATE = Symbol('@elixr/physics/rapier-physics');

export class Physics {
	public static module: typeof import('@dimforge/rapier3d');

	[PRIVATE]: {
		world: World;
		ecsWorld: ECSWorld;
		rigidBodyMap: Map<RigidBody, Rigidbody>;
	};

	constructor(ecsWorld: ECSWorld, gravity: Vector3) {
		this[PRIVATE] = {
			world: new World({
				x: gravity.x,
				y: gravity.y,
				z: gravity.z,
			}),
			ecsWorld,
			rigidBodyMap: new Map(),
		};
	}

	get world() {
		return this[PRIVATE].world;
	}

	createRigidBody(options: RigidbodyOptions): Rigidbody {
		return new Rigidbody(this[PRIVATE].ecsWorld, options);
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
