import { BODY_TYPES, PhysicsOptions } from './PhysicsObject';
import { Physics, RigidBodyComponent, THREE } from '../index';
import { PrimitiveMaterialOptions, PrimitiveObject } from './PrimitiveObject';

export class CylinderObject extends PrimitiveObject {
	private _radiusTop: number;
	private _radiusBottom: number;
	private _height: number;

	constructor(
		radiusTop: number,
		radiusBottom: number,
		height: number,
		materialOptions: PrimitiveMaterialOptions = {},
		physicsOptions: PhysicsOptions = {},
	) {
		super(materialOptions, physicsOptions);
		this._radiusTop = radiusTop;
		this._radiusBottom = radiusBottom;
		this._height = height;
		this._geometry = new THREE.CylinderGeometry(
			radiusTop,
			radiusBottom,
			height,
			32,
		);
		const cube = new THREE.Mesh(this._geometry, this._material);
		this.add(cube);
		this.addComponent(RigidBodyComponent, {
			mass: this._type == BODY_TYPES.DYNAMIC ? this._mass : 0,
			shape: new Physics.Cylinder(
				this._radiusTop,
				this._radiusBottom,
				this._height,
				16,
			),
			type: this._type,
		});
	}

	copy(source: CylinderObject, recursive?: boolean): this {
		super.copy(source as this, recursive);
		this._radiusTop = source._radiusTop;
		this._radiusBottom = source._radiusBottom;
		this._height = source._height;
		return this;
	}
}
