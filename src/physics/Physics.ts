import { PRIVATE as COLLIDER_PRIVATE, Collider } from './Collider';
import { PRIVATE as RIGIDBODY_PRIVATE, Rigidbody } from './Rigidbody';
import { RigidBody, World } from '@dimforge/rapier3d';

import { Vector3 } from 'three';

export const PRIVATE = Symbol('@elixr/physics/rapier-physics');

export class Physics {
	public static module: typeof import('@dimforge/rapier3d');

	[PRIVATE]: {
		world: World;
		rigidBodyMap: Map<RigidBody, Rigidbody>;
	};

	constructor(gravity: Vector3) {
		this[PRIVATE] = {
			world: new World({
				x: gravity.x,
				y: gravity.y,
				z: gravity.z,
			}),
			rigidBodyMap: new Map(),
		};
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

	public attachColliderToRigidbody(
		collider: Collider,
		rigidbody: Rigidbody,
	): void {
		collider[COLLIDER_PRIVATE].collider = this[PRIVATE].world.createCollider(
			collider[COLLIDER_PRIVATE].colliderDesc,
			rigidbody[RIGIDBODY_PRIVATE].rigidbody,
		);
		collider[COLLIDER_PRIVATE].needsUpdate = true;
	}

	public detachColliderFromRigidbody(collider: Collider): void {
		this[PRIVATE].world.removeCollider(
			collider[COLLIDER_PRIVATE].collider,
			true,
		);
		collider[COLLIDER_PRIVATE].collider = null;
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
