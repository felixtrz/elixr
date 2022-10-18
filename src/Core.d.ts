import type * as THREE from 'three';

import type { GameObject } from './GameObject';
import type { GamepadWrapper } from 'gamepad-wrapper';
import type { GameSystem } from './GameSystem';
import type { GameComponent, GameComponentConstructor } from './GameComponent';
import type { SystemConstructor, WorldOptions } from 'ecsy';

export class Core {
	constructor(sceneContainer: HTMLElement, ecsyOptions: WorldOptions);

	get scene(): THREE.Scene;

	get renderer(): THREE.WebGLRenderer;

	get camera(): THREE.Camera;

	get playerSpace(): THREE.Group;

	get controllers(): {
		[handedness: string]: {
			targetRaySpace: THREE.Object3D;
			gripSpace: THREE.Object3D;
			gamepad: GamepadWrapper;
			model: THREE.Object3D;
		};
	};

	get isImmersive(): boolean;

	get arButton(): HTMLButtonElement;

	get vrButton(): HTMLButtonElement;

	registerGameSystem<T extends GameSystem>(
		GameSystem: SystemConstructor<T>,
	): void;

	getGameSystem<T extends GameSystem>(
		GameSystem: SystemConstructor<T>,
	): GameSystem;

	getGameSystems(): Array<GameSystem>;

	registerGameComponent<C extends GameComponent<any>>(
		GameComponent: GameComponentConstructor<C>,
	): void;

	hasRegisteredGameComponent<C extends GameComponent<any>>(
		GameComponent: GameComponentConstructor<C>,
	): boolean;

	unregisterGameSystem<T extends GameSystem>(
		GameSystem: SystemConstructor<T>,
	): void;

	createEmptyGameObject(): GameObject;

	createGameObject(object3D: THREE.Object3D): GameObject;

	play(): void;

	stop(): void;
}
