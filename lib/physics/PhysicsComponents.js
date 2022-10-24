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
exports.RigidBodyComponent = exports.PhysicsComponent = void 0;
const THREE = __importStar(require("three"));
const GameComponent_1 = require("../GameComponent");
const ecsy_1 = require("ecsy");
class PhysicsComponent extends GameComponent_1.GameComponent {
    gravity;
    solverIterations;
    stepTime;
    world;
}
exports.PhysicsComponent = PhysicsComponent;
PhysicsComponent.schema = {
    gravity: { type: ecsy_1.Types.Ref },
    solverIterations: { type: ecsy_1.Types.Number, default: 2 },
    stepTime: { type: ecsy_1.Types.Number, default: 1 / 60 },
    world: { type: ecsy_1.Types.Ref },
};
class RigidBodyComponent extends GameComponent_1.GameComponent {
    mass;
    shape;
    type;
    initVelocity;
    angularDamping;
    angularConstraints;
    linearDamping;
    linearConstraints;
    collisionGroup;
    fixedRotation;
    isTrigger;
    _body;
    _positionUpdate;
    _quaternionUpdate;
    _velocityUpdate;
    _angularVelocityUpdate;
    copyTransformToObject3D(object3D) {
        if (this._body) {
            object3D.position.set(this._body.position.x, this._body.position.y, this._body.position.z);
            object3D.quaternion.set(this._body.quaternion.x, this._body.quaternion.y, this._body.quaternion.z, this._body.quaternion.w);
        }
        else {
            console.warn('Rigid body is not initialized yet');
        }
    }
    setTransformFromObject3D(object3D) {
        this._positionUpdate = object3D.getWorldPosition(new THREE.Vector3());
        this._quaternionUpdate = object3D.getWorldQuaternion(new THREE.Quaternion());
    }
    remove() {
        this._body.removalFlag = true;
    }
    get position() {
        return new THREE.Vector3(this._body.position.x, this._body.position.y, this._body.position.z);
    }
    set position(vec3) {
        this._positionUpdate = new THREE.Vector3().copy(vec3);
    }
    get quaternion() {
        return new THREE.Quaternion(this._body.quaternion.x, this._body.quaternion.y, this._body.quaternion.z, this._body.quaternion.w);
    }
    set quaternion(quat) {
        this._quaternionUpdate = new THREE.Quaternion().copy(quat);
    }
    get velocity() {
        return new THREE.Vector3(this._body.velocity.x, this._body.velocity.y, this._body.velocity.z);
    }
    set velocity(vec3) {
        this._velocityUpdate = new THREE.Vector3().copy(vec3);
    }
    get angularVelocity() {
        return new THREE.Vector3(this._body.angularVelocity.x, this._body.angularVelocity.y, this._body.angularVelocity.z);
    }
    set angularVelocity(vec3) {
        this._angularVelocityUpdate = new THREE.Vector3().copy(vec3);
    }
    onRemove() {
        this._body.removalFlag = true;
    }
}
exports.RigidBodyComponent = RigidBodyComponent;
RigidBodyComponent.schema = {
    mass: { type: ecsy_1.Types.Number, default: 0 },
    shape: { type: ecsy_1.Types.Ref },
    type: { type: ecsy_1.Types.Number },
    initVelocity: { type: ecsy_1.Types.Ref },
    angularDamping: { type: ecsy_1.Types.Number, default: 0.01 },
    angularConstraints: { type: ecsy_1.Types.Ref },
    linearDamping: { type: ecsy_1.Types.Number, default: 0.01 },
    linearConstraints: { type: ecsy_1.Types.Ref },
    collisionGroup: { type: ecsy_1.Types.Number, default: 1 },
    fixedRotation: { type: ecsy_1.Types.Boolean, default: false },
    isTrigger: { type: ecsy_1.Types.Boolean, default: false },
    _body: { type: ecsy_1.Types.Ref },
    _velocityUpdate: { type: ecsy_1.Types.Ref },
    _angularVelocityUpdate: { type: ecsy_1.Types.Ref },
    _positionUpdate: { type: ecsy_1.Types.Ref },
    _quaternionUpdate: { type: ecsy_1.Types.Ref },
};
//# sourceMappingURL=PhysicsComponents.js.map