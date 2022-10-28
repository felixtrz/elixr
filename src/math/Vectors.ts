import { THREE } from '../index';

/**
 * This class extends THREE.Vector2
 *
 * @see https://threejs.org/docs/#api/en/math/Vector2
 */
export class Vector2 extends THREE.Vector2 {
	almostEquals(vector: Vector2, precision = 1e-6): boolean {
		if (
			Math.abs(this.x - vector.x) > precision ||
			Math.abs(this.y - vector.y) > precision
		) {
			return false;
		}
		return true;
	}

	almostZero(precision = 1e-6): boolean {
		if (Math.abs(this.x) > precision || Math.abs(this.y) > precision) {
			return false;
		}
		return true;
	}

	setZero(): void {
		this.x = this.y = 0;
	}

	isZero(): boolean {
		return this.x === 0 && this.y === 0;
	}

	isNaN(): boolean {
		return isNaN(this.x) || isNaN(this.y);
	}

	toString(): string {
		return `${this.x},${this.y}`;
	}

	unit(target = new Vector2()): Vector2 {
		target.copy(this);
		return target.normalize();
	}
}

/**
 * This class extends THREE.Vector3
 *
 * @see https://threejs.org/docs/#api/en/math/Vector3
 */
export class Vector3 extends THREE.Vector3 {
	almostEquals(vector: Vector3, precision = 1e-6): boolean {
		if (
			Math.abs(this.x - vector.x) > precision ||
			Math.abs(this.y - vector.y) > precision ||
			Math.abs(this.z - vector.z) > precision
		) {
			return false;
		}
		return true;
	}

	almostZero(precision = 1e-6): boolean {
		if (
			Math.abs(this.x) > precision ||
			Math.abs(this.y) > precision ||
			Math.abs(this.z) > precision
		) {
			return false;
		}
		return true;
	}

	setZero(): void {
		this.x = this.y = this.z = 0;
	}

	isZero(): boolean {
		return this.x === 0 && this.y === 0 && this.z === 0;
	}

	isNaN(): boolean {
		return isNaN(this.x) || isNaN(this.y) || isNaN(this.z);
	}

	toString(): string {
		return `${this.x},${this.y},${this.z}`;
	}

	unit(target = new Vector3()): Vector3 {
		target.copy(this);
		return target.normalize();
	}
}

/**
 * This class extends THREE.Vector4
 *
 * @see https://threejs.org/docs/#api/en/math/Vector4
 */
export class Vector4 extends THREE.Vector4 {
	almostEquals(vector: Vector4, precision = 1e-6): boolean {
		if (
			Math.abs(this.x - vector.x) > precision ||
			Math.abs(this.y - vector.y) > precision ||
			Math.abs(this.z - vector.z) > precision ||
			Math.abs(this.w - vector.w) > precision
		) {
			return false;
		}
		return true;
	}

	almostZero(precision = 1e-6): boolean {
		if (
			Math.abs(this.x) > precision ||
			Math.abs(this.y) > precision ||
			Math.abs(this.z) > precision ||
			Math.abs(this.w) > precision
		) {
			return false;
		}
		return true;
	}

	setZero(): void {
		this.x = this.y = this.z = this.w = 0;
	}

	isZero(): boolean {
		return this.x === 0 && this.y === 0 && this.z === 0 && this.w === 0;
	}

	isNaN(): boolean {
		return isNaN(this.x) || isNaN(this.y) || isNaN(this.z) || isNaN(this.w);
	}

	toString(): string {
		return `${this.x},${this.y},${this.z},${this.w}`;
	}

	unit(target = new Vector4()): Vector4 {
		target.copy(this);
		return target.normalize();
	}
}
