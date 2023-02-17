import * as Physics from 'cannon-es';

import { BODY_TYPES, PhysicsOptions } from './PhysicsObject';
import { PrimitiveMaterialOptions, PrimitiveObject } from './PrimitiveObject';

import { RigidBodyComponent } from '../physics/PhysicsComponents';
import { THREE } from '../three/CustomTHREE';

export class ConeObject extends PrimitiveObject {
	private _radius: number;
	private _height: number;

	constructor(
		radius: number,
		height: number,
		materialOptions: PrimitiveMaterialOptions = {},
		physicsOptions: PhysicsOptions = {},
	) {
		super(materialOptions, physicsOptions);
		this._radius = radius;
		this._height = height;
		this._geometry = new THREE.ConeGeometry(radius, height, 32);
		this._mesh = new THREE.Mesh(this._geometry, this._material);
		this.add(this._mesh);
		this.addComponent(RigidBodyComponent, {
			mass: this._type == BODY_TYPES.DYNAMIC ? this._mass : 0,
			shape: new Physics.Cylinder(0.001, this._radius, this._height, 16),
			type: this._type,
		});
	}
}
