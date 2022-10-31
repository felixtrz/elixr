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
		const cube = new THREE.Mesh(this._geometry, this._material);
		this.add(cube);
		this._mesh = cube;
		this.addComponent(RigidBodyComponent, {
			mass: this._type == BODY_TYPES.DYNAMIC ? this._mass : 0,
			shape: new Physics.Box(
				new Physics.Vec3(this._width / 2, this._height / 2, this._depth / 2),
			),
			type: this._type,
		});
	}
}
