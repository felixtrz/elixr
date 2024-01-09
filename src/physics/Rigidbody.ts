import {
	Matrix4,
	Object3D,
	Object3DEventMap,
	Quaternion,
	Vector3,
} from 'three';

import { Collider } from './Collider';
import { World as ElicsWorld } from 'elics';
import { GameObject } from '../ecs/GameObject';
import { Physics } from './Physics';
import { RigidBody } from '@dimforge/rapier3d';
import { World } from '../ecs/World';

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

export type RigidbodyOptions = {
	type?: RigidbodyType;
	gravityScale?: number;
	drag?: number;
	angularDrag?: number;
	canSleep?: boolean;
	ccdEnabled?: boolean;
};

export class Rigidbody extends GameObject {
	/** @ignore */
	[PRIVATE]: {
		rigidbody: RigidBody;
		canSleep: boolean;
		constraints: RigidbodyConstraints;
		colliderVisible: boolean;
		vec3: Vector3;
		quat: Quaternion;
		mat4: Matrix4;
	};

	constructor(
		world: ElicsWorld,
		{
			type = RigidbodyType.Dynamic,
			gravityScale = 1,
			drag = 0,
			angularDrag = 0,
			canSleep = true,
			ccdEnabled = false,
		}: RigidbodyOptions = {},
	) {
		super(world);
		const physics = (world as World).physics!;
		const rigidbodyDesc = (
			type === RigidbodyType.Dynamic
				? Physics.module.RigidBodyDesc.dynamic()
				: type === RigidbodyType.Kinematic
				? Physics.module.RigidBodyDesc.kinematicPositionBased()
				: Physics.module.RigidBodyDesc.fixed()
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
			colliderVisible: false,
			vec3: new Vector3(),
			quat: new Quaternion(),
			mat4: new Matrix4(),
		};
		physics.associateRigidBody(this[PRIVATE].rigidbody, this);
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
		this[PRIVATE].rigidbody.setEnabled(value);
	}

	setBodyType(type: RigidbodyType): void {
		const RAPIER = Physics.module;
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
			}
		});
		return this;
	}

	remove(...object: Object3D<Object3DEventMap>[]): this {
		super.remove(...object);
		object.forEach((obj) => {
			if (obj instanceof Collider) {
				obj.detachFromRigidbody();
			}
		});
		return this;
	}

	get colliders(): Collider[] {
		return this.children.filter((obj) => obj instanceof Collider) as Collider[];
	}

	get colliderVisible(): boolean {
		return this[PRIVATE].colliderVisible;
	}

	set colliderVisible(value: boolean) {
		this[PRIVATE].colliderVisible = value;
		this.colliders.forEach((collider) => {
			collider.visible = value;
		});
	}

	updateTransform(): void {
		this[PRIVATE].rigidbody.setTranslation(
			this.getWorldPosition(this[PRIVATE].vec3),
			true,
		);
		this[PRIVATE].rigidbody.setRotation(
			this.getWorldQuaternion(this[PRIVATE].quat),
			true,
		);
	}

	syncTransform(): void {
		const rbPosition = this[PRIVATE].rigidbody.translation();
		const rbQuaternion = this[PRIVATE].rigidbody.rotation();
		this.setWorldTransform(
			new Vector3(rbPosition.x, rbPosition.y, rbPosition.z),
			new Quaternion(
				rbQuaternion.x,
				rbQuaternion.y,
				rbQuaternion.z,
				rbQuaternion.w,
			),
		);
	}

	setWorldTransform = (worldPosition: Vector3, worldQuaternion: Quaternion) => {
		if (this.parent) {
			// Get the parent's world matrix
			const parentWorldMatrix = this[PRIVATE].mat4;
			this.parent.updateMatrixWorld(true);
			parentWorldMatrix.copy(this.parent.matrixWorld).invert();

			// Compute the local position
			const localPosition = worldPosition
				.clone()
				.applyMatrix4(parentWorldMatrix);

			// Compute the local quaternion
			const parentWorldQuaternion = this[PRIVATE].quat;
			this.parent.getWorldQuaternion(parentWorldQuaternion);
			const localQuaternion = worldQuaternion
				.clone()
				.multiply(parentWorldQuaternion.conjugate());

			// Set the Object3D's local position and local quaternion
			this.position.copy(localPosition);
			this.quaternion.copy(localQuaternion);
		} else {
			// If there's no parent, the world transform is the local transform
			this.position.copy(worldPosition);
			this.quaternion.copy(worldQuaternion);
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
