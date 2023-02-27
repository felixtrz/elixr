import { ActiveCollisionTypes } from '@dimforge/rapier3d/geometry';
import { Core } from '../core/Core';
import { GameComponent } from '../core/GameComponent';
import { PhysicsMaterial } from './PhysicsMaterial';
import { PrimitiveShape } from './ColliderShapes';
import { RigidBody } from './RigidBodyComponent';
import { Types } from 'ecsy';
import { Vector3 } from 'three';

class ColliderComponent extends GameComponent<any> {
	static schema = {
		shape: { type: Types.Ref },
		material: { type: Types.Ref },
	};
}

export class Collider extends ColliderComponent {
	shape: import('@dimforge/rapier3d/rapier').Shape;
	material: PhysicsMaterial;
	private _colliderDesc: import('@dimforge/rapier3d/rapier').ColliderDesc;
	private _collider: import('@dimforge/rapier3d/rapier').Collider;

	onAdd(): void {
		if (!this.shape) throw new Error('Collider shape not defined');
		if (!this.material) {
			this.material = new PhysicsMaterial();
		}
		this.material.attachedColliders.push(this);
		const RAPIER = Core.getInstance().RAPIER;
		const rapierWorld = Core.getInstance().physicsWorld;
		if ((this.shape as PrimitiveShape).isPrimitiveShape) {
			(this.shape as PrimitiveShape).setInitialScale(this.gameObject.scale);
		}
		this._colliderDesc = new RAPIER.ColliderDesc(this.shape)
			.setDensity(this.material.density)
			.setFriction(this.material.friction)
			.setFrictionCombineRule(this.material.frictionCombine as any)
			.setRestitution(this.material.restitution)
			.setRestitutionCombineRule(this.material.restitutionCombine as any);
		if (this.gameObject.hasComponent(RigidBody)) {
			const rigidBody = (this.gameObject.getComponent(RigidBody) as RigidBody)
				.body;
			this._collider = rapierWorld.createCollider(
				this._colliderDesc,
				rigidBody,
			);
		} else {
			this._collider = rapierWorld.createCollider(this._colliderDesc);
		}
		this.setActiveCollisionTypes();
	}

	updateMaterial() {
		if (!this._collider) return;
		this._collider.setDensity(this.material.density);
		this._collider.setFriction(this.material.friction);
		this._collider.setFrictionCombineRule(this.material.frictionCombine as any);
		this._collider.setRestitution(this.material.restitution);
		this._collider.setRestitutionCombineRule(
			this.material.restitutionCombine as any,
		);
	}

	onRemove(): void {
		const rapierWorld = Core.getInstance().physicsWorld;
		rapierWorld.removeCollider(this._collider, true);
	}

	get scale() {
		if ((this.shape as PrimitiveShape).isPrimitiveShape) {
			return (this.shape as PrimitiveShape).scale;
		} else {
			console.warn(
				'Generic collider shape does not support scaling. Use a primitive shape instead.',
			);
			return new Vector3();
		}
	}

	setScale(scale: Vector3) {
		if ((this.shape as PrimitiveShape).isPrimitiveShape) {
			(this.shape as PrimitiveShape).setScale(scale);
			this._collider.setShape(this.shape);
		} else {
			console.warn(
				'Generic collider shape does not support scaling. Use a primitive shape instead.',
			);
		}
	}

	setActiveCollisionTypes(
		type: ActiveCollisionTypes = ActiveCollisionTypes.DEFAULT,
	) {
		this._collider.setActiveCollisionTypes(type);
	}
}
