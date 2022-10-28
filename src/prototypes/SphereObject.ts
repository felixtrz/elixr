import {
	BODY_TYPES,
	PrimitiveMaterialOptions,
	PrimitiveObject,
	PrimitivePhysicsOptions,
} from './PrimitiveObject';
import { Physics, RigidBodyComponent, THREE } from '../index';

export class SphereObject extends PrimitiveObject {
	private _radius: number;

	constructor(
		radius: number,
		materialOptions: PrimitiveMaterialOptions = {},
		physicsOptions: PrimitivePhysicsOptions = {},
	) {
		super(materialOptions, physicsOptions);
		this._radius = radius;
		this._geometry = new THREE.SphereGeometry(radius);
		const cube = new THREE.Mesh(this._geometry, this._material);
		this.add(cube);
		this._mesh = cube;
	}

	_onInit() {
		if (this._hasPhysics) {
			this._rigidBody = this.addComponent(RigidBodyComponent, {
				mass: this._type == BODY_TYPES.DYNAMIC ? this._mass : 0,
				shape: new Physics.Sphere(this._radius),
				type: this._type,
			}) as RigidBodyComponent;
		}
	}
}
