import { AssetDescriptor, AssetManager } from './graphics/AssetManager';
import { Clock, PerspectiveCamera, SRGBColorSpace, WebGLRenderer } from 'three';
import { Core, PRIVATE } from './ecs/Core';

import { Physics } from './physics/Physics';
import { Player } from './xr/Player';

export type EngineInitOptions = {
	cameraFov?: number;
	cameraNear?: number;
	cameraFar?: number;
	alpha?: boolean;
	enablePhysics?: boolean;
	waitForAssets?: boolean;
};

export const initEngine = async (
	sceneContainer: HTMLElement,
	options: EngineInitOptions = {},
	initialAssets: Record<string, AssetDescriptor> = {},
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

	// Load Initial Assets
	const assetManager = AssetManager.init(renderer, initialAssets);
	core[PRIVATE].assetManager = assetManager;

	// Instantiate Player
	const player = new Player();
	core[PRIVATE].player = player;
	player.add(core.camera);

	// Physics Setup
	const { enablePhysics = false } = options;
	let physics: Physics;
	if (enablePhysics) {
		physics = await Physics.init();
	}

	// Render Loop
	const { waitForAssets = true } = options;
	const clock = new Clock();
	const render = () => {
		const delta = clock.getDelta();
		const elapsedTime = clock.elapsedTime;
		player.update(core.renderer.xr);
		if (!waitForAssets || assetManager.initialAssetsLoaded) {
			core[PRIVATE].ecsyWorld.execute(delta, elapsedTime);
		}
		if (enablePhysics) {
			physics.update(delta);
		}
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
