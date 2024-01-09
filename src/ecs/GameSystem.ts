/**
 * Represents a base class for all game systems. A game system is a class that updates the
 * state of the game world on each frame.
 */

import { QueryManager } from 'elics/lib/QueryManager';
import { System } from 'elics';
import { World } from './World';

export const PRIVATE = Symbol('@elixr/ecs/game-system');

/**
 * A base class for all game systems. A game system is a class that updates the
 * state of the game world on each frame.
 */
export class GameSystem extends System {
	/** @ignore */
	[PRIVATE]: {
		isImmersive: boolean;
		justEnteredXR: boolean;
		justExitedXR: boolean;
		isXRGameSystem: boolean;
		update: (delta: number, time: number) => void;
	} = {
		isImmersive: false,
		justEnteredXR: false,
		justExitedXR: false,
		isXRGameSystem: false,
		update: (delta: number, time: number) => {
			const isImmersive = this.renderer.xr.isPresenting;
			this[PRIVATE].justEnteredXR = isImmersive && !this[PRIVATE].isImmersive;
			this[PRIVATE].justExitedXR = !isImmersive && this[PRIVATE].isImmersive;
			this[PRIVATE].isImmersive = isImmersive;
			if (this[PRIVATE].isXRGameSystem && !this[PRIVATE].isImmersive) return;
			this.update(delta, time);
		},
	};

	get player() {
		return (this.world as World).player;
	}

	get scene() {
		return (this.world as World).scene;
	}

	get camera() {
		return (this.world as World).camera;
	}

	get renderer() {
		return (this.world as World).renderer;
	}

	get globals() {
		return (this.world as World).globals;
	}

	get assetManager() {
		return (this.world as World).assetManager;
	}

	get audioManager() {
		return (this.world as World).audioManager;
	}

	get justEnteredXR() {
		return this[PRIVATE].justEnteredXR;
	}

	get justExitedXR() {
		return this[PRIVATE].justExitedXR;
	}

	createGameObject() {
		return (this.world as World).createGameObject();
	}
}

/**
 * A game system that only updates when the app is in immersive mode.
 */
export class XRGameSystem extends GameSystem {
	constructor(world: World, queryManager: QueryManager, priority?: number) {
		super(world, queryManager, priority);
		this[PRIVATE].isXRGameSystem = true;
	}
}
