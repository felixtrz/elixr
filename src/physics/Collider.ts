import { ColliderDesc, Collider as RCollider } from '@dimforge/rapier3d';
import { Mesh, MeshBasicMaterial, Quaternion, Vector3 } from 'three';

import { PhysicsMaterial } from './Material';

export const PRIVATE = Symbol('@elixr/physics/collider');

const WIREFRAME_MATERIAL = new MeshBasicMaterial({
	color: 0xffffff,
	wireframe: true,
	depthTest: false,
});

function createProxy<T extends object>(obj: T, onChange: () => void): T {
	return new Proxy(obj, {
		set(target: T, property: string | symbol, value: any): boolean {
			(target as any)[property] = value;
			onChange();
			return true;
		},
		get(target: T, property: string | symbol): any {
			const originalValue = (target as any)[property];
			if (typeof originalValue === 'function') {
				return function (...args: any[]): any {
					const result = originalValue.apply(target, args);
					onChange();
					return result;
				};
			}
			return originalValue;
		},
	});
}

export abstract class Collider extends Mesh {
	/** @ignore */
	[PRIVATE]: {
		physicMaterial: PhysicsMaterial;
		needsUpdate: boolean;
		colliderDesc: ColliderDesc;
		collider: RCollider;
	};

	constructor(physicMaterial: PhysicsMaterial) {
		super(undefined, WIREFRAME_MATERIAL);
		this[PRIVATE] = {
			physicMaterial,
			needsUpdate: true,
			colliderDesc: null,
			collider: null,
		};
		// Redefine position and quaternion properties in Collider
		Object.defineProperties(this, {
			position: {
				configurable: true,
				enumerable: true,
				value:
					createProxy <
					Vector3 >
					(this.position,
					() => {
						if (this[PRIVATE].collider) {
							this[PRIVATE].collider.setTranslation(this.position);
						}
						this[PRIVATE].colliderDesc.setTranslation(
							this.position.x,
							this.position.y,
							this.position.z,
						);
					}),
			},
			quaternion: {
				configurable: true,
				enumerable: true,
				value:
					createProxy <
					Quaternion >
					(this.quaternion,
					() => {
						if (this[PRIVATE].collider) {
							this[PRIVATE].collider.setRotation(this.quaternion);
						}
						this[PRIVATE].colliderDesc.setRotation(this.quaternion);
					}),
			},
		});
		this.visible = false;
	}

	get trigger(): boolean {
		if (this[PRIVATE].collider) {
			return this[PRIVATE].collider.isSensor();
		} else {
			return this[PRIVATE].colliderDesc.isSensor;
		}
	}

	set trigger(value: boolean) {
		if (this[PRIVATE].collider) {
			this[PRIVATE].collider.setSensor(value);
		}
		this[PRIVATE].colliderDesc.setSensor(value);
	}

	get enabled(): boolean {
		if (this[PRIVATE].collider) {
			return this[PRIVATE].collider.isEnabled();
		} else {
			return this[PRIVATE].colliderDesc.enabled;
		}
	}

	set enabled(value: boolean) {
		if (this[PRIVATE].collider) {
			this[PRIVATE].collider.setEnabled(value);
		}
		this[PRIVATE].colliderDesc.setEnabled(value);
	}

	get layer(): number {
		if (this[PRIVATE].collider) {
			return this[PRIVATE].collider.collisionGroups();
		} else {
			return this[PRIVATE].colliderDesc.collisionGroups;
		}
	}

	set layer(value: number) {
		if (this[PRIVATE].collider) {
			this[PRIVATE].collider.setCollisionGroups(value);
		}
		this[PRIVATE].colliderDesc.setCollisionGroups(value);
	}

	get physicMaterial(): PhysicsMaterial {
		return this[PRIVATE].physicMaterial;
	}

	set physicMaterial(value: PhysicsMaterial) {
		this[PRIVATE].physicMaterial = value;
		this[PRIVATE].needsUpdate = true;
	}

	syncProperties(): void {
		if (this[PRIVATE].collider) {
			this[PRIVATE].collider.setDensity(this.physicMaterial.density);
			this[PRIVATE].collider.setFriction(this.physicMaterial.friction);
			this[PRIVATE].collider.setRestitution(this.physicMaterial.bounciness);
			this[PRIVATE].collider.setFrictionCombineRule(
				this.physicMaterial.frictionCombine,
			);
			this[PRIVATE].collider.setRestitutionCombineRule(
				this.physicMaterial.bouncinessCombine,
			);
		}
		this[PRIVATE].colliderDesc.density = this.physicMaterial.density;
		this[PRIVATE].colliderDesc.friction = this.physicMaterial.friction;
		this[PRIVATE].colliderDesc.restitution = this.physicMaterial.bounciness;
		this[PRIVATE].colliderDesc.frictionCombineRule =
			this.physicMaterial.frictionCombine;
		this[PRIVATE].colliderDesc.restitutionCombineRule =
			this.physicMaterial.bouncinessCombine;
		this[PRIVATE].needsUpdate = false;
	}

	/** @ignore */
	get needsUpdate(): boolean {
		return this[PRIVATE].needsUpdate;
	}

	updateMatrixWorld(force?: boolean): void {
		super.updateMatrixWorld(force);
	}
}
