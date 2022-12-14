import { BODY_TYPES, PhysicsOptions } from './PhysicsObject';
import { Physics, RigidBodyComponent, THREE } from '../index';
import { PrimitiveMaterialOptions, PrimitiveObject } from './PrimitiveObject';

export class SphereObject extends PrimitiveObject {
	private _radius: number;

	constructor(
		radius: number,
		materialOptions: PrimitiveMaterialOptions = {},
		physicsOptions: PhysicsOptions = {},
	) {
		super(materialOptions, physicsOptions);
		this._radius = radius;
		this._geometry = new THREE.SphereGeometry(radius);
		this._mesh = new THREE.Mesh(this._geometry, this._material);
		this.add(this._mesh);
		this.addComponent(RigidBodyComponent, {
			mass: this._type == BODY_TYPES.DYNAMIC ? this._mass : 0,
			shape: new Physics.Sphere(this._radius),
			type: this._type,
		});
	}

	copy(source: SphereObject, recursive?: boolean): this {
		super.copy(source as this, recursive);
		this._radius = source._radius;
		return this;
	}
}
