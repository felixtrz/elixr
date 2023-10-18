import { GameObject } from '../core/GameObject';

export const PRIVATE = Symbol('@elixr/player/player');

export class Player extends GameObject {
	[PRIVATE]: {
		head: GameObject;
	};

	constructor() {
		super();
	}
}
