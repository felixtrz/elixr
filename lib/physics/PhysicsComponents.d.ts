import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import { GameComponent } from '../GameComponent';
export declare class PhysicsComponent extends GameComponent<any> {
    gravity: THREE.Vector3;
    solverIterations: number;
    stepTime: number;
    world: CANNON.World;
}
export declare class RigidBodyComponent extends GameComponent<any> {
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
    copyTransformToObject3D(object3D: THREE.Object3D): void;
    setTransformFromObject3D(object3D: THREE.Object3D): void;
    remove(): void;
    get position(): THREE.Vector3;
    set position(vec3: THREE.Vector3);
    get quaternion(): THREE.Quaternion;
    set quaternion(quat: THREE.Quaternion);
    get velocity(): THREE.Vector3;
    set velocity(vec3: THREE.Vector3);
    get angularVelocity(): THREE.Vector3;
    set angularVelocity(vec3: THREE.Vector3);
    onRemove(): void;
}
//# sourceMappingURL=PhysicsComponents.d.ts.map