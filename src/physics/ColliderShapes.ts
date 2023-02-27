import { Ball, Cuboid, Cylinder } from '@dimforge/rapier3d';

import { Vector3 } from 'three';

export type PrimitiveShape =
	| CubeShape
	| SphereShape
	| CylinderShape
	| CapsuleShape
	| PlaneShape
	| ConeShape
	| QuadShape;

export class CubeShape extends Cuboid {
	private _initialHalfExtents: Vector3;
	private _scale: Vector3;
	public isPrimitiveShape: boolean = true;

	constructor(width: number, height: number, depth: number) {
		super(width / 2, height / 2, depth / 2);
		this._initialHalfExtents = new Vector3(width / 2, height / 2, depth / 2);
		this._scale = new Vector3(1, 1, 1);
	}

	/** @readonly */
	get scale() {
		return this._scale;
	}

	setScale(scale: Vector3) {
		this._scale.copy(scale);
		this.halfExtents.x = this._initialHalfExtents.x * scale.x;
		this.halfExtents.y = this._initialHalfExtents.y * scale.y;
		this.halfExtents.z = this._initialHalfExtents.z * scale.z;
		this._scale.copy(scale);
	}
}

export class SphereShape extends Ball {
	private _initialRadius: number;
	private _scale: Vector3;
	public isPrimitiveShape: boolean = true;

	constructor(radius: number) {
		super(radius);
		this._initialRadius = radius;
		this._scale = new Vector3(1, 1, 1);
	}

	/** @readonly */
	get scale() {
		return this._scale;
	}

	setScale(scale: Vector3) {
		this.radius = this._initialRadius * Math.max(scale.x, scale.y, scale.z);
		this._scale.copy(scale);
	}
}

export class CylinderShape extends Cylinder {
	private _initialHalfHeight: number;
	private _initialRadius: number;
	private _scale: Vector3;
	public isPrimitiveShape: boolean = true;

	constructor(radius: number, height: number) {
		super(height / 2, radius);
		this._initialHalfHeight = height / 2;
		this._initialRadius = radius;
		this._scale = new Vector3(1, 1, 1);
	}

	/** @readonly */
	get scale() {
		return this._scale;
	}

	setScale(scale: Vector3) {
		this.halfHeight = this._initialHalfHeight * scale.y;
		this.radius = this._initialRadius * Math.max(scale.x, scale.z);
		this._scale.copy(scale);
	}
}

export class CapsuleShape extends Cylinder {
	private _initialHalfHeight: number;
	private _initialRadius: number;
	private _scale: Vector3;
	public isPrimitiveShape: boolean = true;

	constructor(radius: number, height: number) {
		super(height / 2, radius);
		this._initialHalfHeight = height / 2;
		this._initialRadius = radius;
		this._scale = new Vector3(1, 1, 1);
	}

	/** @readonly */
	get scale() {
		return this._scale;
	}

	setScale(scale: Vector3) {
		this.halfHeight = this._initialHalfHeight * scale.y;
		this.radius = this._initialRadius * Math.max(scale.x, scale.z);
		this._scale.copy(scale);
	}
}

export class ConeShape extends Cylinder {
	private _initialHalfHeight: number;
	private _initialRadius: number;
	private _scale: Vector3;
	public isPrimitiveShape: boolean = true;

	constructor(radius: number, height: number) {
		super(height / 2, radius);
		this._initialHalfHeight = height / 2;
		this._initialRadius = radius;
		this._scale = new Vector3(1, 1, 1);
	}

	/** @readonly */
	get scale() {
		return this._scale;
	}

	setScale(scale: Vector3) {
		this.halfHeight = this._initialHalfHeight * scale.y;
		this.radius = this._initialRadius * Math.max(scale.x, scale.z);
		this._scale.copy(scale);
	}
}

export class QuadShape extends Cuboid {
	private _initialHalfExtents: Vector3;
	private _scale: Vector3;
	public isPrimitiveShape: boolean = true;

	constructor(width: number, height: number) {
		super(width / 2, height / 2, 0);
		this._initialHalfExtents = new Vector3(width / 2, height / 2, 0);
		this._scale = new Vector3(1, 1, 1);
	}

	/** @readonly */
	get scale() {
		return this._scale;
	}

	setScale(scale: Vector3) {
		this.halfExtents.x = this._initialHalfExtents.x * scale.x;
		this.halfExtents.y = this._initialHalfExtents.y * scale.y;
		this._scale.copy(scale);
	}
}

export class PlaneShape extends Cuboid {
	private _initialHalfExtents: Vector3;
	private _scale: Vector3;
	public isPrimitiveShape: boolean = true;

	constructor(width: number = 100, depth: number = 100) {
		super(width / 2, 0, depth / 2);
		this._initialHalfExtents = new Vector3(width / 2, 0, depth / 2);
		this._scale = new Vector3(1, 1, 1);
	}

	/** @readonly */
	get scale() {
		return this._scale;
	}

	setScale(scale: Vector3) {
		this.halfExtents.x = this._initialHalfExtents.x * scale.x;
		this.halfExtents.z = this._initialHalfExtents.z * scale.z;
		this._scale.copy(scale);
	}
}
