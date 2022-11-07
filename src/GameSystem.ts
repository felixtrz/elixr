import { Attributes, System, SystemQueries, World } from 'ecsy';
import { Core, ExtendedWorld } from './Core';
import { GameComponentConstructor, SystemConfig } from './GameComponent';

import { ExtendedEntity } from './GameObject';

export class GameSystem extends System {
	core: Core;
	static systemConfig?: GameComponentConstructor<SystemConfig>;

	constructor(world: World, attributes?: Attributes) {
		super(world, attributes);
		this.core = (this.world as ExtendedWorld).core;
	}

	execute(delta: number, time: number) {
		this.update(delta, time);
	}

	queryGameObjects(queryId: string) {
		if (!this.queries[queryId])
			throw 'Query id does not exist in current game system';
		return this.queries[queryId].results.map(
			(entity) => (entity as ExtendedEntity).gameObject,
		);
	}

	queryAddedGameObjects(queryId: string) {
		if (!this.queries[queryId]) {
			throw 'Query id does not exist in current game system';
		} else if (!this.queries[queryId].added) {
			throw 'This query does not listen to added events';
		}
		return this.queries[queryId].added?.map(
			(entity) => (entity as ExtendedEntity).gameObject,
		);
	}

	queryRemovedGameObjects(queryId: string) {
		if (!this.queries[queryId]) {
			throw 'Query id does not exist in current game system';
		} else if (!this.queries[queryId].added) {
			throw 'This query does not listen to removed events';
		}
		return this.queries[queryId].removed?.map(
			(entity) => (entity as ExtendedEntity).gameObject,
		);
	}

	update(_delta: number, _time: number): void {}
}

export class XRGameSystem extends GameSystem {
	execute(delta: number, time: number) {
		if (this.core.isImmersive()) {
			this.update(delta, time);
		}
	}
}

export class SingleUseGameSystem extends GameSystem {
	execute(delta: number, time: number) {
		this.update(delta, time);
		this.stop();
	}
}

export class SingleUseXRGameSystem extends GameSystem {
	execute(delta: number, time: number) {
		if (this.core.isImmersive()) {
			this.update(delta, time);
			this.stop();
		}
	}
}

export interface GameSystemConstructor<T extends GameSystem> {
	isSystem: true;
	queries: SystemQueries;
	systemConfig?: GameComponentConstructor<SystemConfig>;
	new (...args: any): T;
}
