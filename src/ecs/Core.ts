/**
 * @file This file contains the Core class which is the main entry point for the elixr engine.
 * It provides a scene, camera, renderer, physics world, and player object.
 * @summary The Core class is responsible for initializing the ECSY world, graphics, and physics systems.
 * @packageDocumentation
 */
import { Attributes, World as EcsyWorld, Entity } from 'ecsy';
import { GameComponentConstructor, SystemConfig } from './GameComponent';
import { GameSystem, GameSystemConstructor } from './GameSystem';
import { Scene, THREE } from '../graphics/Three';

import { AssetManager } from '../graphics/AssetManager';
import { Player } from '../xr/Player';
import { SESSION_MODE } from '../constants';

export const PRIVATE = Symbol('@elixr/ecs/core');

export class Core {
	/** @ignore */
	[PRIVATE]: {
		vec3: THREE.Vector3;
		ecsyWorld: EcsyWorld;
		gameManager: Entity;
		assetManager: AssetManager;
		scene: THREE.Scene;
		renderer: THREE.WebGLRenderer;
		camera: THREE.PerspectiveCamera;
		player: Player;
		RAPIER: typeof import('@dimforge/rapier3d');
		globals: Map<string, any>;
	} = {
		vec3: new THREE.Vector3(),
		ecsyWorld: new EcsyWorld(),
		gameManager: null,
		assetManager: null,
		scene: new Scene(),
		renderer: null,
		camera: null,
		player: null,
		RAPIER: null,
		globals: new Map(),
	};

	private static instance: Core;

	get scene() {
		return this[PRIVATE].scene;
	}

	get renderer() {
		return this[PRIVATE].renderer;
	}

	get camera() {
		return this[PRIVATE].camera;
	}

	get player() {
		return this[PRIVATE].player;
	}

	get assetManager() {
		return this[PRIVATE].assetManager;
	}

	get RAPIER() {
		return this[PRIVATE].RAPIER;
	}

	/** Global data store */
	get globals() {
		return this[PRIVATE].globals;
	}

	get initialized() {
		return Core.instance != null;
	}

	/** Enum value indicating the current XRSessionMode */
	get sessionMode() {
		if (!this.renderer.xr.isPresenting) {
			return SESSION_MODE.INLINE;
		} else {
			const session = this.renderer.xr.getSession();
			if (session.environmentBlendMode === 'opaque') {
				return SESSION_MODE.IMMERSIVE_VR;
			} else {
				return SESSION_MODE.IMMERSIVE_AR;
			}
		}
	}

	static init() {
		if (Core.instance) {
			throw new Error('Core already initialized');
		}
		const core = new Core();
		return core;
	}

	static getInstance() {
		if (!Core.instance) {
			throw new Error('Core not initialized');
		}
		return Core.instance;
	}

	private constructor() {
		Core.instance = this;
		this[PRIVATE].gameManager = this[PRIVATE].ecsyWorld.createEntity();
	}

	/** Boolean value for whether player is in immersive mode. */
	isImmersive() {
		return this.renderer.xr.isPresenting;
	}

	/** Register a {@link GameSystem}. */
	registerGameSystem(
		GameSystem: GameSystemConstructor<any>,
		attributes: Attributes = {},
	) {
		if (GameSystem.systemConfig) {
			this[PRIVATE].ecsyWorld.registerComponent(GameSystem.systemConfig);
			this[PRIVATE].gameManager.addComponent(GameSystem.systemConfig);
			attributes.config = this[PRIVATE].gameManager.getMutableComponent(
				GameSystem.systemConfig,
			);
		}
		this[PRIVATE].ecsyWorld.registerSystem(GameSystem, attributes);
	}

	/** Get a {@link GameSystem} registered in this world. */
	getGameSystem(GameSystem: GameSystemConstructor<any>) {
		return this[PRIVATE].ecsyWorld.getSystem(GameSystem);
	}

	/**
	 * Get the mutable {@link SystemConfig} component associated with the specified
	 * {@link GameSystem}.
	 */
	getGameSystemConfig(
		GameSystem: GameSystemConstructor<GameSystem>,
	): SystemConfig {
		return this.getGameSystem(GameSystem).config;
	}

	/** Get a list of {@link GameSystem} registered in this world. */
	getGameSystems() {
		return this[PRIVATE].ecsyWorld.getSystems();
	}

	/** Register a {@link GameComponent} */
	registerGameComponent(GameComponent: GameComponentConstructor<any>) {
		this[PRIVATE].ecsyWorld.registerComponent(GameComponent);
	}

	/**
	 * Boolean value indicating whether a {@link GameComponent} has been registered
	 * to Core or not.
	 */
	hasRegisteredGameComponent(GameComponent: GameComponentConstructor<any>) {
		return this[PRIVATE].ecsyWorld.hasRegisteredComponent(GameComponent);
	}

	/** Unregister a {@link GameSystem}. */
	unregisterGameSystem(GameSystem: GameSystemConstructor<any>) {
		this[PRIVATE].ecsyWorld.unregisterSystem(GameSystem);
	}

	/** Resume execution of registered systems. */
	play() {
		this[PRIVATE].ecsyWorld.play();
	}

	/** Pause execution of registered systems. */
	stop() {
		this[PRIVATE].ecsyWorld.stop();
	}
}
