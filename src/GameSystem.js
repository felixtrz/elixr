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

	queryEntities(queryId) {
		if (!this.queries[queryId])
			throw 'Query id does not exist in current game system';
		return this.queries[queryId].results.map((entity) => entity.gameObject);
	}
}

export class XRGameSystem extends GameSystem {
	execute(delta, time) {
		if (this.core.isImmersive) {
			this.update(delta, time);
		}
	}
}

export class SingleUseGameSystem extends GameSystem {
	execute(delta, time) {
		this.update(delta, time);
		this.stop();
	}
}

export class SingleUseXRGameSystem extends GameSystem {
	execute(delta, time) {
		if (this.core.isImmersive) {
			this.update(delta, time);
			this.stop();
		}
	}
}
