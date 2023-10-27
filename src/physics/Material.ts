import { CoefficientCombineRule } from '@dimforge/rapier3d';

export const PRIVATE = Symbol('@elixr/physics/material');

export class PhysicsMaterial {
	/** @ignore */
	[PRIVATE]: {
		density: number;
		friction: number;
		bounciness: number;
		frictionCombine: CoefficientCombineRule;
		bouncinessCombine: CoefficientCombineRule;
		needsUpdate: boolean;
	};

	constructor({
		density = 1,
		friction = 0.7,
		bounciness = 0.3,
		frictionCombine = CoefficientCombineRule.Average,
		bouncinessCombine = CoefficientCombineRule.Average,
	} = {}) {
		this[PRIVATE] = {
			density,
			friction,
			bounciness,
			frictionCombine,
			bouncinessCombine,
			needsUpdate: true,
		};
	}

	get density(): number {
		return this[PRIVATE].density;
	}

	set density(value: number) {
		this[PRIVATE].density = value;
		this[PRIVATE].needsUpdate = true;
	}

	get friction(): number {
		return this[PRIVATE].friction;
	}

	set friction(value: number) {
		this[PRIVATE].friction = value;
		this[PRIVATE].needsUpdate = true;
	}

	get bounciness(): number {
		return this[PRIVATE].bounciness;
	}

	set bounciness(value: number) {
		this[PRIVATE].bounciness = value;
		this[PRIVATE].needsUpdate = true;
	}

	get frictionCombine(): CoefficientCombineRule {
		return this[PRIVATE].frictionCombine;
	}

	set frictionCombine(value: CoefficientCombineRule) {
		this[PRIVATE].frictionCombine = value;
		this[PRIVATE].needsUpdate = true;
	}

	get bouncinessCombine(): CoefficientCombineRule {
		return this[PRIVATE].bouncinessCombine;
	}

	set bouncinessCombine(value: CoefficientCombineRule) {
		this[PRIVATE].bouncinessCombine = value;
		this[PRIVATE].needsUpdate = true;
	}

	/** @ignore */
	get needsUpdate(): boolean {
		return this[PRIVATE].needsUpdate;
	}
}
