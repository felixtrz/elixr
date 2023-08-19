import { Attributes, System, SystemQueries, World } from 'ecsy';
import { GameComponentConstructor, SystemConfig } from './GameComponent';

import { Core } from './Core';
import { ExtendedEntity } from './GameObject';

export class GameSystem extends System {
	/** {@link Core} object that this system is registered to. */
	core: Core;

	/**
	 * Mutable reference to the optional {@link SystemConfig} component associated
	 * with this system.
	 */
	config?: SystemConfig;

	/** An optional {@link SystemConfig} class for configuring this system. */
	static systemConfig?: GameComponentConstructor<SystemConfig>;

	/**
	 * Defines what {@link GameComponent} the System will query for. This needs to
	 * be user defined.
	 */
	static queries: SystemQueries;

	protected _isImmersive = false;

	constructor(world: World, attributes?: Attributes) {
		super(world, attributes);
		this.core = Core.getInstance();
		this.config = attributes?.config as SystemConfig;
	}

	/** This function is called on the frames in which the app enters immersive */
	initXR() {}

	/** This function is called on the frames in which the app exits immersive */
	exitXR() {}

	/** @ignore */
	execute(delta: number, time: number) {
		const isImmersive = this.core.isImmersive();
		if (isImmersive) {
			if (!this._isImmersive) this.initXR();
		} else {
			if (this._isImmersive) this.exitXR();
		}
		this._isImmersive = isImmersive;
		this.update(delta, time);
	}

	/**
	 * Get a list of all {@link GameObject} of the given queryId in
	 * {@link GameSystem.queries}.
	 */
	queryGameObjects(queryId: string) {
		if (!this.queries[queryId])
			throw 'Query id does not exist in current game system';
		return this.queries[queryId].results.map(
			(entity) => (entity as ExtendedEntity).gameObject,
		);
	}

	/**
	 * Get a list of all {@link GameObject} of the given queryId that are added in
	 * this frame in {@link GameSystem.queries}. This does not include the
	 * GameObjects that gets added in GameSystems that execute after this system.
	 */
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

	/**
	 * Get a list of all {@link GameObject} of the given queryId that are removed
	 * in this frame in {@link GameSystem.queries}. This does not include the
	 * GameObjects that gets removed in GameSystems that execute after this
	 * system.
	 */
	queryRemovedGameObjects(queryId: string) {
		if (!this.queries[queryId]) {
			throw 'Query id does not exist in current game system';
		} else if (!this.queries[queryId].removed) {
			throw 'This query does not listen to removed events';
		}
		return this.queries[queryId].removed?.map(
			(entity) => (entity as ExtendedEntity).gameObject,
		);
	}

	/**
	 * This function is called on each frame {@link Core} is executed. All of the
	 * queries defined on the class are available here.
	 */
	update(_delta: number, _time: number): void {}
}

export class XRGameSystem extends GameSystem {
	/** @ignore */
	execute(delta: number, time: number) {
		const isImmersive = this.core.isImmersive();
		if (isImmersive) {
			if (!this._isImmersive) this.initXR();
			this.update(delta, time);
		} else {
			if (this._isImmersive) this.exitXR();
		}
		this._isImmersive = isImmersive;
	}
}

export class SingleUseGameSystem extends GameSystem {
	/** @ignore */
	execute(delta: number, time: number) {
		this.update(delta, time);
		this.stop();
	}
}

export class SingleUseXRGameSystem extends GameSystem {
	/** @ignore */
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
