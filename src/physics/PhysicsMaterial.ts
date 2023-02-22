import { CoefficientCombineRule } from '@dimforge/rapier3d';
import { Collider } from './ColliderComponent';

export class PhysicsMaterial {
	private _density: number;
	private _friction: number;
	private _frictionCombine: CoefficientCombineRule;
	private _restitution: number;
	private _restitutionCombine: CoefficientCombineRule;
	public name: string;
	public attachedColliders: Collider[] = [];

	constructor(
		name?: string,
		density?: number,
		friction?: number,
		frictionCombine?: CoefficientCombineRule,
		restitution?: number,
		restitutionCombine?: CoefficientCombineRule,
	) {
		this.name = name || 'default physics material';
		this._density = density || 1;
		this._friction = friction || 0.7;
		this._frictionCombine = frictionCombine || CoefficientCombineRule.Average;
		this._restitution = restitution || 0.3;
		this._restitutionCombine =
			restitutionCombine || CoefficientCombineRule.Average;
	}

	public get density(): number {
		return this._density;
	}

	public set density(value: number) {
		this._density = value;
		this.attachedColliders.forEach((collider) => {
			collider.updateMaterial();
		});
	}

	public get friction(): number {
		return this._friction;
	}

	public set friction(value: number) {
		this._friction = value;
		this.attachedColliders.forEach((collider) => {
			collider.updateMaterial();
		});
	}

	public get frictionCombine(): CoefficientCombineRule {
		return this._frictionCombine;
	}

	public set frictionCombine(value: CoefficientCombineRule) {
		this._frictionCombine = value;
		this.attachedColliders.forEach((collider) => {
			collider.updateMaterial();
		});
	}

	public get restitution(): number {
		return this._restitution;
	}

	public set restitution(value: number) {
		this._restitution = value;
		this.attachedColliders.forEach((collider) => {
			collider.updateMaterial();
		});
	}

	public get restitutionCombine(): CoefficientCombineRule {
		return this._restitutionCombine;
	}

	public set restitutionCombine(value: CoefficientCombineRule) {
		this._restitutionCombine = value;
		this.attachedColliders.forEach((collider) => {
			collider.updateMaterial();
		});
	}

	public clone(): PhysicsMaterial {
		return new PhysicsMaterial(
			this.name,
			this._density,
			this._friction,
			this._frictionCombine,
			this._restitution,
			this._restitutionCombine,
		);
	}

	public copy(material: PhysicsMaterial): void {
		this.name = material.name;
		this._density = material.density;
		this._friction = material.friction;
		this._frictionCombine = material.frictionCombine;
		this._restitution = material.restitution;
		this._restitutionCombine = material.restitutionCombine;
	}
}
