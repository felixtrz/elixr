/**
 * Represents a base class for all game systems. A game system is a class that updates the
 * state of the game world on each frame.
 */
import { Attributes, System, SystemQueries, World } from 'ecsy';
import { GameComponentConstructor, SystemConfig } from './GameComponent';

import { Core } from './Core';
import { ExtendedEntity } from './GameObject';
import { Player } from '../xr/Player';

/**
 * A base class for all game systems. A game system is a class that updates the
 * state of the game world on each frame.
 */
export class GameSystem extends System {
	/** {@link Core} object that this system is registered to. */
	core: Core;

	/** {@link Player} object */
	player: Player;

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

	/**
	 * Creates a new instance of the {@link GameSystem} class.
	 * @param world The {@link World} instance that this system will be added to.
	 * @param attributes Optional attributes to configure this system.
	 */
	constructor(world: World, attributes?: Attributes) {
		super(world, attributes);
		this.core = Core.getInstance();
		this.player = this.core.player;
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
	 * @param queryId The ID of the query to retrieve game objects for.
	 * @returns An array of {@link GameObject} instances that match the query.
	 * @throws An error if the query ID does not exist in the current game system.
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
	 * @param queryId The ID of the query to retrieve added game objects for.
	 * @returns An array of {@link GameObject} instances that were added in this frame and match the query.
	 * @throws An error if the query ID does not exist in the current game system or if the query does not listen to added events.
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
	 * @param queryId The ID of the query to retrieve removed game objects for.
	 * @returns An array of {@link GameObject} instances that were removed in this frame and match the query.
	 * @throws An error if the query ID does not exist in the current game system or if the query does not listen to removed events.
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
	 * @param delta The time in seconds since the last frame.
	 * @param time The current time in seconds.
	 */
	update(_delta: number, _time: number): void {}
}

/**
 * A game system that only updates when the app is in immersive mode.
 */
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

/**
 * A game system that only updates for a single frame and then stops.
 */
export class SingleUseGameSystem extends GameSystem {
	/** @ignore */
	execute(delta: number, time: number) {
		this.update(delta, time);
		this.stop();
	}
}

/**
 * A game system that only updates for a single frame while the app is in immersive mode and then stops.
 */
export class SingleUseXRGameSystem extends GameSystem {
	/** @ignore */
	execute(delta: number, time: number) {
		if (this.core.isImmersive()) {
			this.update(delta, time);
			this.stop();
		}
	}
}

/**
 * A constructor type for a {@link GameSystem} subclass.
 * @typeparam T The type of the {@link GameSystem} subclass.
 */
export interface GameSystemConstructor<T extends GameSystem> {
	/** A flag indicating that this is a game system constructor. */
	isSystem: true;
	/** The queries that this game system will use. */
	queries: SystemQueries;
	/** An optional system configuration component constructor. */
	systemConfig?: GameComponentConstructor<SystemConfig>;
	/** The constructor function for the game system. */
	new (...args: any): T;
}
