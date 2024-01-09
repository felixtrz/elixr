import { Camera, Object3D, Scene, WebGLRenderer } from 'three';
import { World as ElicsWorld, PRIVATE as WORLD_PRIVATE } from 'elics/lib/World';
import { PRIVATE as GAME_SYSTEM_PRIVATE, GameSystem } from './GameSystem';

import { AssetManager } from '../graphics/AssetManager';
import { AudioManager } from '../audio/AudioManager';
import { GameObject } from './GameObject';
import { Physics } from '../physics/Physics';
import { Player } from '../xr/Player';
import { PRIVATE as SYSTEM_PRIVATE } from 'elics/lib/System';

export const PRIVATE = Symbol('@elixr/ecs/world');

export class World extends ElicsWorld {
	[PRIVATE]: {
		globals: Map<string, any>;
		player: Player;
		scene: Scene;
		camera: Camera;
		renderer: WebGLRenderer;
		assetManager: AssetManager;
		audioManager: AudioManager;
		physics?: Physics;
	} = {
		globals: new Map(),
		player: null as any,
		scene: null as any,
		camera: null as any,
		renderer: null as any,
		assetManager: null as any,
		audioManager: null as any,
	};

	constructor() {
		super();
		this[WORLD_PRIVATE].entityPrototype = GameObject;
	}

	get player() {
		return this[PRIVATE].player;
	}

	get scene() {
		return this[PRIVATE].scene;
	}

	get camera() {
		return this[PRIVATE].camera;
	}

	get renderer() {
		return this[PRIVATE].renderer;
	}

	get globals() {
		return this[PRIVATE].globals;
	}

	get assetManager() {
		return this[PRIVATE].assetManager;
	}

	get audioManager() {
		return this[PRIVATE].audioManager;
	}

	get physics() {
		return this[PRIVATE].physics;
	}

	createGameObject(parent?: Object3D) {
		const gameObject = super.createEntity() as GameObject;
		if (parent) {
			parent.add(gameObject);
		} else {
			this.scene.add(gameObject);
		}
		return gameObject;
	}

	update(delta: number, time: number): void {
		this[WORLD_PRIVATE].systems.forEach((system) => {
			const gameSystem = system as GameSystem;
			if (!gameSystem[SYSTEM_PRIVATE].isPaused) {
				gameSystem[GAME_SYSTEM_PRIVATE].update(delta, time);
			}
		});
	}
}
