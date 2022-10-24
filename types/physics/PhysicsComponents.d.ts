export class PhysicsComponent extends GameComponent<any> {
    constructor(props?: false | Partial<Omit<any, keyof GameComponent<any>>>);
}
export namespace PhysicsComponent {
    namespace schema {
        namespace gravity {
            const type: import("ecsy").RefPropType<any>;
        }
        namespace solverIterations {
            const type_1: import("ecsy").NumberPropType;
            export { type_1 as type };
            const _default: number;
            export { _default as default };
        }
        namespace stepTime {
            const type_2: import("ecsy").NumberPropType;
            export { type_2 as type };
            const _default_1: number;
            export { _default_1 as default };
        }
        namespace world {
            const type_3: import("ecsy").RefPropType<any>;
            export { type_3 as type };
        }
    }
}
export class RigidBodyComponent extends GameComponent<any> {
    constructor(props?: false | Partial<Omit<any, keyof GameComponent<any>>>);
    /**
     * Sync rigid body transform to rendered object
     * @param {THREE.Object3D} object3D
     */
    copyTransformToObject3D(object3D: THREE.Object3D): void;
    /**
     * Set rigid body transform from rendered object
     * @param {THREE.Object3D} object3D
     */
    setTransformFromObject3D(object3D: THREE.Object3D): void;
    _positionUpdate: THREE.Vector3;
    _quaternionUpdate: THREE.Quaternion;
    remove(): void;
    /**
     * @readonly
     */
    readonly get position(): THREE.Vector3;
    /**
     * @readonly
     */
    readonly get quaternion(): THREE.Quaternion;
    /**
     *
     * @param {THREE.Vector3} vec3
     */
    setVelocity(vec3: THREE.Vector3): void;
    _velocityUpdate: THREE.Vector3;
    /**
     *
     * @param {THREE.Vector3} vec3
     */
    setAngularVelocity(vec3: THREE.Vector3): void;
    _angularVelocityUpdate: THREE.Vector3;
    /**
     *
     * @param {THREE.Vector3} vec3
     */
    setPosition(vec3: THREE.Vector3): void;
    /**
     *
     * @param {THREE.Quaternion} quat
     */
    setQuaternion(quat: THREE.Quaternion): void;
    /**
     *
     * @param {Number} type
     */
    setBodyType(type: number): void;
    type: number;
}
export namespace RigidBodyComponent {
    export namespace schema_1 {
        export namespace mass {
            const type_4: import("ecsy").NumberPropType;
            export { type_4 as type };
            const _default_2: number;
            export { _default_2 as default };
        }
        export namespace shape {
            const type_5: import("ecsy").RefPropType<any>;
            export { type_5 as type };
        }
        export namespace type_6 {
            const type_7: import("ecsy").StringPropType;
            export { type_7 as type };
        }
        export { type_6 as type };
        export namespace initVelocity {
            const type_8: import("ecsy").RefPropType<any>;
            export { type_8 as type };
        }
        export namespace active {
            const type_9: import("ecsy").BooleanPropType;
            export { type_9 as type };
            const _default_3: boolean;
            export { _default_3 as default };
        }
        export namespace angularDamping {
            const type_10: import("ecsy").NumberPropType;
            export { type_10 as type };
            const _default_4: number;
            export { _default_4 as default };
        }
        export namespace angularConstraints {
            const type_11: import("ecsy").RefPropType<any>;
            export { type_11 as type };
        }
        export namespace linearDamping {
            const type_12: import("ecsy").NumberPropType;
            export { type_12 as type };
            const _default_5: number;
            export { _default_5 as default };
        }
        export namespace linearConstraints {
            const type_13: import("ecsy").RefPropType<any>;
            export { type_13 as type };
        }
        export namespace collisionGroup {
            const type_14: import("ecsy").NumberPropType;
            export { type_14 as type };
            const _default_6: number;
            export { _default_6 as default };
        }
        export namespace fixedRotation {
            const type_15: import("ecsy").BooleanPropType;
            export { type_15 as type };
            const _default_7: boolean;
            export { _default_7 as default };
        }
        export namespace isTrigger {
            const type_16: import("ecsy").BooleanPropType;
            export { type_16 as type };
            const _default_8: boolean;
            export { _default_8 as default };
        }
        export namespace _body {
            const type_17: import("ecsy").RefPropType<any>;
            export { type_17 as type };
        }
        export namespace _velocityUpdate {
            const type_18: import("ecsy").RefPropType<any>;
            export { type_18 as type };
        }
        export namespace _angularVelocityUpdate {
            const type_19: import("ecsy").RefPropType<any>;
            export { type_19 as type };
        }
        export namespace _positionUpdate {
            const type_20: import("ecsy").RefPropType<any>;
            export { type_20 as type };
        }
        export namespace _quaternionUpdate {
            const type_21: import("ecsy").RefPropType<any>;
            export { type_21 as type };
        }
    }
    export { schema_1 as schema };
}
import { GameComponent } from "../GameComponent";
import * as THREE from "three";
