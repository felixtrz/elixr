import {
	BODY_TYPES,
	PrimitiveMaterialOptions,
	PrimitiveObject,
	PrimitivePhysicsOptions,
} from './PrimitiveObject';
import { Physics, RigidBodyComponent, THREE } from '../index';

export class ConeObject extends PrimitiveObject {
	private _radius: number;
	private _height: number;

	constructor(
		radius: number,
		height: number,
		materialOptions: PrimitiveMaterialOptions = {},
		physicsOptions: PrimitivePhysicsOptions = {},
	) {
		super(materialOptions, physicsOptions);
		this._radius = radius;
		this._height = height;
		this._geometry = new THREE.ConeGeometry(radius, height, 32);
		const cube = new THREE.Mesh(this._geometry, this._material);
		this.add(cube);
		this._mesh = cube;
	}

	_onInit() {
		if (this._hasPhysics) {
			this._rigidBody = this.addComponent(RigidBodyComponent, {
				mass: this._type == BODY_TYPES.DYNAMIC ? this._mass : 0,
				shape: new Physics.Cylinder(0.001, this._radius, this._height, 16),
				type: this._type,
			}) as RigidBodyComponent;
		}
	}
}
