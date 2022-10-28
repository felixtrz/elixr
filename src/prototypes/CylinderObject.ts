import {
	BODY_TYPES,
	PrimitiveMaterialOptions,
	PrimitiveObject,
	PrimitivePhysicsOptions,
} from './PrimitiveObject';
import { Physics, RigidBodyComponent, THREE } from '../index';

export class CylinderObject extends PrimitiveObject {
	private _radiusTop: number;
	private _radiusBottom: number;
	private _height: number;

	constructor(
		radiusTop: number,
		radiusBottom: number,
		height: number,
		materialOptions: PrimitiveMaterialOptions = {},
		physicsOptions: PrimitivePhysicsOptions = {},
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
		this._mesh = cube;
	}

	_onInit() {
		if (this._hasPhysics) {
			this._rigidBody = this.addComponent(RigidBodyComponent, {
				mass: this._type == BODY_TYPES.DYNAMIC ? this._mass : 0,
				shape: new Physics.Cylinder(
					this._radiusTop,
					this._radiusBottom,
					this._height,
					16,
				),
				type: this._type,
			}) as RigidBodyComponent;
		}
	}
}
