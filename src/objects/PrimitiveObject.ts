import { PhysicsObject, PhysicsOptions } from './PhysicsObject';

import { Color } from '../math/Color';
import { THREE } from '../three/CustomTHREE';

export type PrimitiveMaterialOptions = {
	color?: number | string;
	useBasicMaterial?: boolean;
	opacity?: number;
};

export class PrimitiveObject extends PhysicsObject {
	protected _material: THREE.MeshStandardMaterial | THREE.MeshBasicMaterial;
	protected _geometry: THREE.BufferGeometry;
	protected _mesh: THREE.Mesh;

	constructor(
		materialOptions: PrimitiveMaterialOptions = {},
		physicsOptions: PhysicsOptions = {},
	) {
		super(physicsOptions);
		const threeMatOptions = {
			color: materialOptions.color ?? 0xffffff,
			transparent: materialOptions.opacity < 1,
			opacity: materialOptions.opacity ?? 1,
		};
		this._material = materialOptions.useBasicMaterial
			? new THREE.MeshBasicMaterial(threeMatOptions)
			: new THREE.MeshStandardMaterial(threeMatOptions);
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

	copy(source: this, recursive?: boolean): this {
		super.copy(source, recursive);

		this._material = source._material;
		this._geometry = source._geometry;
		this.remove(this._mesh);
		this._mesh = new THREE.Mesh(this._geometry, this._material);
		this.add(this._mesh);

		return this;
	}
}
