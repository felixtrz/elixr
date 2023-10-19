import { Attributes, World as EcsyWorld, Entity } from 'ecsy';
import { GameComponentConstructor, SystemConfig } from './GameComponent';
import { GameSystem, GameSystemConstructor } from './GameSystem';
import { PhysicsConfig, PhysicsSystem } from '../physics/PhysicsSystem';

import { Collider } from '../physics/ColliderComponent';
import { MeshRenderer } from '../graphics/meshes/MeshRendererComponent';
import { Player } from '../player/Player';
import { RigidBody } from '../physics/RigidBodyComponent';
import { SESSION_MODE } from '../constants';
import { THREE } from '../graphics/CustomTHREE';

export const PRIVATE = Symbol('@elixr/core/core');

export type CoreInitOptions = {
	cameraFov?: number;
	cameraNear?: number;
	cameraFar?: number;
	alpha?: boolean;
	onResize?: () => void;
	physics?: boolean;
};

export class Core {
	/** @ignore */
	[PRIVATE]: {
		vec3: THREE.Vector3;
		ecsyWorld: EcsyWorld;
		gameManager: Entity;
		rapierWorld: import('@dimforge/rapier3d/rapier').World;
		threeScene: THREE.Scene;
		onResize: () => void;
		renderer: THREE.WebGLRenderer;
		camera: THREE.PerspectiveCamera;
		player: Player;
	} = {
		vec3: new THREE.Vector3(),
		ecsyWorld: null,
		gameManager: null,
		rapierWorld: null,
		threeScene: null,
		onResize: () => {},
		renderer: null,
		camera: null,
		player: null,
	};

	private static _instance: Core;

	/**
	 * Main scene for the experience which allows you to set up what and where is
	 * to be rendered by three.js. This is where you place game objects, lights
	 * and cameras.
	 *
	 * @see https://threejs.org/docs/index.html?q=Scene#api/en/scenes/Scene
	 */
	get scene() {
		return this[PRIVATE].threeScene;
	}

	get physicsWorld() {
		return this[PRIVATE].rapierWorld;
	}

	/**
	 * WebGL renderer used to render the scene.
	 *
	 * @see https://threejs.org/docs/index.html?q=renderer#api/en/renderers/WebGLRenderer
	 */
	get renderer() {
		return this[PRIVATE].renderer;
	}

	/**
	 * Camera for inline mode, DO NOT USE for getting player head transform, use
	 * {@link Core.playerHead} instead.
	 */
	get camera() {
		return this[PRIVATE].camera;
	}

	/**
	 * @deprecated Use {@link Core.camera} instead.
	 */
	get inlineCamera() {
		return this.camera;
	}

	get player() {
		return this[PRIVATE].player;
	}

	/** Global data store */
	globals: Map<string, any> = new Map();

	RAPIER: typeof import('@dimforge/rapier3d');

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

	static async init(
		sceneContainer: HTMLElement,
		options: CoreInitOptions = {},
	) {
		const RAPIER = await import('@dimforge/rapier3d');
		if (Core._instance) {
			throw new Error('Core already initialized');
		}
		const core = new Core(RAPIER, options);
		sceneContainer.appendChild(core.renderer.domElement);
		return core;
	}

	private constructor(
		RAPIER: typeof import('@dimforge/rapier3d'),
		{
			physics = true,
			cameraFov = 50,
			cameraNear = 0.1,
			cameraFar = 100,
			alpha = true,
			onResize = () => {},
		}: CoreInitOptions,
	) {
		Core._instance = this;
		this._initECS();
		this._initGraphics(cameraFov, cameraNear, cameraFar, alpha, onResize);
		if (physics) {
			this._initPhysics(RAPIER);
		}
	}

	static getInstance() {
		if (!Core._instance) {
			throw new Error('Core not initialized');
		}
		return Core._instance;
	}

	private _initECS() {
		this[PRIVATE].ecsyWorld = new EcsyWorld();
		this[PRIVATE].gameManager = this[PRIVATE].ecsyWorld.createEntity();
	}

	private _initGraphics(
		fov: number,
		near: number,
		far: number,
		alpha: boolean,
		onResize: () => void,
	) {
		this[PRIVATE].camera = new THREE.PerspectiveCamera(
			fov,
			window.innerWidth / window.innerHeight,
			near,
			far,
		);
		this[PRIVATE].renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha,
			multiviewStereo: true,
		} as THREE.WebGLRendererParameters);
		this[PRIVATE].onResize = onResize;
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.outputColorSpace = THREE.SRGBColorSpace;
		this.renderer.xr.enabled = true;

		this[PRIVATE].camera.position.set(0, 1.7, 0);

		const onWindowResize = () => {
			this[PRIVATE].camera.aspect = window.innerWidth / window.innerHeight;
			this[PRIVATE].camera.updateProjectionMatrix();
			this.renderer.setSize(window.innerWidth, window.innerHeight);
			this[PRIVATE].onResize();
		};

		window.addEventListener('resize', onWindowResize, false);

		this[PRIVATE].threeScene = new THREE.Scene();
		this.registerGameComponent(MeshRenderer);
	}

	private _initPhysics(RAPIER: typeof import('@dimforge/rapier3d/rapier')) {
		this.RAPIER = RAPIER;
		this.registerGameComponent(RigidBody);
		this.registerGameComponent(Collider);

		this.registerGameSystem(PhysicsSystem, { priority: Infinity });
		const physicsConfig = this[PRIVATE].gameManager.getMutableComponent(
			PhysicsSystem.systemConfig,
		) as PhysicsConfig;
		physicsConfig.gravity = new THREE.Vector3(0, 0, 0);
		physicsConfig.world = new RAPIER.World(physicsConfig.gravity);
		this[PRIVATE].rapierWorld = physicsConfig.world;
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
