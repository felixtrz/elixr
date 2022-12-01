import * as CANNON from 'cannon-es';

import { GameComponent } from '../GameComponent';
import { THREE } from '../index';
import { Types } from 'ecsy';

export class RigidBodyComponent extends GameComponent<any> {
	mass: number;
	shape: CANNON.Shape;
	type: CANNON.BodyType;
	initVelocity: THREE.Vector3;

	angularDamping?: number;
	angularConstraints?: THREE.Vector3;
	linearDamping?: number;
	linearConstraints?: THREE.Vector3;
	collisionGroup?: number;
	fixedRotation?: boolean;
	isTrigger?: boolean;

	_body: CANNON.Body;
	_positionUpdate?: THREE.Vector3;
	_quaternionUpdate?: THREE.Quaternion;
	_velocityUpdate?: THREE.Vector3;
	_angularVelocityUpdate?: THREE.Vector3;

	copyTransformToObject3D(object3D: THREE.Object3D) {
		if (this._body) {
			object3D.position.set(
				this._body.position.x,
				this._body.position.y,
				this._body.position.z,
			);
			object3D.quaternion.set(
				this._body.quaternion.x,
				this._body.quaternion.y,
				this._body.quaternion.z,
				this._body.quaternion.w,
			);
		} else {
			console.warn('Rigid body is not initialized yet');
		}
	}

	setTransformFromObject3D(object3D: THREE.Object3D) {
		this._positionUpdate = object3D.getWorldPosition(new THREE.Vector3());
		this._quaternionUpdate = object3D.getWorldQuaternion(
			new THREE.Quaternion(),
		);
	}

	remove() {
		this.onRemove();
	}

	get position() {
		return new THREE.Vector3(
			this._body.position.x,
			this._body.position.y,
			this._body.position.z,
		);
	}

	set position(vec3: THREE.Vector3) {
		this._positionUpdate = new THREE.Vector3().copy(vec3);
	}

	get quaternion() {
		return new THREE.Quaternion(
			this._body.quaternion.x,
			this._body.quaternion.y,
			this._body.quaternion.z,
			this._body.quaternion.w,
		);
	}

	set quaternion(quat: THREE.Quaternion) {
		this._quaternionUpdate = new THREE.Quaternion().copy(quat);
	}

	get velocity() {
		return new THREE.Vector3(
			this._body.velocity.x,
			this._body.velocity.y,
			this._body.velocity.z,
		);
	}

	set velocity(vec3: THREE.Vector3) {
		this._velocityUpdate = new THREE.Vector3().copy(vec3);
	}

	get angularVelocity() {
		return new THREE.Vector3(
			this._body.angularVelocity.x,
			this._body.angularVelocity.y,
			this._body.angularVelocity.z,
		);
	}

	set angularVelocity(vec3: THREE.Vector3) {
		this._angularVelocityUpdate = new THREE.Vector3().copy(vec3);
	}

	onRemove() {
		if (this._body.world) {
			this._body.world.removeBody(this._body);
		}
	}
}

RigidBodyComponent.schema = {
	mass: { type: Types.Number, default: 0 },
	shape: { type: Types.Ref },
	type: { type: Types.Number },
	initVelocity: { type: Types.Ref },

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
