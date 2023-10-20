/**
 * @file This file contains the Core class which is the main entry point for the elixr engine.
 * It provides a scene, camera, renderer, physics world, and player object.
 * @summary The Core class is responsible for initializing the ECSY world, graphics, and physics systems.
 * @packageDocumentation
 */
import { Attributes, World as EcsyWorld, Entity } from 'ecsy';
import { GameComponentConstructor, SystemConfig } from './GameComponent';
import { GameSystem, GameSystemConstructor } from './GameSystem';
import { PhysicsConfig, PhysicsSystem } from '../physics/PhysicsSystem';
import { Scene, THREE } from '../graphics/CustomTHREE';

import { MeshRenderer } from '../graphics/meshes/MeshRendererComponent';
import { Player } from '../player/Player';
import { SESSION_MODE } from '../constants';

export const PRIVATE = Symbol('@elixr/core/core');

export type CoreInitOptions = {
	cameraFov?: number;
	cameraNear?: number;
	cameraFar?: number;
	alpha?: boolean;
	physics?: boolean;
};

export class Core {
	/** @ignore */
	[PRIVATE]: {
		vec3: THREE.Vector3;
		ecsyWorld: EcsyWorld;
		gameManager: Entity;
		rapierWorld: import('@dimforge/rapier3d/rapier').World;
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
		rapierWorld: null,
		scene: new Scene(),
		renderer: null,
		camera: null,
		player: null,
		RAPIER: null,
		globals: new Map(),
	};

	private static _instance: Core;

	get scene() {
		return this[PRIVATE].scene;
	}

	get physicsWorld() {
		return this[PRIVATE].rapierWorld;
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

	get RAPIER() {
		return this[PRIVATE].RAPIER;
	}

	/** Global data store */
	get globals() {
		return this[PRIVATE].globals;
	}

	get initialized() {
		return Core._instance != null;
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
		if (Core._instance) {
			throw new Error('Core already initialized');
		}
		const core = new Core();
		return core;
	}

	static getInstance() {
		if (!Core._instance) {
			throw new Error('Core not initialized');
		}
		return Core._instance;
	}

	private constructor() {
		Core._instance = this;
		this[PRIVATE].gameManager = this[PRIVATE].ecsyWorld.createEntity();
		this.registerGameComponent(MeshRenderer);
	}

	/** Shortcut for getting the {@link PhysicsConfig} */
	get physics(): PhysicsConfig {
		return this.getGameSystemConfig(PhysicsSystem) as PhysicsConfig;
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
