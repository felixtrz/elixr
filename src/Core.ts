import { Attributes, World, WorldOptions } from 'ecsy';
import { ExtendedEntity, GameObject } from './GameObject';
import { GameComponentConstructor, SystemConfig } from './GameComponent';
import { GameSystem, GameSystemConstructor } from './GameSystem';
import {
	PhysicsComponent,
	RigidBodyComponent,
} from './physics/PhysicsComponents';

import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import { GLTFModelLoader } from './objects/GLTFObject';
import { GamepadWrapper } from 'gamepad-wrapper';
import { RigidBodyPhysicsSystem } from './physics/RigidBodyPhysicsSystem';
import { THREE } from './index';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';

export type ExtendedWorld = World & {
	core: Core;
};

export class Core {
	private _ecsyWorld: ExtendedWorld;
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

	constructor(sceneContainer: HTMLElement, ecsyOptions: WorldOptions = {}) {
		this._ecsyWorld = new World(ecsyOptions) as ExtendedWorld;
		this._ecsyWorld.core = this;

		this.createThreeScene();

		sceneContainer.appendChild(this.renderer.domElement);

		this.vrButton = VRButton.createButton(this.renderer);
		this.arButton = ARButton.createButton(this.renderer);

		this.playerSpace = new THREE.Group();
		this.playerSpace.add(this.camera);
		this.scene.add(this.playerSpace);
		this.controllers = {};

		this.game = this.createEmptyGameObject();
		this.registerGameComponent(PhysicsComponent);
		this.registerGameComponent(RigidBodyComponent);
		this.game.addComponent(PhysicsComponent, {
			gravity: new THREE.Vector3(0, -9.8, 0),
		});

		GLTFModelLoader.init(this.renderer);

		this.setupControllers();

		this.setupRenderLoop();
	}

	private createThreeScene() {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(
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

		this.camera.position.set(0, 1.7, 0);

		const onWindowResize = () => {
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize(window.innerWidth, window.innerHeight);
		};

		window.addEventListener('resize', onWindowResize, false);
	}

	private setupControllers() {
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

	private setupRenderLoop() {
		const clock = new THREE.Clock();
		const render = () => {
			const delta = clock.getDelta();
			const elapsedTime = clock.elapsedTime;
			Object.values(this.controllers).forEach((controller) => {
				controller.gamepad.update();
			});
			this._ecsyWorld.execute(delta, elapsedTime);
			this.renderer.render(this.scene, this.camera);
		};

		this.renderer.setAnimationLoop(render);
	}

	get physics(): PhysicsComponent {
		return this.game.getMutableComponent(PhysicsComponent) as PhysicsComponent;
	}

	isImmersive() {
		return this.renderer.xr.isPresenting;
	}

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

	getGameSystem(GameSystem: GameSystemConstructor<any>) {
		return this._ecsyWorld.getSystem(GameSystem);
	}

	getGameSystemConfig(
		GameSystem: GameSystemConstructor<GameSystem>,
	): SystemConfig {
		return this.getGameSystem(GameSystem).config;
	}

	getGameSystems() {
		return this._ecsyWorld.getSystems();
	}

	registerGameComponent(GameComponent: GameComponentConstructor<any>) {
		this._ecsyWorld.registerComponent(GameComponent);
	}

	hasRegisteredGameComponent(GameComponent: GameComponentConstructor<any>) {
		return this._ecsyWorld.hasRegisteredComponent(GameComponent);
	}

	unregisterGameSystem(GameSystem: GameSystemConstructor<any>) {
		this._ecsyWorld.unregisterSystem(GameSystem);
	}

	createEmptyGameObject(): GameObject {
		const ecsyEntity = this._ecsyWorld.createEntity();
		const gameObject = new GameObject();
		gameObject._init(ecsyEntity as ExtendedEntity);
		return gameObject;
	}

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

	addGameObject(gameObject: GameObject) {
		if (!gameObject.isInitialized) {
			const ecsyEntity = this._ecsyWorld.createEntity();
			this.scene.add(gameObject);
			gameObject._init(ecsyEntity as ExtendedEntity);
		}
	}

	play() {
		this._ecsyWorld.play();
	}

	stop() {
		this._ecsyWorld.stop();
	}

	enablePhysics() {
		this._ecsyWorld.registerSystem(RigidBodyPhysicsSystem, {
			priority: Infinity,
		});
	}
}
