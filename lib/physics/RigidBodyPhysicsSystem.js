"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RigidBodyPhysicsSystem = void 0;
const CANNON = __importStar(require("cannon-es"));
const THREE = __importStar(require("three"));
const GameSystem_1 = require("../GameSystem");
const PhysicsComponents_1 = require("./PhysicsComponents");
const calculateRotationVector = (quat) => {
    const vec3 = new THREE.Vector3();
    const angle = 2 * Math.acos(quat.w);
    var s;
    if (1 - quat.w * quat.w < 1e-6) {
        s = 1;
    }
    else {
        s = Math.sqrt(1 - quat.w * quat.w);
    }
    vec3.set(quat.x / s, quat.y / s, quat.z / s);
    if (vec3.length() < 1e-6) {
        vec3.set(0, 0, 0);
    }
    else {
        vec3.normalize().multiplyScalar(angle);
    }
    return vec3;
};
const threeVec3toCannonVec3 = (vec3) => {
    if (vec3 != null) {
        return new CANNON.Vec3(vec3.x, vec3.y, vec3.z);
    }
    else {
        return null;
    }
};
const copyThreeVec3ToCannonVec3 = (cannonVec3, threeVec3) => {
    cannonVec3.set(threeVec3.x, threeVec3.y, threeVec3.z);
};
const copyThreeQuatToCannonQuat = (cannonQuat, threeQuat) => {
    cannonQuat.set(threeQuat.x, threeQuat.y, threeQuat.z, threeQuat.w);
};
class RigidBodyPhysicsSystem extends GameSystem_1.GameSystem {
    init() {
        const physicsWorld = new CANNON.World();
        physicsWorld.broadphase = new CANNON.NaiveBroadphase();
        this.core.physics.world = physicsWorld;
    }
    update(delta, _time) {
        this.core.physics.world.gravity.set(this.core.physics.gravity.x, this.core.physics.gravity.y, this.core.physics.gravity.z);
        this.queryAddedGameObjects('rigidBodies').forEach((gameObject) => {
            const rigidBody = gameObject.getMutableComponent(PhysicsComponents_1.RigidBodyComponent);
            const body = new CANNON.Body({
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
                velocity: new CANNON.Vec3(),
            });
            if (rigidBody.initVelocity)
                body.velocity.copy(threeVec3toCannonVec3(rigidBody.initVelocity));
            this.core.physics.world.addBody(body);
            rigidBody._body = body;
            rigidBody.setTransformFromObject3D(gameObject);
        });
        this._preStep(delta);
        this.core.physics.world.step(this.core.physics.stepTime, delta);
        this._postStep();
    }
    _preStep(delta) {
        [...this.core.physics.world.bodies].forEach((body) => {
            if (body.removalFlag) {
                this.core.physics.world.removeBody(body);
            }
        });
        this.queryGameObjects('rigidBodies').forEach((gameObject) => {
            const rigidBody = gameObject.getMutableComponent(PhysicsComponents_1.RigidBodyComponent);
            rigidBody._body.type = rigidBody.type;
            if (rigidBody._velocityUpdate) {
                copyThreeVec3ToCannonVec3(rigidBody._body.velocity, rigidBody._velocityUpdate);
                rigidBody._velocityUpdate = null;
            }
            if (rigidBody._angularVelocityUpdate) {
                copyThreeVec3ToCannonVec3(rigidBody._body.angularVelocity, rigidBody._angularVelocityUpdate);
                rigidBody._angularVelocityUpdate = null;
            }
            if (rigidBody._positionUpdate) {
                copyThreeVec3ToCannonVec3(rigidBody._body.position, rigidBody._positionUpdate);
                rigidBody._positionUpdate = null;
            }
            if (rigidBody._quaternionUpdate) {
                copyThreeQuatToCannonQuat(rigidBody._body.quaternion, rigidBody._quaternionUpdate);
                rigidBody._quaternionUpdate = null;
            }
            if (rigidBody._body.type == CANNON.BODY_TYPES.KINEMATIC) {
                const deltaPosVec3 = gameObject
                    .getWorldPosition(new THREE.Vector3())
                    .sub(rigidBody.position);
                copyThreeVec3ToCannonVec3(rigidBody._body.velocity, deltaPosVec3.divideScalar(delta));
                const deltaQuat = gameObject
                    .getWorldQuaternion(new THREE.Quaternion())
                    .multiply(new THREE.Quaternion().copy(rigidBody.quaternion).conjugate());
                copyThreeVec3ToCannonVec3(rigidBody._body.angularVelocity, calculateRotationVector(deltaQuat).divideScalar(delta));
            }
        });
    }
    _postStep() {
        this.queryGameObjects('rigidBodies').forEach((gameObject) => {
            const rigidBody = gameObject.getMutableComponent(PhysicsComponents_1.RigidBodyComponent);
            if (rigidBody.type != CANNON.BODY_TYPES.DYNAMIC)
                return;
            switch (rigidBody.type) {
                case CANNON.BODY_TYPES.DYNAMIC:
                    if (gameObject.parent == this.core.scene) {
                        rigidBody.copyTransformToObject3D(gameObject);
                    }
                    else {
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
exports.RigidBodyPhysicsSystem = RigidBodyPhysicsSystem;
RigidBodyPhysicsSystem.queries = {
    rigidBodies: {
        components: [PhysicsComponents_1.RigidBodyComponent],
        listen: {
            added: true,
        },
    },
};
//# sourceMappingURL=RigidBodyPhysicsSystem.js.map