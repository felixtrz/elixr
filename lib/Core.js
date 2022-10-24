"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Core = void 0;
const THREE = __importStar(require("three"));
const GameObject_1 = require("./GameObject");
const PhysicsComponents_1 = require("./physics/PhysicsComponents");
const ecsy_1 = require("ecsy");
const ARButton_1 = require("three/examples/jsm/webxr/ARButton");
const gamepad_wrapper_1 = require("gamepad-wrapper");
const RigidBodyPhysicsSystem_1 = require("./physics/RigidBodyPhysicsSystem");
const VRButton_1 = require("three/examples/jsm/webxr/VRButton");
const XRControllerModelFactory_1 = require("three/examples/jsm/webxr/XRControllerModelFactory");
class Core {
    _ecsyWorld;
    scene;
    renderer;
    camera;
    controllers;
    playerSpace;
    vrButton;
    arButton;
    game;
    constructor(sceneContainer, ecsyOptions = {}) {
        this._ecsyWorld = new ecsy_1.World(ecsyOptions);
        this._ecsyWorld.core = this;
        this.createThreeScene();
        sceneContainer.appendChild(this.renderer.domElement);
        this.vrButton = VRButton_1.VRButton.createButton(this.renderer);
        this.arButton = ARButton_1.ARButton.createButton(this.renderer);
        this.playerSpace = new THREE.Group();
        this.playerSpace.add(this.camera);
        this.scene.add(this.playerSpace);
        this.controllers = {};
        this.game = this.createEmptyGameObject();
        this.registerGameComponent(PhysicsComponents_1.PhysicsComponent);
        this.game.addComponent(PhysicsComponents_1.PhysicsComponent, {
            gravity: new THREE.Vector3(0, -9.8, 0),
        });
        this.setupControllers();
        this.setupRenderLoop();
    }
    createThreeScene() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            multiviewStereo: true,
        });
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
    setupControllers() {
        const controllerModelFactory = new XRControllerModelFactory_1.XRControllerModelFactory();
        const webxrManager = this.renderer.xr;
        this.controllers = {};
        for (let i = 0; i < 2; i++) {
            const targetRaySpace = webxrManager.getController(i);
            const gripSpace = webxrManager.getControllerGrip(i);
            this.playerSpace.add(targetRaySpace);
            this.playerSpace.add(gripSpace);
            // based on controller connected event
            const controllerModel = controllerModelFactory.createControllerModel(gripSpace);
            gripSpace.add(controllerModel);
            gripSpace.addEventListener('connected', (event) => {
                const handedness = event.data.handedness;
                if (!event.data.gamepad)
                    return;
                this.controllers[handedness] = {
                    targetRaySpace,
                    gripSpace,
                    gamepad: new gamepad_wrapper_1.GamepadWrapper(event.data.gamepad),
                    model: controllerModel,
                };
            });
            gripSpace.addEventListener('disconnected', (event) => {
                if (event.data?.handedness)
                    delete this.controllers[event.data.handedness];
            });
        }
    }
    setupRenderLoop() {
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
    get physics() {
        return this.game.getMutableComponent(PhysicsComponents_1.PhysicsComponent);
    }
    isImmersive() {
        return this.renderer.xr.isPresenting;
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
        const gameObject = new GameObject_1.GameObject();
        gameObject._init(ecsyEntity);
        return gameObject;
    }
    createGameObject(object3D) {
        const ecsyEntity = this._ecsyWorld.createEntity();
        const gameObject = new GameObject_1.GameObject();
        this.scene.add(gameObject);
        gameObject._init(ecsyEntity);
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
    enablePhysics() {
        this._ecsyWorld.registerComponent(PhysicsComponents_1.RigidBodyComponent);
        this._ecsyWorld.registerSystem(RigidBodyPhysicsSystem_1.RigidBodyPhysicsSystem, {
            priority: Infinity,
        });
    }
}
exports.Core = Core;
//# sourceMappingURL=Core.js.map