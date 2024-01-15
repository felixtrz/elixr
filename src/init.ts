import { ASSET_TYPE, AssetDescriptor } from './constants';
import {
	Clock,
	PerspectiveCamera,
	SRGBColorSpace,
	Scene,
	Vector3,
	WebGLRenderer,
} from 'three';
import { PRIVATE as WORLD_PRIVATE, World } from './ecs/World';

import { AssetManager } from './graphics/AssetManager';
import { AudioManager } from './audio/AudioManager';
import { Physics } from './physics/Physics';
import { Player } from './xr/Player';

export type EngineInitOptions = {
	cameraFov?: number;
	cameraNear?: number;
	cameraFar?: number;
	alpha?: boolean;
	enablePhysics?: boolean;
	gravity?: Vector3;
	waitForAssets?: boolean;
};

export const initEngine = async (
	sceneContainer: HTMLElement,
	options: EngineInitOptions = {},
	initialAssets: Record<string, AssetDescriptor> = {},
) => {
	// ECS Setup
	const world = new World();

	const audioAssets = Object.fromEntries(
		Object.entries(initialAssets).filter(
			([_, assetDescriptor]) => assetDescriptor.type === ASSET_TYPE.AUDIO,
		),
	);
	const visualAssets = Object.fromEntries(
		Object.entries(initialAssets).filter(
			([_, assetDescriptor]) => assetDescriptor.type !== ASSET_TYPE.AUDIO,
		),
	);

	// Camera Setup
	const { cameraFov = 50, cameraNear = 0.1, cameraFar = 100 } = options;
	const camera = new PerspectiveCamera(
		cameraFov,
		window.innerWidth / window.innerHeight,
		cameraNear,
		cameraFar,
	);
	camera.position.set(0, 1.7, 0);

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
	sceneContainer.appendChild(renderer.domElement);
	const scene = new Scene();
	world[WORLD_PRIVATE].scene = scene;
	world[WORLD_PRIVATE].camera = camera;
	world[WORLD_PRIVATE].renderer = renderer;

	// Load Initial Assets
	const assetManager = new AssetManager(renderer, visualAssets);
	world[WORLD_PRIVATE].assetManager = assetManager;

	// Instantiate Player
	const player = new Player(world);
	scene.add(player);
	player.add(camera);
	world[WORLD_PRIVATE].player = player;

	// Audio Setup
	const audioManager = new AudioManager(player, audioAssets);
	world[WORLD_PRIVATE].audioManager = audioManager;

	// Physics Setup
	const { enablePhysics = false, gravity = new Vector3(0, -9.81, 0) } = options;
	let physics: Physics;
	if (enablePhysics) {
		if (!Physics.module) {
			Physics.module = await import('@dimforge/rapier3d');
		}
		physics = new Physics(gravity);
		world[WORLD_PRIVATE].physics = physics;
	}

	// Render Loop
	const { waitForAssets = true } = options;
	const clock = new Clock();
	const render = () => {
		const delta = clock.getDelta();
		const elapsedTime = clock.elapsedTime;
		player.update(renderer.xr);
		if (!waitForAssets || assetManager.initialAssetsLoaded) {
			world.update(delta, elapsedTime);
		}
		if (enablePhysics) {
			physics.update(delta);
		}
		audioManager.update();
		renderer.render(scene, camera);
	};

	renderer.setAnimationLoop(render);

	// Resize Handler
	const onWindowResize = () => {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	};

	window.addEventListener('resize', onWindowResize, false);

	return world;
};
