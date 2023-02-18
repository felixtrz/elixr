import * as Physics from 'cannon-es';

import { GameSystem } from '../core/GameSystem';
import { RigidBodyComponent } from './PhysicsComponents';
import { SystemConfig } from '../core/GameComponent';
import { THREE } from '../graphics/CustomTHREE';
import { Types } from 'ecsy';

const calculateRotationVector = (quat: THREE.Quaternion) => {
	const vec3 = new THREE.Vector3();
	const angle = 2 * Math.acos(quat.w);
	var s;
	if (1 - quat.w * quat.w < 1e-6) {
		s = 1;
	} else {
		s = Math.sqrt(1 - quat.w * quat.w);
	}
	vec3
		.set(quat.x / s, quat.y / s, quat.z / s)
		.normalize()
		.multiplyScalar(angle);

	return isNaN(vec3.length()) ? new THREE.Vector3() : vec3;
};

const threeVec3toCannonVec3 = (vec3: THREE.Vector3) => {
	if (vec3 != null) {
		return new Physics.Vec3(vec3.x, vec3.y, vec3.z);
	} else {
		return null;
	}
};

const copyThreeVec3ToCannonVec3 = (
	cannonVec3: Physics.Vec3,
	threeVec3: THREE.Vector3,
) => {
	cannonVec3.set(threeVec3.x, threeVec3.y, threeVec3.z);
};

const copyThreeQuatToCannonQuat = (
	cannonQuat: Physics.Quaternion,
	threeQuat: THREE.Quaternion,
) => {
	cannonQuat.set(threeQuat.x, threeQuat.y, threeQuat.z, threeQuat.w);
};

export type ExtendedBody = Physics.Body & { removalFlag: boolean };

class PhysicsComponent extends SystemConfig {}

PhysicsComponent.schema = {
	gravity: { type: Types.Ref },
	solverIterations: { type: Types.Number, default: 2 },
	stepTime: { type: Types.Number, default: 1 / 60 },
	world: { type: Types.Ref },
};

export interface PhysicsConfig extends PhysicsComponent {
	gravity: THREE.Vector3;
	solverIterations: number;
	stepTime: number;
	world: Physics.World;
}

export class RigidBodyPhysicsSystem extends GameSystem {
	private _config: PhysicsConfig;

	init() {
		this._config = this.config as PhysicsConfig;
	}

	update(delta: number, _time: number) {
		// physics is not initialized
		if (!this._config.world) return;

		this._config.world.gravity.set(
			this._config.gravity.x,
			this._config.gravity.y,
			this._config.gravity.z,
		);
		(this._config.world.solver as Physics.GSSolver).iterations =
			this._config.solverIterations;
		this._config.world.allowSleep = true;
		this.queryAddedGameObjects('rigidBodies').forEach((gameObject) => {
			const rigidBody = gameObject.getMutableComponent(
				RigidBodyComponent,
			) as RigidBodyComponent;
			const body = new Physics.Body({
				angularDamping: rigidBody.angularDamping,
				angularFactor: threeVec3toCannonVec3(rigidBody.angularConstraints),
				linearDamping: rigidBody.linearDamping,
				linearFactor: threeVec3toCannonVec3(rigidBody.linearConstraints),
				collisionFilterGroup: rigidBody.collisionGroup,
				fixedRotation: rigidBody.fixedRotation,
				isTrigger: rigidBody.isTrigger,
				mass: rigidBody.mass,
				shape: rigidBody.shape,
				type: rigidBody.type,
				material: rigidBody.material,
				velocity: new Physics.Vec3(),
				allowSleep: rigidBody.allowSleep,
				sleepSpeedLimit: rigidBody.sleepSpeedLimit,
				sleepTimeLimit: rigidBody.sleepTimeLimit,
			});
			body.allowSleep = true;
			if (rigidBody.initVelocity)
				body.velocity.copy(threeVec3toCannonVec3(rigidBody.initVelocity));
			this._config.world.addBody(body);
			rigidBody._body = body;
			rigidBody.setTransformFromObject3D(gameObject);
		});

		this._preStep(delta);
		this._config.world.step(this._config.stepTime, delta);
		this._postStep();
	}

	_preStep(delta: number) {
		[...this._config.world.bodies].forEach((body) => {
			if ((body as ExtendedBody).removalFlag) {
				this._config.world.removeBody(body);
			}
		});
		this.queryGameObjects('rigidBodies').forEach((gameObject) => {
			const rigidBody = gameObject.getMutableComponent(
				RigidBodyComponent,
			) as RigidBodyComponent;
			rigidBody._body.type = rigidBody.type;
			if (rigidBody._velocityUpdate) {
				copyThreeVec3ToCannonVec3(
					rigidBody._body.velocity,
					rigidBody._velocityUpdate,
				);
				rigidBody._velocityUpdate = null;
			}
			if (rigidBody._angularVelocityUpdate) {
				copyThreeVec3ToCannonVec3(
					rigidBody._body.angularVelocity,
					rigidBody._angularVelocityUpdate,
				);
				rigidBody._angularVelocityUpdate = null;
			}
			if (rigidBody._positionUpdate) {
				copyThreeVec3ToCannonVec3(
					rigidBody._body.position,
					rigidBody._positionUpdate,
				);
				rigidBody._positionUpdate = null;
			}
			if (rigidBody._quaternionUpdate) {
				copyThreeQuatToCannonQuat(
					rigidBody._body.quaternion,
					rigidBody._quaternionUpdate,
				);
				rigidBody._quaternionUpdate = null;
			}
			if (rigidBody._body.type === Physics.BODY_TYPES.KINEMATIC) {
				const deltaPosVec3 = gameObject
					.getWorldPosition(new THREE.Vector3())
					.sub(rigidBody.position);
				copyThreeVec3ToCannonVec3(
					rigidBody._body.velocity,
					deltaPosVec3.divideScalar(delta),
				);
				const deltaQuat = gameObject
					.getWorldQuaternion(new THREE.Quaternion())
					.multiply(
						new THREE.Quaternion().copy(rigidBody.quaternion).conjugate(),
					);
				copyThreeVec3ToCannonVec3(
					rigidBody._body.angularVelocity,
					calculateRotationVector(deltaQuat).divideScalar(delta),
				);
			}
		});
	}

	_postStep() {
		this.queryGameObjects('rigidBodies').forEach((gameObject) => {
			const rigidBody = gameObject.getMutableComponent(
				RigidBodyComponent,
			) as RigidBodyComponent;
			if (rigidBody.type != Physics.BODY_TYPES.DYNAMIC) return;
			switch (rigidBody.type as Physics.BodyType) {
				case Physics.BODY_TYPES.DYNAMIC:
					if (gameObject.parent == this.core.scene) {
						rigidBody.copyTransformToObject3D(gameObject);
					} else {
						const parent = gameObject.parent;
						this.core.scene.attach(gameObject);
						rigidBody.copyTransformToObject3D(gameObject);
						parent.attach(gameObject);
					}
					break;
				case Physics.BODY_TYPES.KINEMATIC:
					rigidBody.setTransformFromObject3D(gameObject);
					break;
				default:
					break;
			}
		});
	}
}

RigidBodyPhysicsSystem.queries = {
	rigidBodies: {
		components: [RigidBodyComponent],
		listen: {
			added: true,
		},
	},
};

RigidBodyPhysicsSystem.systemConfig = PhysicsComponent;
