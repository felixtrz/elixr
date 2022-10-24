import * as THREE from 'three';

import { GameComponent } from '../GameComponent';
import { Types } from 'ecsy';

export class PhysicsComponent extends GameComponent {}

PhysicsComponent.schema = {
	gravity: { type: Types.Ref },
	solverIterations: { type: Types.Number, default: 2 },
	stepTime: { type: Types.Number, default: 1 / 60 },
	world: { type: Types.Ref },
};

export class RigidBodyComponent extends GameComponent {
	/**
	 * Sync rigid body transform to rendered object
	 *
	 * @param {THREE.Object3D} object3D
	 */
	copyTransformToObject3D(object3D) {
		if (this._body) {
			object3D.position.copy(this._body.position);
			object3D.quaternion.copy(this._body.quaternion);
		} else {
			console.warn('Rigid body is not initialized yet');
		}
	}

	/**
	 * Set rigid body transform from rendered object
	 *
	 * @param {THREE.Object3D} object3D
	 */
	setTransformFromObject3D(object3D) {
		this._positionUpdate = object3D.getWorldPosition(new THREE.Vector3());
		this._quaternionUpdate = object3D.getWorldQuaternion(
			new THREE.Quaternion(),
		);
	}

	remove() {
		this._body.removalFlag = true;
	}

	/** @readonly */
	get position() {
		return new THREE.Vector3().copy(this._body.position);
	}

	/** @readonly */
	get quaternion() {
		return new THREE.Quaternion().copy(this._body.quaternion);
	}

	/** @param {THREE.Vector3} vec3 */
	setVelocity(vec3) {
		this._velocityUpdate = new THREE.Vector3().copy(vec3);
	}

	/** @param {THREE.Vector3} vec3 */
	setAngularVelocity(vec3) {
		this._angularVelocityUpdate = new THREE.Vector3().copy(vec3);
	}

	/** @param {THREE.Vector3} vec3 */
	setPosition(vec3) {
		this._positionUpdate = new THREE.Vector3().copy(vec3);
	}

	/** @param {THREE.Quaternion} quat */
	setQuaternion(quat) {
		this._quaternionUpdate = new THREE.Quaternion().copy(quat);
	}

	/** @param {Number} type */
	setBodyType(type) {
		this.type = type;
	}

	onRemove() {
		this._body.removalFlag = true;
	}
}

RigidBodyComponent.schema = {
	mass: { type: Types.Number, default: 0 },
	shape: { type: Types.Ref },
	type: { type: Types.String },
	initVelocity: { type: Types.Ref },

	active: { type: Types.Boolean, default: true },
	angularDamping: { type: Types.Number, default: 0.01 },
	angularConstraints: { type: Types.Ref },
	linearDamping: { type: Types.Number, default: 0.01 },
	linearConstraints: { type: Types.Ref },
	collisionGroup: { type: Types.Number, default: 1 },
	fixedRotation: { type: Types.Boolean, default: false },
	isTrigger: { type: Types.Boolean, default: false },

	_body: { type: Types.Ref },
	_velocityUpdate: { type: Types.Ref },
	_angularVelocityUpdate: { type: Types.Ref },
	_positionUpdate: { type: Types.Ref },
	_quaternionUpdate: { type: Types.Ref },
};
