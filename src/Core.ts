import { Attributes, World, WorldOptions } from 'ecsy';
import { ExtendedEntity, GameObject } from './GameObject';
import { GameComponentConstructor, SystemConfig } from './GameComponent';
import { GameSystem, GameSystemConstructor } from './GameSystem';
import {
	PhysicsComponent,
	RigidBodyComponent,
} from './physics/PhysicsComponents';

import { GLTFModelLoader } from './objects/GLTFObject';
import { GamepadWrapper } from 'gamepad-wrapper';
import { RigidBodyPhysicsSystem } from './physics/RigidBodyPhysicsSystem';
import { THREE } from './index';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';

export type ExtendedWorld = World & {
	core: Core;
};

export class Core {
	private _ecsyWorld: ExtendedWorld;
	private _tempVec3 = new THREE.Vector3();

	/**
	 * Main scene for the experience which allows you to set up what and where is
	 * to be rendered by three.js. This is where you place game objects, lights
	 * and cameras.
	 *
	 * @see https://threejs.org/docs/index.html?q=Scene#api/en/scenes/Scene
	 */
	scene: THREE.Scene;

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

	/**
	 * Empty game object used for registering unique components, like
	 * {@link SystemConfig} components.
	 */
	game: GameObject;

	constructor(sceneContainer: HTMLElement, ecsyOptions: WorldOptions = {}) {
		this._ecsyWorld = new World(ecsyOptions) as ExtendedWorld;
		this._ecsyWorld.core = this;

		this._createThreeScene();

		sceneContainer.appendChild(this.renderer.domElement);

		this.playerSpace = new THREE.Group();
		this.playerSpace.add(this.inlineCamera);
		this.playerHead = new THREE.Group();
		this.playerSpace.add(this.playerHead);
		this.scene.add(this.playerSpace);
		this.controllers = {};

		this.game = new GameObject();
		this.addGameObject(this.game);
		this.registerGameComponent(PhysicsComponent);
		this.registerGameComponent(RigidBodyComponent);
		this.game.addComponent(PhysicsComponent, {
			gravity: new THREE.Vector3(0, -9.8, 0),
		});

		GLTFModelLoader.init(this.renderer);

		this._setupControllers();

		this._setupRenderLoop();
	}

	private _createThreeScene() {
		this.scene = new THREE.Scene();
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
			this._ecsyWorld.execute(delta, elapsedTime);
			this.renderer.render(this.scene, this.inlineCamera);
		};

		this.renderer.setAnimationLoop(render);
	}

	/** Shortcut for getting the {@link PhysicsComponent} */
	get physics(): PhysicsComponent {
		return this.game.getMutableComponent(PhysicsComponent) as PhysicsComponent;
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
			this.game.addComponent(GameSystem.systemConfig);
			attributes.config = this.game.getMutableComponent(
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

	/**
	 * Create an empty {@link GameObject}
	 *
	 * @deprecated Use {@link Core#addGameObject} instead.
	 */
	createEmptyGameObject(): GameObject {
		const ecsyEntity = this._ecsyWorld.createEntity();
		const gameObject = new GameObject();
		gameObject._init(ecsyEntity as ExtendedEntity);
		return gameObject;
	}

	/**
	 * Create a {@link GameObject}
	 *
	 * @deprecated Use {@link Core#addGameObject} instead.
	 */
	createGameObject(object3D: THREE.Object3D) {
		const ecsyEntity = this._ecsyWorld.createEntity();
		const gameObject = new GameObject();
		this.scene.add(gameObject);
		gameObject._init(ecsyEntity as ExtendedEntity);
		if (object3D) {
			if (object3D.parent) {
				object3D.parent.add(gameObject);
				gameObject.position.copy(object3D.position);
				gameObject.quaternion.copy(object3D.quaternion);
			}
			gameObject.attach(object3D);
		}
		return gameObject;
	}

	/** Add a {@link GameObject} to the game world. */
	addGameObject(gameObject: GameObject) {
		if (!gameObject.isInitialized) {
			const ecsyEntity = this._ecsyWorld.createEntity();
			this.scene.add(gameObject);
			gameObject._init(ecsyEntity as ExtendedEntity);
		}
	}

	/** Resume execution of registered systems. */
	play() {
		this._ecsyWorld.play();
	}

	/** Pause execution of registered systems. */
	stop() {
		this._ecsyWorld.stop();
	}

	/** Enable {@link RigidBodyPhysicsSystem}. */
	enablePhysics() {
		this._ecsyWorld.registerSystem(RigidBodyPhysicsSystem, {
			priority: Infinity,
		});
	}
}
