import {
	Color,
	GameObject,
	Physics,
	RigidBodyComponent,
	THREE,
} from '../index';

export type PrimitiveMaterialOptions = {
	color?: number | string;
	useBasicMaterial?: boolean;
	opacity?: number;
};

export type PrimitivePhysicsOptions = {
	hasPhysics?: boolean;
	mass?: number;
	type?: BODY_TYPES;
};

export enum BODY_TYPES {
	STATIC = Physics.BODY_TYPES.STATIC,
	DYNAMIC = Physics.BODY_TYPES.DYNAMIC,
	KINEMATIC = Physics.BODY_TYPES.KINEMATIC,
}

export class PrimitiveObject extends GameObject {
	protected _mesh: THREE.Mesh;
	protected _material: THREE.MeshStandardMaterial | THREE.MeshBasicMaterial;
	protected _geometry: THREE.BufferGeometry;
	protected _hasPhysics: boolean;
	protected _mass: number;
	protected _type: BODY_TYPES;
	protected _rigidBody?: RigidBodyComponent;

	constructor(
		materialOptions: PrimitiveMaterialOptions = {},
		physicsOptions: PrimitivePhysicsOptions = {},
	) {
		super();
		const threeMatOptions = {
			color: materialOptions.color ?? 0xffffff,
			transparent: materialOptions.opacity < 1,
			opacity: materialOptions.opacity ?? 1,
		};
		this._material = materialOptions.useBasicMaterial
			? new THREE.MeshBasicMaterial(threeMatOptions)
			: new THREE.MeshStandardMaterial(threeMatOptions);

		this._hasPhysics = Boolean(physicsOptions.hasPhysics);
		this._mass = physicsOptions.mass ?? 1;
		this._type = physicsOptions.type ?? BODY_TYPES.DYNAMIC;
	}

	get color() {
		return this._material.color;
	}

	set color(color: Color) {
		this._material.color.copy(color);
	}

	get opacity() {
		return this._material.opacity;
	}

	set opacity(opacity: number) {
		if (opacity >= 1) {
			this._material.transparent = false;
			this._material.opacity = 1;
		} else {
			this._material.transparent = true;
			this._material.opacity = opacity;
		}
	}
}
