import * as THREE from 'three';

import { GameObject } from './GameObject';
import { GamepadWrapper } from 'gamepad-wrapper';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { World } from 'ecsy';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory';

export class Core {
	constructor(sceneContainer, ecsyOptions = {}) {
		this._ecsyWorld = new World(ecsyOptions);
		this._ecsyWorld.core = this;

		this._createThreeScene();

		sceneContainer.appendChild(this._renderer.domElement);
		document.body.appendChild(VRButton.createButton(this._renderer));

		this._playerSpace = new THREE.Group();
		this._playerSpace.add(this._camera);
		this._scene.add(this._playerSpace);
		this._controllers = {};

		this._setupControllers();

		this._setupRenderLoop();
	}

	_createThreeScene() {
		this._scene = new THREE.Scene();
		this._camera = new THREE.PerspectiveCamera(
			50,
			window.innerWidth / window.innerHeight,
			0.1,
			100,
		);
		this._renderer = new THREE.WebGLRenderer({
			antialias: true,
			multiviewStereo: true,
		});
		this._renderer.setPixelRatio(window.devicePixelRatio);
		this._renderer.setSize(window.innerWidth, window.innerHeight);
		this._renderer.outputEncoding = THREE.sRGBEncoding;
		this._renderer.xr.enabled = true;

		this._camera.position.set(0, 1.7, 0);

		const onWindowResize = () => {
			this._camera.aspect = window.innerWidth / window.innerHeight;
			this._camera.updateProjectionMatrix();
			this._renderer.setSize(window.innerWidth, window.innerHeight);
		};

		window.addEventListener('resize', onWindowResize, false);
	}

	_setupControllers() {
		const controllerModelFactory = new XRControllerModelFactory();
		const webxrManager = this._renderer.xr;
		this._controllers = {};

		for (let i = 0; i < 2; i++) {
			const targetRaySpace = webxrManager.getController(i);
			const gripSpace = webxrManager.getControllerGrip(i);
			this._playerSpace.add(targetRaySpace);
			this._playerSpace.add(gripSpace);

			// based on controller connected event
			const controllerModel =
				controllerModelFactory.createControllerModel(gripSpace);
			gripSpace.add(controllerModel);

			gripSpace.addEventListener('connected', (event) => {
				const handedness = event.data.handedness;
				if (!event.data.gamepad) return;
				this._controllers[handedness] = {
					targetRaySpace,
					gripSpace,
					gamepad: new GamepadWrapper(event.data.gamepad),
				};
			});

			gripSpace.addEventListener('disconnected', (event) => {
				if (event.data?.handedness)
					delete this._controllers[event.data.handedness];
			});
		}
	}

	_setupRenderLoop() {
		const clock = new THREE.Clock();
		const render = () => {
			const delta = clock.getDelta();
			const elapsedTime = clock.elapsedTime;
			Object.values(this._controllers).forEach((controller) => {
				controller.gamepad.update();
			});
			this._ecsyWorld.execute(delta, elapsedTime);
			this._renderer.render(this._scene, this._camera);
		};

		this._renderer.setAnimationLoop(render);
	}

	get scene() {
		return this._scene;
	}

	get renderer() {
		return this._renderer;
	}

	get camera() {
		return this._camera;
	}

	get playerSpace() {
		return this._playerSpace;
	}

	get controllers() {
		return this._controllers;
	}

	get isImmersive() {
		return this._renderer.xr.isPresenting;
	}

	registerGameSystem(GameSystem) {
		this._ecsyWorld.registerSystem(GameSystem);
	}

	getGameSystem(GameSystem) {
		return this._ecsyWorld.getSystem(GameSystem);
	}

	getGameSystems() {
		return this._ecsyWorld.getSystems();
	}

	registerGameComponent(GameComponent) {
		this._ecsyWorld.registerComponent(GameComponent);
	}

	hasRegisteredGameComponent(GameComponent) {
		return this._ecsyWorld.hasRegisteredComponent(GameComponent);
	}

	unregisterGameSystem(GameSystem) {
		this._ecsyWorld.unregisterSystem(GameSystem);
	}

	createEmptyGameObject() {
		const ecsyEntity = this._ecsyWorld.createEntity();
		const gameObject = new GameObject();
		gameObject.init(ecsyEntity);
		return gameObject;
	}

	createGameObject(object3D) {
		const ecsyEntity = this._ecsyWorld.createEntity();
		const gameObject = new GameObject();
		this._scene.add(gameObject);
		gameObject.init(ecsyEntity);
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

	play() {
		this._ecsyWorld.play();
	}

	stop() {
		this._ecsyWorld.stop();
	}
}
