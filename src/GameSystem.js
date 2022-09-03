import { System } from 'ecsy';

export class GameSystem extends System {
	constructor(world, attributes) {
		super(world, attributes);
		this.core = this.world.core;
	}

	execute(delta, time) {
		this.update(delta, time);
	}

	update(_delta, _time) {}
}

export class XRGameSystem extends GameSystem {
	execute(delta, time) {
		if (this.core.isImmersive) {
			this.update(delta, time);
		}
	}
}
