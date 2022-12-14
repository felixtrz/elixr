import { BODY_TYPES, PhysicsOptions } from './PhysicsObject';
import { Physics, RigidBodyComponent, THREE } from '../index';
import { PrimitiveMaterialOptions, PrimitiveObject } from './PrimitiveObject';

export class CubeObject extends PrimitiveObject {
	private _width: number;
	private _height: number;
	private _depth: number;

	constructor(
		width: number,
		height: number,
		depth: number,
		materialOptions: PrimitiveMaterialOptions = {},
		physicsOptions: PhysicsOptions = {},
	) {
		super(materialOptions, physicsOptions);
		this._width = width;
		this._height = height;
		this._depth = depth;
		this._geometry = new THREE.BoxGeometry(width, height, depth);
		this._mesh = new THREE.Mesh(this._geometry, this._material);
		this.add(this._mesh);
		this.addComponent(RigidBodyComponent, {
			mass: this._type == BODY_TYPES.DYNAMIC ? this._mass : 0,
			shape: new Physics.Box(
				new Physics.Vec3(this._width / 2, this._height / 2, this._depth / 2),
			),
			type: this._type,
		});
	}

	copy(source: CubeObject, recursive?: boolean): this {
		super.copy(source as this, recursive);
		this._width = source._width;
		this._height = source._height;
		this._depth = source._depth;
		return this;
	}
}
