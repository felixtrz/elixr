import * as THREE from 'three';
import { GameComponent, GameComponentConstructor } from './GameComponent';
import { Entity } from 'ecsy';
export declare type ExtendedEntity = Entity & {
    gameObject: GameObject;
};
export declare class GameObject extends THREE.Group {
    private ecsyEntity;
    _init(ecsyEntity: ExtendedEntity): void;
    duplicate(): GameObject;
    addComponent(GameComponent: GameComponentConstructor<GameComponent<any>>, values?: Partial<Omit<GameComponent<any>, keyof GameComponent<any>>>): GameComponent<any>;
    getComponent(GameComponent: GameComponentConstructor<GameComponent<any>>, includeRemoved?: boolean): Readonly<GameComponent<any>>;
    getMutableComponent(GameComponent: GameComponentConstructor<GameComponent<any>>): GameComponent<any>;
    getComponentTypes(): import("ecsy").Component<any>[];
    getComponents(): {
        [componentName: string]: import("ecsy").Component<any>;
    };
    getComponentsToRemove(): {
        [componentName: string]: import("ecsy").Component<any>;
    };
    getRemovedComponent(GameComponent: GameComponentConstructor<GameComponent<any>>): Readonly<GameComponent<any>>;
    hasAllComponents(GameComponents: GameComponentConstructor<any>[]): boolean;
    hasAnyComponents(GameComponents: GameComponentConstructor<any>[]): boolean;
    hasComponent(GameComponent: GameComponentConstructor<any>): boolean;
    removeAllComponents(forceImmediate: boolean): void;
    removeComponent(GameComponent: GameComponentConstructor<any>, forceImmediate: boolean): void;
}
//# sourceMappingURL=GameObject.d.ts.map