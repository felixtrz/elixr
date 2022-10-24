import * as THREE from 'three';
import { GameObject } from './GameObject';
import { PhysicsComponent } from './physics/PhysicsComponents';
import { World, WorldOptions } from 'ecsy';
import { GameComponentConstructor } from './GameComponent';
import { GameSystemConstructor } from './GameSystem';
import { GamepadWrapper } from 'gamepad-wrapper';
export declare type ExtendedWorld = World & {
    core: Core;
};
export declare class Core {
    private _ecsyWorld;
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    controllers: {
        [handedness: string]: {
            targetRaySpace: THREE.Object3D;
            gripSpace: THREE.Object3D;
            gamepad: GamepadWrapper;
            model: THREE.Object3D;
        };
    };
    playerSpace: THREE.Group;
    vrButton: HTMLElement;
    arButton: HTMLElement;
    game: GameObject;
    constructor(sceneContainer: HTMLElement, ecsyOptions?: WorldOptions);
    private createThreeScene;
    private setupControllers;
    private setupRenderLoop;
    get physics(): PhysicsComponent;
    isImmersive(): boolean;
    registerGameSystem(GameSystem: GameSystemConstructor<any>): void;
    getGameSystem(GameSystem: GameSystemConstructor<any>): any;
    getGameSystems(): import("ecsy").System<import("ecsy")._Entity>[];
    registerGameComponent(GameComponent: GameComponentConstructor<any>): void;
    hasRegisteredGameComponent(GameComponent: GameComponentConstructor<any>): boolean;
    unregisterGameSystem(GameSystem: GameSystemConstructor<any>): void;
    createEmptyGameObject(): GameObject;
    createGameObject(object3D: THREE.Object3D): GameObject;
    play(): void;
    stop(): void;
    enablePhysics(): void;
}
//# sourceMappingURL=Core.d.ts.map