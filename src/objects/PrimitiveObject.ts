import { PhysicsObject, PhysicsOptions } from './PhysicsObject';

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

	set color(color: THREE.Color) {
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
