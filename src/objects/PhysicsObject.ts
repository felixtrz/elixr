import { GameObject, Physics, RigidBodyComponent, THREE } from '../index';

import { createConvexPolyhedron } from '../physics/utils';

export type PhysicsOptions = {
	hasPhysics?: boolean;
	mass?: number;
	type?: BODY_TYPES;
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
		this.addComponent(RigidBodyComponent, {
			mass: this._type == BODY_TYPES.DYNAMIC ? this._mass : 0,
			shape: createConvexPolyhedron(geometry),
			type: this._type,
		});
	}
}
