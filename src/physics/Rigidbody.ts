import {
	Matrix4,
	Object3D,
	Object3DEventMap,
	Quaternion,
	Vector3,
} from 'three';

import { Collider } from './Collider';
import { Physics } from './Physics';
import { RigidBody } from '@dimforge/rapier3d';

export const PRIVATE = Symbol('@elixr/physics/rigidbody');

export enum RigidbodyType {
	Dynamic = 'dynamic',
	Kinematic = 'kinematic',
	Fixed = 'fixed',
}

export enum RigidbodyConstraints {
	None = 0,
	FreezePositionX = 1 << 0,
	FreezePositionY = 1 << 1,
	FreezePositionZ = 1 << 2,
	FreezeRotationX = 1 << 3,
	FreezeRotationY = 1 << 4,
	FreezeRotationZ = 1 << 5,
	FreezePosition = FreezePositionX | FreezePositionY | FreezePositionZ,
	FreezeRotation = FreezeRotationX | FreezeRotationY | FreezeRotationZ,
	FreezeAll = FreezePosition | FreezeRotation,
}

export class Rigidbody extends Object3D {
	/** @ignore */
	[PRIVATE]: {
		rigidbody: RigidBody;
		canSleep: boolean;
		constraints: RigidbodyConstraints;
		vec3: Vector3;
		quat: Quaternion;
		mat4: Matrix4;
	};

	constructor({
		type = RigidbodyType.Dynamic,
		gravityScale = 1,
		drag = 0,
		angularDrag = 0,
		canSleep = true,
		ccdEnabled = false,
	} = {}) {
		super();
		const physics = Physics.getInstance();
		const rigidbodyDesc = (
			type === RigidbodyType.Dynamic
				? physics.module.RigidBodyDesc.dynamic()
				: type === RigidbodyType.Kinematic
				? physics.module.RigidBodyDesc.kinematicPositionBased()
				: physics.module.RigidBodyDesc.fixed()
		)
			.setGravityScale(gravityScale)
			.setLinearDamping(drag)
			.setAngularDamping(angularDrag)
			.setCanSleep(canSleep)
			.setCcdEnabled(ccdEnabled);
		this[PRIVATE] = {
			rigidbody: physics.world.createRigidBody(rigidbodyDesc),
			canSleep,
			constraints: RigidbodyConstraints.None,
			vec3: new Vector3(),
			quat: new Quaternion(),
			mat4: new Matrix4(),
		};
		physics.associateRigidBody(this[PRIVATE].rigidbody, this);
		this.addEventListener('added', () => {
			this.syncTransformFromRenderedObject();
			this[PRIVATE].rigidbody.setEnabled(true);
		});
		this.addEventListener('removed', () => {
			this[PRIVATE].rigidbody.setEnabled(false);
		});
		this.visible = true;
	}

	get isDynamic(): boolean {
		return this[PRIVATE].rigidbody.isDynamic();
	}

	get isKinematic(): boolean {
		return this[PRIVATE].rigidbody.isKinematic();
	}

	get isStatic(): boolean {
		return this[PRIVATE].rigidbody.isFixed();
	}

	get enabled(): boolean {
		return this[PRIVATE].rigidbody.isEnabled();
	}

	set enabled(value: boolean) {
		if (this.parent) {
			this[PRIVATE].rigidbody.setEnabled(value);
		}
	}

	setBodyType(type: RigidbodyType): void {
		const RAPIER = Physics.getInstance().module;
		this[PRIVATE].rigidbody.setBodyType(
			type === RigidbodyType.Dynamic
				? RAPIER.RigidBodyType.Dynamic
				: type === RigidbodyType.Kinematic
				? RAPIER.RigidBodyType.KinematicPositionBased
				: RAPIER.RigidBodyType.Fixed,
			true,
		);
	}

	get mass(): number {
		return this[PRIVATE].rigidbody.mass();
	}

	/** @readonly */
	get linearVelocity(): Vector3 {
		const linvel = this[PRIVATE].rigidbody.linvel();
		return new Vector3().set(linvel.x, linvel.y, linvel.z);
	}

	setLinearVelocity(linearVelocity: Vector3): void {
		this[PRIVATE].rigidbody.setLinvel(
			{ x: linearVelocity.x, y: linearVelocity.y, z: linearVelocity.z },
			true,
		);
	}

	/** @readonly */
	get angularVelocity(): Vector3 {
		const angvel = this[PRIVATE].rigidbody.angvel();
		return new Vector3().set(angvel.x, angvel.y, angvel.z);
	}

	setAngularVelocity(angularVelocity: Vector3): void {
		this[PRIVATE].rigidbody.setAngvel(
			{ x: angularVelocity.x, y: angularVelocity.y, z: angularVelocity.z },
			true,
		);
	}

	get gravityScale(): number {
		return this[PRIVATE].rigidbody.gravityScale();
	}

	set gravityScale(value: number) {
		this[PRIVATE].rigidbody.setGravityScale(value, true);
	}

	get drag(): number {
		return this[PRIVATE].rigidbody.linearDamping();
	}

	set drag(value: number) {
		this[PRIVATE].rigidbody.setLinearDamping(value);
	}

	get angularDrag(): number {
		return this[PRIVATE].rigidbody.angularDamping();
	}

	set angularDrag(value: number) {
		this[PRIVATE].rigidbody.setAngularDamping(value);
	}

	get isSleeping(): boolean {
		return this[PRIVATE].rigidbody.isSleeping();
	}

	get canSleep(): boolean {
		return this[PRIVATE].canSleep;
	}

	applyForce(force: Vector3): void {
		this[PRIVATE].rigidbody.addForce(force, true);
	}

	applyTorque(torque: Vector3): void {
		this[PRIVATE].rigidbody.addTorque(torque, true);
	}

	applyImpulse(impulse: Vector3): void {
		this[PRIVATE].rigidbody.applyImpulse(impulse, true);
	}

	applyTorqueImpulse(torqueImpulse: Vector3): void {
		this[PRIVATE].rigidbody.applyTorqueImpulse(torqueImpulse, true);
	}

	get constraints(): RigidbodyConstraints {
		return this[PRIVATE].constraints;
	}

	set constraints(value: RigidbodyConstraints) {
		this[PRIVATE].constraints = value;

		// Apply position constraints
		this[PRIVATE].rigidbody.setEnabledTranslations(
			(value & RigidbodyConstraints.FreezePositionX) === 0,
			(value & RigidbodyConstraints.FreezePositionY) === 0,
			(value & RigidbodyConstraints.FreezePositionZ) === 0,
			true,
		);

		// Apply rotation constraints
		this[PRIVATE].rigidbody.setEnabledRotations(
			(value & RigidbodyConstraints.FreezeRotationX) === 0,
			(value & RigidbodyConstraints.FreezeRotationY) === 0,
			(value & RigidbodyConstraints.FreezeRotationZ) === 0,
			true,
		);
	}

	wakeUp(): void {
		this[PRIVATE].rigidbody.wakeUp();
	}

	sleep(): void {
		this[PRIVATE].rigidbody.sleep();
	}

	add(...object: Object3D<Object3DEventMap>[]): this {
		super.add(...object);
		object.forEach((obj) => {
			if (obj instanceof Collider) {
				obj.attachToRigidbody(this[PRIVATE].rigidbody);
			} else {
				throw new Error('Only Colliders can be added to a Rigidbody');
			}
		});
		return this;
	}

	remove(...object: Object3D<Object3DEventMap>[]): this {
		super.remove(...object);
		object.forEach((obj) => {
			if (obj instanceof Collider) {
				obj.detachFromRigidbody();
			} else {
				throw new Error('Only Colliders can be removed from a Rigidbody');
			}
		});
		return this;
	}

	syncTransformFromRenderedObject(): void {
		const rendereredObject = this.parent;
		if (rendereredObject) {
			this[PRIVATE].rigidbody.setTranslation(
				rendereredObject.getWorldPosition(this[PRIVATE].vec3),
				true,
			);
			this[PRIVATE].rigidbody.setRotation(
				rendereredObject.getWorldQuaternion(this[PRIVATE].quat),
				true,
			);
		}
	}

	syncTransformToRenderedObject(): void {
		const rendereredObject = this.parent;
		const rbPosition = this[PRIVATE].rigidbody.translation();
		const rbQuaternion = this[PRIVATE].rigidbody.rotation();
		if (rendereredObject) {
			this.setWorldTransform(
				rendereredObject,
				new Vector3(rbPosition.x, rbPosition.y, rbPosition.z),
				new Quaternion(
					rbQuaternion.x,
					rbQuaternion.y,
					rbQuaternion.z,
					rbQuaternion.w,
				),
			);
		}
	}

	setWorldTransform = (
		object3D: Object3D,
		worldPosition: Vector3,
		worldQuaternion: Quaternion,
	) => {
		if (object3D.parent) {
			// Get the parent's world matrix
			const parentWorldMatrix = this[PRIVATE].mat4;
			object3D.parent.updateMatrixWorld(true);
			parentWorldMatrix.copy(object3D.parent.matrixWorld).invert();

			// Compute the local position
			const localPosition = worldPosition
				.clone()
				.applyMatrix4(parentWorldMatrix);

			// Compute the local quaternion
			const parentWorldQuaternion = this[PRIVATE].quat;
			object3D.parent.getWorldQuaternion(parentWorldQuaternion);
			const localQuaternion = worldQuaternion
				.clone()
				.multiply(parentWorldQuaternion.conjugate());

			// Set the Object3D's local position and local quaternion
			object3D.position.copy(localPosition);
			object3D.quaternion.copy(localQuaternion);
		} else {
			// If there's no parent, the world transform is the local transform
			object3D.position.copy(worldPosition);
			object3D.quaternion.copy(worldQuaternion);
		}
	};

	updateMatrixWorld(force?: boolean): void {
		super.updateMatrixWorld(force);
		// this.syncTransformFromRenderedObject();
	}

	/** @ignore */
	get rapierRigidbody(): RigidBody {
		return this[PRIVATE].rigidbody;
	}
}
