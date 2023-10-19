import { Core, CoreInitOptions, PRIVATE } from './Core';

import { Clock } from 'three';
import { Player } from '../player/Player';

export const initEngine = async (
	sceneContainer: HTMLElement,
	options: CoreInitOptions = {},
) => {
	const core = await Core.init(sceneContainer, options);
	const player = new Player();
	core[PRIVATE].player = player;
	player.add(core.camera);

	const clock = new Clock();
	const render = () => {
		const delta = clock.getDelta();
		const elapsedTime = clock.elapsedTime;
		player.update(core.renderer.xr);
		core[PRIVATE].ecsyWorld.execute(delta, elapsedTime);
		core.renderer.render(core.scene, core.camera);
	};

	core.renderer.setAnimationLoop(render);
	return core;
};
