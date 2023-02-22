import { CollisionDetectionMode, RigidBodyConstraints } from './PhysicsHelper';
import { Quaternion, Vector3 } from 'three';

import { Core } from '../core/Core';
import { GameComponent } from '../core/GameComponent';
import { RigidBodyType } from '@dimforge/rapier3d';
import { Types } from 'ecsy';

export type RigidBodyInitConfig = {
	position: Vector3;
	rotation: Quaternion;
	constraints: RigidBodyConstraints;
	freezePosition: boolean;
	freezeRotation: boolean;
	angularDrag: number;
	angularVelocity: Vector3;
	drag: number;
	velocity: Vector3;
	collisionDetectionMode: CollisionDetectionMode;
	gravityScale: number;
	bodyType: RigidBodyType;
};

class RigidBodyComponent extends GameComponent<any> {
	static schema = {
		initConfig: { type: Types.Ref },
	};
}

export class RigidBody extends RigidBodyComponent {
	body: import('@dimforge/rapier3d').RigidBody;
	initConfig: RigidBodyInitConfig;

	get position() {
		const translation = this.body.translation();
		return new Vector3(translation.x, translation.y, translation.z);
	}

	get quaternion() {
		const rotation = this.body.rotation();
		return new Quaternion(rotation.x, rotation.y, rotation.z, rotation.w);
	}

	setConstraints(constraints: RigidBodyConstraints) {
		this.body.setEnabledTranslations(
			constraints.translational.x,
			constraints.translational.y,
			constraints.translational.z,
			true,
		);
		this.body.setEnabledRotations(
			constraints.rotational.x,
			constraints.rotational.y,
			constraints.rotational.z,
			true,
		);
	}

	setFreezePosition(value: boolean) {
		this.body.lockTranslations(value, true);
	}

	setFreezeRotation(value: boolean) {
		this.body.lockRotations(value, true);
	}

	set angularDrag(value: number) {
		this.body.setAngularDamping(value);
	}

	get angularDrag(): number {
		return this.body.angularDamping();
	}

	set angularVelocity(value: Vector3) {
		this.body.setAngvel(value, true);
	}

	get angularVelocity(): Vector3 {
		const angvel = this.body.angvel();
		return new Vector3(angvel.x, angvel.y, angvel.z);
	}

	set drag(value: number) {
		this.body.setLinearDamping(value);
	}

	get drag(): number {
		return this.body.linearDamping();
	}

	set velocity(value: Vector3) {
		this.body.setLinvel(value, true);
	}

	get velocity(): Vector3 {
		const linvel = this.body.linvel();
		return new Vector3(linvel.x, linvel.y, linvel.z);
	}

	set collisionDetectionMode(value: CollisionDetectionMode) {
		this.body.enableCcd(value === CollisionDetectionMode.Continuous);
	}

	get collisionDetectionMode(): CollisionDetectionMode {
		return this.body.isCcdEnabled()
			? CollisionDetectionMode.Continuous
			: CollisionDetectionMode.Discrete;
	}

	get isKinematic(): boolean {
		return this.body.isKinematic();
	}

	get isSleeping(): boolean {
		return this.body.isSleeping();
	}

	get useGravity() {
		return this.body.gravityScale() !== 0;
	}

	set gravityScale(value: number) {
		this.body.setGravityScale(value, true);
	}

	get gravityScale(): number {
		return this.body.gravityScale();
	}

	get bodyType(): RigidBodyType {
		return this.body.bodyType();
	}

	set bodyType(value: RigidBodyType) {
		this.body.setBodyType(value, true);
	}

	onAdd(): void {
		this.initConfig = {
			position: this.initConfig?.position || new Vector3(),
			rotation: this.initConfig?.rotation || new Quaternion(),
			constraints: this.initConfig?.constraints || {
				translational: {
					x: true,
					y: true,
					z: true,
				},
				rotational: {
					x: true,
					y: true,
					z: true,
				},
			},
			freezePosition: this.initConfig?.freezePosition || false,
			freezeRotation: this.initConfig?.freezeRotation || false,
			angularDrag: this.initConfig?.angularDrag || 0,
			angularVelocity: this.initConfig?.angularVelocity || new Vector3(),
			drag: this.initConfig?.drag || 0,
			velocity: this.initConfig?.velocity || new Vector3(),
			collisionDetectionMode:
				this.initConfig?.collisionDetectionMode ||
				CollisionDetectionMode.Discrete,
			gravityScale: this.initConfig?.gravityScale || 1,
			bodyType: this.initConfig?.bodyType || RigidBodyType.Dynamic,
		};
		const RAPIER = Core.getInstance().RAPIER;
		const rapierWorld = Core.getInstance().physicsWorld;
		let rigidBodyDesc = new RAPIER.RigidBodyDesc(this.initConfig.bodyType)
			.setTranslation(
				this.initConfig.position.x,
				this.initConfig.position.y,
				this.initConfig.position.z,
			)
			.setRotation(this.initConfig.rotation)
			.enabledRotations(
				this.initConfig.constraints.rotational.x,
				this.initConfig.constraints.rotational.y,
				this.initConfig.constraints.rotational.z,
			)
			.enabledTranslations(
				this.initConfig.constraints.translational.x,
				this.initConfig.constraints.translational.y,
				this.initConfig.constraints.translational.z,
			)
			.setLinvel(
				this.initConfig.velocity.x,
				this.initConfig.velocity.y,
				this.initConfig.velocity.z,
			)
			.setLinearDamping(this.initConfig.drag)
			.setAngvel(this.initConfig.angularVelocity)
			.setAngularDamping(this.initConfig.angularDrag)
			.setGravityScale(this.initConfig.gravityScale)
			.setCanSleep(true)
			.setCcdEnabled(this.initConfig.collisionDetectionMode === 'Continuous');

		if (this.initConfig.freezePosition) {
			rigidBodyDesc = rigidBodyDesc.lockTranslations();
		}
		if (this.initConfig.freezeRotation) {
			rigidBodyDesc = rigidBodyDesc.lockRotations();
		}

		this.body = rapierWorld.createRigidBody(rigidBodyDesc);

		this.body.setTranslation(this.gameObject.position, true);
		this.body.setRotation(this.gameObject.quaternion, true);
	}

	onRemove(): void {
		const rapierWorld = Core.getInstance().physicsWorld;
		rapierWorld.removeRigidBody(this.body);
	}
}
