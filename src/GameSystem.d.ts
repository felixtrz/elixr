import type { Attributes, System, World } from 'ecsy';
import type { Core } from './Core';
import type { GameObject } from './GameObject';

export class GameSystem extends System {
	constructor(world: World, attributes: Attributes);
	core: Core;
	execute(delta: number, time: number): void;
	update(delta: number, time: number): void;
	queryGameObjects(queryId: string): GameObject[];
}

export class XRGameSystem extends GameSystem {}
export class SingleUseGameSystem extends GameSystem {}
export class SingleUseXRGameSystem extends GameSystem {}
