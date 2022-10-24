import * as CANNON from 'cannon-es';
import * as THREE from 'three';

import { GameSystem } from '../GameSystem';
import { RigidBodyComponent } from './PhysicsComponents';

THREE.Vector3.prototype.setFromQuaternion = function (quat) {
	const angle = 2 * Math.acos(quat.w);
	var s;
	if (1 - quat.w * quat.w < 1e-6) {
		s = 1;
	} else {
		s = Math.sqrt(1 - quat.w * quat.w);
	}
	this.set(quat.x / s, quat.y / s, quat.z / s);
	if (this.length() < 1e-6) {
		this.set(0, 0, 0);
	} else {
		this.normalize().multiplyScalar(angle);
	}
	return this;
};

export class RigidBodyPhysicsSystem extends GameSystem {
	init() {
		this.physicsWorld = new CANNON.World();
		this.physicsWorld.broadphase = new CANNON.NaiveBroadphase();
		this.core.physics.world = this.physicsWorld;
	}

	update(delta, _time) {
		this.physicsWorld.gravity.copy(this.core.physics.gravity);
		this.physicsWorld.solver.iteractions = this.core.physics.solverIterations;
		this.queryAddedGameObjects('rigidBodies').forEach((gameObject) => {
			const rigidBody = gameObject.getMutableComponent(RigidBodyComponent);
			const body = new CANNON.Body({
				angularDamping: rigidBody.angularDamping,
				angularFactor: rigidBody.angularConstraints,
				linearDamping: rigidBody.linearDamping,
				linearFactor: rigidBody.linearConstraints,
				collisionFilterGroup: rigidBody.collisionGroup,
				fixedRotation: rigidBody.fixedRotation,
				isTrigger: rigidBody.isTrigger,
				mass: rigidBody.mass,
				shape: rigidBody.shape,
				type: rigidBody.type,
				velocity: new CANNON.Vec3(),
			});
			if (rigidBody.initVelocity) body.velocity.copy(rigidBody.initVelocity);
			this.physicsWorld.addBody(body);
			rigidBody._body = body;
			rigidBody.setTransformFromObject3D(gameObject);
		});

		this._preStep(delta);
		this.physicsWorld.step(this.core.physics.stepTime, delta);
		this._postStep();
	}

	_preStep(delta) {
		[...this.physicsWorld.bodies].forEach((body) => {
			if (body.removalFlag) {
				this.physicsWorld.removeBody(body);
			}
		});
		this.queryGameObjects('rigidBodies').forEach((gameObject) => {
			const rigidBody = gameObject.getMutableComponent(RigidBodyComponent);
			if (rigidBody._body.removalFlag) {
				this.physicsWorld.removeBody(rigidBody._body);
			}
			rigidBody._body.type = rigidBody.type;
			if (rigidBody._velocityUpdate) {
				rigidBody._body.velocity.copy(rigidBody._velocityUpdate);
				rigidBody._velocityUpdate = null;
			}
			if (rigidBody._angularVelocityUpdate) {
				rigidBody._body.angularVelocity.copy(rigidBody._angularVelocityUpdate);
				rigidBody._angularVelocityUpdate = null;
			}
			if (rigidBody._positionUpdate) {
				rigidBody._body.position.copy(rigidBody._positionUpdate);
				rigidBody._positionUpdate = null;
			}
			if (rigidBody._quaternionUpdate) {
				rigidBody._body.quaternion.copy(rigidBody._quaternionUpdate);
				rigidBody._quaternionUpdate = null;
			}
			if (rigidBody._body.type == CANNON.BODY_TYPES.KINEMATIC) {
				const deltaPosVec3 = gameObject
					.getWorldPosition(new THREE.Vector3())
					.sub(rigidBody.position);
				rigidBody._body.velocity.copy(deltaPosVec3.divideScalar(delta));
				const deltaQuat = gameObject
					.getWorldQuaternion(new THREE.Quaternion())
					.multiply(
						new THREE.Quaternion().copy(rigidBody.quaternion).conjugate(),
					);
				rigidBody._body.angularVelocity.copy(
					new THREE.Vector3().setFromQuaternion(deltaQuat).divideScalar(delta),
				);
			}
		});
	}

	_postStep() {
		this.queryGameObjects('rigidBodies').forEach((gameObject) => {
			const rigidBody = gameObject.getMutableComponent(RigidBodyComponent);
			if (rigidBody.type != CANNON.BODY_TYPES.DYNAMIC) return;
			switch (rigidBody.type) {
				case CANNON.BODY_TYPES.DYNAMIC:
					if (gameObject.parent == this.core.scene) {
						rigidBody.copyTransformToObject3D(gameObject);
					} else {
						const parent = gameObject.parent;
						this.core.scene.attach(gameObject);
						rigidBody.copyTransformToObject3D(gameObject);
						parent.attach(gameObject);
					}
					break;
				case CANNON.BODY_TYPES.KINEMATIC:
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
