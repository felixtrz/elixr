import { System } from 'ecsy';

export class GameSystem extends System {
	/** @type {import('./Core').Core} */
	get core() {
		return this.world.core;
	}

	execute(delta, time) {
		this.update(delta, time);
	}

	/**
	 * @param {string} queryId
	 * @returns {import('./GameObject').GameObject[]}
	 */
	queryGameObjects(queryId) {
		if (!this.queries[queryId])
			throw 'Query id does not exist in current game system';
		return this.queries[queryId].results.map((entity) => entity.gameObject);
	}

	/**
	 * @param {string} queryId
	 * @returns {import('./GameObject').GameObject[]}
	 */
	queryAddedGameObjects(queryId) {
		if (!this.queries[queryId]) {
			throw 'Query id does not exist in current game system';
		} else if (!this.queries[queryId].added) {
			throw 'This query does not listen to added events';
		}
		return this.queries[queryId].added?.map((entity) => entity.gameObject);
	}

	/**
	 * @param {string} queryId
	 * @returns {import('./GameObject').GameObject[]}
	 */
	queryRemovedGameObjects(queryId) {
		if (!this.queries[queryId]) {
			throw 'Query id does not exist in current game system';
		} else if (!this.queries[queryId].added) {
			throw 'This query does not listen to removed events';
		}
		return this.queries[queryId].removed?.map((entity) => entity.gameObject);
	}

	/**
	 * @param {Number} _delta
	 * @param {Number} _time
	 */
	update(_delta, _time) {}
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
