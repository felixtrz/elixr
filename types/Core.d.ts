export class Core {
    constructor(sceneContainer: any, ecsyOptions?: {});
    _ecsyWorld: World<import("ecsy")._Entity>;
    _vrButton: HTMLElement;
    _arButton: HTMLElement;
    _playerSpace: THREE.Group;
    _controllers: {};
    game: GameObject;
    _createThreeScene(): void;
    _scene: THREE.Scene;
    _camera: THREE.PerspectiveCamera;
    _renderer: THREE.WebGLRenderer;
    _setupControllers(): void;
    _setupRenderLoop(): void;
    get scene(): THREE.Scene;
    get renderer(): THREE.WebGLRenderer;
    get camera(): THREE.PerspectiveCamera;
    get playerSpace(): THREE.Group;
    /**
     * @type {Object<
     * 	string,
     * 	{
     * 		targetRaySpace: THREE.Object3D;
     * 		gripSpace: THREE.Object3D;
     * 		gamepad: GamepadWrapper;
     * 		model: THREE.Object3D;
     * 	}
     * >}
     */
    get controllers(): {
        [x: string]: {
            targetRaySpace: THREE.Object3D;
            gripSpace: THREE.Object3D;
            gamepad: GamepadWrapper;
            model: THREE.Object3D;
        };
    };
    get isImmersive(): boolean;
    /**
     * @type {{
     * 	gravity: THREE.Vector3;
     * 	solverIterations: Number;
     * 	stepTime: Number;
     * }}
     */
    get physics(): {
        gravity: THREE.Vector3;
        solverIterations: number;
        stepTime: number;
    };
    get arButton(): HTMLElement;
    get vrButton(): HTMLElement;
    /** @param {import('ecsy').SystemConstructor} GameSystem */
    registerGameSystem(GameSystem: import("ecsy").SystemConstructor<any>): void;
    /**
     * @param {import('ecsy').SystemConstructor} GameSystem
     * @returns {import('./GameSystem').GameSystem}
     */
    getGameSystem(GameSystem: import("ecsy").SystemConstructor<any>): import('./GameSystem').GameSystem;
    /** @returns {import('./GameSystem').GameSystem[]} */
    getGameSystems(): import('./GameSystem').GameSystem[];
    /** @param {import('ecsy').ComponentConstructor} GameComponent */
    registerGameComponent(GameComponent: import("ecsy").ComponentConstructor<any>): void;
    /**
     * @param {import('ecsy').ComponentConstructor} GameComponent
     * @returns {import('./GameComponent').GameComponent}
     */
    hasRegisteredGameComponent(GameComponent: import("ecsy").ComponentConstructor<any>): import("./GameComponent").GameComponent<any>;
    /** @param {import('ecsy').SystemConstructor} GameSystem */
    unregisterGameSystem(GameSystem: import("ecsy").SystemConstructor<any>): void;
    createEmptyGameObject(): GameObject;
    /**
     * @param {THREE.Vector3} object3D
     * @returns {GameObject}
     */
    createGameObject(object3D: THREE.Vector3): GameObject;
    play(): void;
    stop(): void;
    enablePhysics(): void;
}
import { World } from "ecsy/src/World";
import * as THREE from "three";
import { GameObject } from "./GameObject";
import { GamepadWrapper } from "gamepad-wrapper";
