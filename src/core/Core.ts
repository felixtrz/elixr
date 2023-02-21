import { Attributes, World as EcsyWorld, WorldOptions } from 'ecsy';
import { GameComponentConstructor, SystemConfig } from './GameComponent';
import { GameSystem, GameSystemConstructor } from './GameSystem';
import { PhysicsConfig, PhysicsSystem } from '../physics/PhysicsSystem';

import { GLTFModelLoader } from '../graphics/GLTFModelLoader';
import { GamepadWrapper } from 'gamepad-wrapper';
import { SESSION_MODE } from './enums';
import { THREE } from '../graphics/CustomTHREE';
import { World } from './World';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';

export type ExtendedWorld = EcsyWorld & {
	core: Core;
};

export class Core {
	private _worlds: { [worldKey: string]: World } = {};
	private _tempVec3 = new THREE.Vector3();
	private static _instance: Core;

	activeWorld: World;

	/**
	 * Main scene for the experience which allows you to set up what and where is
	 * to be rendered by three.js. This is where you place game objects, lights
	 * and cameras.
	 *
	 * @see https://threejs.org/docs/index.html?q=Scene#api/en/scenes/Scene
	 */
	get scene() {
		return this.activeWorld.threeScene;
	}

	/**
	 * WebGL renderer used to render the scene.
	 *
	 * @see https://threejs.org/docs/index.html?q=renderer#api/en/renderers/WebGLRenderer
	 */
	renderer: THREE.WebGLRenderer;

	/**
	 * Camera for inline mode, DO NOT USE for getting player head transform, use
	 * {@link Core.playerHead} instead.
	 */
	inlineCamera: THREE.PerspectiveCamera;

	/**
	 * Accurate source for player head transform, can be used to attach game
	 * objects / audio listeners.
	 */
	playerHead: THREE.Group;

	/**
	 * Core registers up to 2 xr controllers, the handedness keys for the
	 * controllers vary across devices, with the most typical handednesses being
	 * "left" and "right".
	 */
	controllers: {
		[handedness: string]: {
			targetRaySpace: THREE.Object3D;
			gripSpace: THREE.Object3D;
			gamepad: GamepadWrapper;
			model: THREE.Object3D;
		};
	};

	/** Local space for the player, parent of camera and controllers. */
	playerSpace: THREE.Group;

	RAPIER: typeof import('@dimforge/rapier3d/rapier');

	get initialized() {
		return Core._instance != null;
	}

	/**
	 * Empty game object used for registering unique components, like
	 * {@link SystemConfig} components.
	 */
	get game() {
		return this.activeWorld.game;
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
		ecsyOptions: WorldOptions = {},
	) {
		const RAPIER = await import('@dimforge/rapier3d');
		if (Core._instance) {
			throw new Error('Core already initialized');
		}
		const coreInstance = new Core(sceneContainer, ecsyOptions, RAPIER);
		return coreInstance;
	}

	private constructor(
		sceneContainer: HTMLElement,
		ecsyOptions: WorldOptions = {},
		RAPIER: typeof import('@dimforge/rapier3d/rapier'),
	) {
		this.RAPIER = RAPIER;
		this._setupThreeGlobals();
		this._setupPlayerSpace();
		this._setupControllers();

		this.createWorld('default', ecsyOptions);
		this.switchToWorld('default');

		GLTFModelLoader.init(this.renderer);

		sceneContainer.appendChild(this.renderer.domElement);
		this._setupRenderLoop();

		Core._instance = this;
	}

	static getInstance() {
		if (!Core._instance) {
			throw new Error('Core not initialized');
		}
		return Core._instance;
	}

	private _setupPlayerSpace() {
		this.playerSpace = new THREE.Group();
		this.playerSpace.add(this.inlineCamera);
		this.playerHead = new THREE.Group();
		this.playerSpace.add(this.playerHead);
	}

	private _setupThreeGlobals() {
		this.inlineCamera = new THREE.PerspectiveCamera(
			50,
			window.innerWidth / window.innerHeight,
			0.1,
			100,
		);
		this.renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true,
			multiviewStereo: true,
		} as THREE.WebGLRendererParameters);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.outputEncoding = THREE.sRGBEncoding;
		this.renderer.xr.enabled = true;

		this.inlineCamera.position.set(0, 1.7, 0);

		const onWindowResize = () => {
			this.inlineCamera.aspect = window.innerWidth / window.innerHeight;
			this.inlineCamera.updateProjectionMatrix();
			this.renderer.setSize(window.innerWidth, window.innerHeight);
		};

		window.addEventListener('resize', onWindowResize, false);
	}

	private _setupControllers() {
		const controllerModelFactory = new XRControllerModelFactory();
		const webxrManager = this.renderer.xr;
		this.controllers = {};

		for (let i = 0; i < 2; i++) {
			const targetRaySpace = webxrManager.getController(i);
			const gripSpace = webxrManager.getControllerGrip(i);
			this.playerSpace.add(targetRaySpace);
			this.playerSpace.add(gripSpace);

			// based on controller connected event
			const controllerModel =
				controllerModelFactory.createControllerModel(gripSpace);
			gripSpace.add(controllerModel);

			gripSpace.addEventListener('connected', (event) => {
				const handedness = event.data.handedness;
				if (!event.data.gamepad) return;
				this.controllers[handedness] = {
					targetRaySpace,
					gripSpace,
					gamepad: new GamepadWrapper(event.data.gamepad),
					model: controllerModel,
				};
			});

			gripSpace.addEventListener('disconnected', (event) => {
				if (event.data?.handedness)
					delete this.controllers[event.data.handedness];
			});
		}
	}

	private _updatePlayerHead() {
		const xrManager = this.renderer.xr;
		const frame = xrManager.getFrame();
		const pose = frame?.getViewerPose(xrManager.getReferenceSpace());
		if (pose) {
			const headsetMatrix = new THREE.Matrix4().fromArray(
				pose.views[0].transform.matrix,
			);
			headsetMatrix.decompose(
				this.playerHead.position,
				this.playerHead.quaternion,
				this._tempVec3,
			);
		}
	}

	private _setupRenderLoop() {
		const clock = new THREE.Clock();
		const render = () => {
			const delta = clock.getDelta();
			const elapsedTime = clock.elapsedTime;
			Object.values(this.controllers).forEach((controller) => {
				controller.gamepad.update();
			});
			this._updatePlayerHead();
			this.activeWorld.execute(delta, elapsedTime);
			this.renderer.render(this.scene, this.inlineCamera);
		};

		this.renderer.setAnimationLoop(render);
	}

	/** Shortcut for getting the {@link PhysicsConfig} */
	get physics(): PhysicsConfig {
		return this.getGameSystemConfig(PhysicsSystem) as PhysicsConfig;
	}

	/** Boolean value for whether player is in immersive mode. */
	isImmersive() {
		return this.renderer.xr.isPresenting;
	}

	/**
	 * Create a new world with a separate scene, its own collection of GameObjects
	 * and physics world
	 */
	createWorld(worldKey: string, ecsyOptions: WorldOptions = {}) {
		const world = new World(ecsyOptions, this.RAPIER);
		this._worlds[worldKey] = world;
		world.core = this;
		return world;
	}

	/**
	 * Switch to the specified world, playerSpace will be transported to the new
	 * world, developer is responsible for removing all GameObjects tied to the
	 * previous world that are parented under playerSpace
	 */
	switchToWorld(worldKey: string) {
		const world = this._worlds[worldKey];
		if (!world) {
			throw new Error(`World ${worldKey} does not exist`);
		}
		this.activeWorld = world;
		this.scene.add(this.playerSpace);
	}

	/** Register a {@link GameSystem}. */
	registerGameSystem(
		GameSystem: GameSystemConstructor<any>,
		attributes: Attributes = {},
	) {
		if (GameSystem.systemConfig) {
			this.activeWorld.registerComponent(GameSystem.systemConfig);
			this.game.addComponent(GameSystem.systemConfig);
			attributes.config = this.game.getMutableComponent(
				GameSystem.systemConfig,
			);
		}
		this.activeWorld.registerSystem(GameSystem, attributes);
	}

	/** Get a {@link GameSystem} registered in this world. */
	getGameSystem(GameSystem: GameSystemConstructor<any>) {
		return this.activeWorld.getSystem(GameSystem);
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
		return this.activeWorld.getSystems();
	}

	/** Register a {@link GameComponent} */
	registerGameComponent(GameComponent: GameComponentConstructor<any>) {
		this.activeWorld.registerComponent(GameComponent);
	}

	/**
	 * Boolean value indicating whether a {@link GameComponent} has been registered
	 * to Core or not.
	 */
	hasRegisteredGameComponent(GameComponent: GameComponentConstructor<any>) {
		return this.activeWorld.hasRegisteredComponent(GameComponent);
	}

	/** Unregister a {@link GameSystem}. */
	unregisterGameSystem(GameSystem: GameSystemConstructor<any>) {
		this.activeWorld.unregisterSystem(GameSystem);
	}

	/** Resume execution of registered systems. */
	play() {
		this.activeWorld.play();
	}

	/** Pause execution of registered systems. */
	stop() {
		this.activeWorld.stop();
	}
}
