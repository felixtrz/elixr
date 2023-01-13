import * as CANNON from 'cannon-es';

import { GameObject, RigidBodyComponent, THREE } from '../index';

import { createConvexPolyhedron } from '../physics/utils';

export type PhysicsOptions = {
	hasPhysics?: boolean;
	mass?: number;
	type?: BODY_TYPES;
	friction?: number;
	restitution?: number;
	allowSleep?: boolean;
	sleepSpeedLimit?: number;
	sleepTimeLimit?: number;
};

export enum BODY_TYPES {
	STATIC = CANNON.BODY_TYPES.STATIC,
	DYNAMIC = CANNON.BODY_TYPES.DYNAMIC,
	KINEMATIC = CANNON.BODY_TYPES.KINEMATIC,
}

export class PhysicsObject extends GameObject {
	protected _hasPhysics: boolean;
	protected _mass: number;
	protected _type: BODY_TYPES;
	protected _friction: number;
	protected _restitution: number;
	protected _shape: CANNON.Shape;
	protected _allowSleep: boolean;
	protected _sleepSpeedLimit: number;
	protected _sleepTimeLimit: number;

	constructor(physicsOptions: PhysicsOptions = {}) {
		super();

		this._hasPhysics = Boolean(physicsOptions.hasPhysics);
		this._mass = physicsOptions.mass ?? 1;
		this._type = physicsOptions.type ?? BODY_TYPES.DYNAMIC;
		this._friction = physicsOptions.friction ?? 0.3;
		this._restitution = physicsOptions.restitution ?? 0.0;
		this._allowSleep = physicsOptions.allowSleep ?? true;
		this._sleepSpeedLimit = physicsOptions.sleepSpeedLimit ?? 0.1;
		this._sleepTimeLimit = physicsOptions.sleepTimeLimit ?? 1;
	}

	generateConvexBodyFromGeometry(geometry: THREE.BufferGeometry) {
		if (this.hasComponent(RigidBodyComponent)) {
			this.removeComponent(RigidBodyComponent, true);
		}
		this._shape = createConvexPolyhedron(geometry);
		this.addComponent(RigidBodyComponent, {
			mass: this._type == BODY_TYPES.DYNAMIC ? this._mass : 0,
			shape: this._shape,
			type: this._type,
		});
	}

	copy(source: this, recursive?: boolean): this {
		super.copy(source, recursive);

		this._hasPhysics = source._hasPhysics;
		this._mass = source._mass;
		this._type = source._type;
		this._shape = source._shape;

		if (this.hasComponent(RigidBodyComponent)) {
			this.removeComponent(RigidBodyComponent, true);
			this.addComponent(RigidBodyComponent, {
				mass: this._type == BODY_TYPES.DYNAMIC ? this._mass : 0,
				shape: this._shape,
				type: this._type,
				material: new CANNON.Material({
					friction: this._friction,
					restitution: this._restitution,
				}),
				allowSleep: this._allowSleep,
				sleepSpeedLimit: this._sleepSpeedLimit,
				sleepTimeLimit: this._sleepTimeLimit,
			});
		}

		return this;
	}
}
