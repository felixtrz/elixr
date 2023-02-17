import * as Physics from 'cannon-es';

import { GameObject } from '../GameObject';
import { RigidBodyComponent } from '../physics/PhysicsComponents';
import { THREE } from '../three/CustomTHREE';
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
	STATIC = Physics.BODY_TYPES.STATIC,
	DYNAMIC = Physics.BODY_TYPES.DYNAMIC,
	KINEMATIC = Physics.BODY_TYPES.KINEMATIC,
}

export class PhysicsObject extends GameObject {
	protected _hasPhysics: boolean;
	protected _mass: number;
	protected _type: BODY_TYPES;
	protected _friction: number;
	protected _restitution: number;
	protected _shape: Physics.Shape;
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
}
