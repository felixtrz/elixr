import {
	Clock,
	PerspectiveCamera,
	SRGBColorSpace,
	Vector3,
	WebGLRenderer,
} from 'three';
import { Core, CoreInitOptions, PRIVATE } from './Core';
import { PhysicsConfig, PhysicsSystem } from '../physics/PhysicsSystem';

import { Collider } from '../physics/ColliderComponent';
import { Player } from '../player/Player';
import { RigidBody } from '../physics/RigidBodyComponent';

export const initEngine = async (
	sceneContainer: HTMLElement,
	options: CoreInitOptions = {},
) => {
	const core = Core.init();

	// Camera Setup
	const { cameraFov = 50, cameraNear = 0.1, cameraFar = 100 } = options;
	const camera = new PerspectiveCamera(
		cameraFov,
		window.innerWidth / window.innerHeight,
		cameraNear,
		cameraFar,
	);
	camera.position.set(0, 1.7, 0);
	core[PRIVATE].camera = camera;

	// Renderer Setup
	const { alpha = true } = options;
	const renderer = new WebGLRenderer({
		antialias: true,
		alpha,
		multiviewStereo: true,
	} as THREE.WebGLRendererParameters);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.outputColorSpace = SRGBColorSpace;
	renderer.xr.enabled = true;
	core[PRIVATE].renderer = renderer;
	sceneContainer.appendChild(core.renderer.domElement);

	// Instantiate Player
	const player = new Player();
	core[PRIVATE].player = player;
	player.add(core.camera);

	// Physics Setup
	const RAPIER = await import('@dimforge/rapier3d');
	core.registerGameComponent(RigidBody);
	core.registerGameComponent(Collider);
	core.registerGameSystem(PhysicsSystem, { priority: Infinity });
	const physicsConfig = core[PRIVATE].gameManager.getMutableComponent(
		PhysicsSystem.systemConfig,
	) as PhysicsConfig;
	physicsConfig.gravity = new Vector3(0, 0, 0);
	physicsConfig.world = new RAPIER.World(physicsConfig.gravity);
	core[PRIVATE].rapierWorld = physicsConfig.world;
	core[PRIVATE].RAPIER = RAPIER;

	// Render Loop
	const clock = new Clock();
	const render = () => {
		const delta = clock.getDelta();
		const elapsedTime = clock.elapsedTime;
		player.update(core.renderer.xr);
		core[PRIVATE].ecsyWorld.execute(delta, elapsedTime);
		core.renderer.render(core.scene, core.camera);
	};

	core.renderer.setAnimationLoop(render);

	// Resize Handler
	const onWindowResize = () => {
		core[PRIVATE].camera.aspect = window.innerWidth / window.innerHeight;
		core[PRIVATE].camera.updateProjectionMatrix();
		core.renderer.setSize(window.innerWidth, window.innerHeight);
	};

	window.addEventListener('resize', onWindowResize, false);

	return core;
};
