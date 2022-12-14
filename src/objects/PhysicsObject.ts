import * as CANNON from 'cannon-es';

import { GameObject, RigidBodyComponent, THREE } from '../index';

import { createConvexPolyhedron } from '../physics/utils';

export type PhysicsOptions = {
	hasPhysics?: boolean;
	mass?: number;
	type?: BODY_TYPES;
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
	protected _shape: CANNON.Shape;

	constructor(physicsOptions: PhysicsOptions = {}) {
		super();

		this._hasPhysics = Boolean(physicsOptions.hasPhysics);
		this._mass = physicsOptions.mass ?? 1;
		this._type = physicsOptions.type ?? BODY_TYPES.DYNAMIC;
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
			});
		}

		return this;
	}
}
