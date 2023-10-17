import { Attributes, World as EcsyWorld, Entity } from 'ecsy';
import { GameComponentConstructor, SystemConfig } from './GameComponent';
import { GameSystem, GameSystemConstructor } from './GameSystem';
import { PhysicsConfig, PhysicsSystem } from '../physics/PhysicsSystem';

import { Collider } from '../physics/ColliderComponent';
import { GLTFModelLoader } from '../graphics/GLTFModelLoader';
import { GamepadWrapper } from 'gamepad-wrapper';
import { MeshRenderer } from '../graphics/meshes/MeshRendererComponent';
import { RigidBody } from '../physics/RigidBodyComponent';
import { SESSION_MODE } from './enums';
import { THREE } from '../graphics/CustomTHREE';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';

export type CoreInitOptions = {
	physics?: boolean;
};

export class Core {
	private _tempVec3 = new THREE.Vector3();

	private static _instance: Core;

	private _ecsyWorld: EcsyWorld;

	private _gameManager: Entity;

	private _rapierWorld: import('@dimforge/rapier3d/rapier').World;

	private _threeScene: THREE.Scene;

	private _controllersActive: number = 0;

	private _handsActive: number = 0;

	/**
	 * Main scene for the experience which allows you to set up what and where is
	 * to be rendered by three.js. This is where you place game objects, lights
	 * and cameras.
	 *
	 * @see https://threejs.org/docs/index.html?q=Scene#api/en/scenes/Scene
	 */
	get scene() {
		return this._threeScene;
	}

	get ecsWorld() {
		return this._ecsyWorld;
	}

	get physicsWorld() {
		return this._rapierWorld;
	}

	get controllersActive() {
		return this._controllersActive;
	}

	get handsActive() {
		return this._handsActive;
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
		const coreInstance = new Core(sceneContainer, RAPIER, options.physics);
		return coreInstance;
	}

	private constructor(
		sceneContainer: HTMLElement,
		RAPIER: typeof import('@dimforge/rapier3d'),
		usePhysics: boolean = true,
	) {
		Core._instance = this;
		this._initECS();
		this._initGraphics();
		if (usePhysics) {
			this._initPhysics(RAPIER);
		}

		this._setupPlayerSpace();
		this._setupControllers();

		GLTFModelLoader.init(this.renderer);

		sceneContainer.appendChild(this.renderer.domElement);
		this._setupRenderLoop();
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
		this.scene.add(this.playerSpace);
	}

	private _initECS() {
		this._ecsyWorld = new EcsyWorld();
		this._gameManager = this._ecsyWorld.createEntity();
	}

	private _initGraphics() {
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
		this.renderer.outputColorSpace = THREE.SRGBColorSpace;
		this.renderer.xr.enabled = true;

		this.inlineCamera.position.set(0, 1.7, 0);

		const onWindowResize = () => {
			this.inlineCamera.aspect = window.innerWidth / window.innerHeight;
			this.inlineCamera.updateProjectionMatrix();
			this.renderer.setSize(window.innerWidth, window.innerHeight);
		};

		window.addEventListener('resize', onWindowResize, false);

		this._threeScene = new THREE.Scene();
		this.registerGameComponent(MeshRenderer);
	}

	private _initPhysics(RAPIER: typeof import('@dimforge/rapier3d/rapier')) {
		this.RAPIER = RAPIER;
		this.registerGameComponent(RigidBody);
		this.registerGameComponent(Collider);

		this.registerGameSystem(PhysicsSystem, { priority: Infinity });
		const physicsConfig = this._gameManager.getMutableComponent(
			PhysicsSystem.systemConfig,
		) as PhysicsConfig;
		physicsConfig.gravity = new THREE.Vector3(0, 0, 0);
		physicsConfig.world = new RAPIER.World(physicsConfig.gravity);
		this._rapierWorld = physicsConfig.world;
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
			this._handsActive = 0;
			this._controllersActive = 0;
			if (this.isImmersive()) {
				const session = this.renderer.xr.getSession();
				session.inputSources.forEach((inputSource) => {
					if (inputSource.hand) {
						this._handsActive += 1;
					} else {
						this._controllersActive += 1;
					}
				});
			}
			Object.values(this.controllers).forEach((controller) => {
				controller.gamepad.update();
			});
			this._updatePlayerHead();
			this._ecsyWorld.execute(delta, elapsedTime);
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

	/** Register a {@link GameSystem}. */
	registerGameSystem(
		GameSystem: GameSystemConstructor<any>,
		attributes: Attributes = {},
	) {
		if (GameSystem.systemConfig) {
			this._ecsyWorld.registerComponent(GameSystem.systemConfig);
			this._gameManager.addComponent(GameSystem.systemConfig);
			attributes.config = this._gameManager.getMutableComponent(
				GameSystem.systemConfig,
			);
		}
		this._ecsyWorld.registerSystem(GameSystem, attributes);
	}

	/** Get a {@link GameSystem} registered in this world. */
	getGameSystem(GameSystem: GameSystemConstructor<any>) {
		return this._ecsyWorld.getSystem(GameSystem);
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
		return this._ecsyWorld.getSystems();
	}

	/** Register a {@link GameComponent} */
	registerGameComponent(GameComponent: GameComponentConstructor<any>) {
		this._ecsyWorld.registerComponent(GameComponent);
	}

	/**
	 * Boolean value indicating whether a {@link GameComponent} has been registered
	 * to Core or not.
	 */
	hasRegisteredGameComponent(GameComponent: GameComponentConstructor<any>) {
		return this._ecsyWorld.hasRegisteredComponent(GameComponent);
	}

	/** Unregister a {@link GameSystem}. */
	unregisterGameSystem(GameSystem: GameSystemConstructor<any>) {
		this._ecsyWorld.unregisterSystem(GameSystem);
	}

	/** Resume execution of registered systems. */
	play() {
		this._ecsyWorld.play();
	}

	/** Pause execution of registered systems. */
	stop() {
		this._ecsyWorld.stop();
	}
}
