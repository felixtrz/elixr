export class GameObject extends THREE.Group {
    /** @param {import('ecsy').Entity} ecsyEntity */
    _init(ecsyEntity: import('ecsy').Entity): void;
    _ecsyEntity: import("ecsy")._Entity;
    destroy(): void;
    /** @returns {GameObject} */
    duplicate(): GameObject;
    /**
     * @param {import('ecsy').ComponentConstructor} GameComponent
     * @param {Object<string, any>} values
     * @returns {import('./GameComponent').GameComponent}
     */
    addComponent(GameComponent: import("ecsy").ComponentConstructor<any>, values: {
        [x: string]: any;
    }): import("./GameComponent").GameComponent<any>;
    /**
     * @param {import('ecsy').ComponentConstructor} GameComponent
     * @returns {import('./GameComponent').GameComponent}
     */
    getComponent(GameComponent: import("ecsy").ComponentConstructor<any>): import("./GameComponent").GameComponent<any>;
    /**
     * @param {import('ecsy').ComponentConstructor} GameComponent
     * @returns {import('./GameComponent').GameComponent}
     */
    getMutableComponent(GameComponent: import("ecsy").ComponentConstructor<any>): import("./GameComponent").GameComponent<any>;
    /** @returns {import('ecsy').ComponentConstructor[]} */
    getComponentTypes(): import("ecsy").ComponentConstructor<any>[];
    /** @returns {import('./GameComponent').GameComponent[]} */
    getComponents(): import("./GameComponent").GameComponent<any>[];
    /** @returns {import('./GameComponent').GameComponent[]} */
    getComponentsToRemove(): import("./GameComponent").GameComponent<any>[];
    /**
     * @param {import('ecsy').ComponentConstructor} GameComponent
     * @returns {import('./GameComponent').GameComponent}
     */
    getRemovedComponent(GameComponent: import("ecsy").ComponentConstructor<any>): import("./GameComponent").GameComponent<any>;
    /**
     * @param {import('ecsy').ComponentConstructor[]} GameComponents
     * @returns {boolean}
     */
    hasAllComponents(GameComponents: import("ecsy").ComponentConstructor<any>[]): boolean;
    /**
     * @param {import('ecsy').ComponentConstructor[]} GameComponents
     * @returns {boolean}
     */
    hasAnyComponents(GameComponents: import("ecsy").ComponentConstructor<any>[]): boolean;
    /**
     * @param {import('ecsy').ComponentConstructor} GameComponent
     * @returns {boolean}
     */
    hasComponent(GameComponent: import("ecsy").ComponentConstructor<any>): boolean;
    /** @param {boolean} forceImmediate */
    removeAllComponents(forceImmediate: boolean): void;
    /**
     * @param {import('ecsy').ComponentConstructor} GameComponent
     * @param {boolean} forceImmediate
     */
    removeComponent(GameComponent: import("ecsy").ComponentConstructor<any>, forceImmediate: boolean): void;
}
import * as THREE from "three";
