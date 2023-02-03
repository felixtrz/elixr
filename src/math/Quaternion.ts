import { THREE } from '../three/CustomTHREE';
import { Vector3 } from './Vectors';

export class Quaternion extends THREE.Quaternion {
	toString(): string {
		return `${this.x},${this.y},${this.z},${this.w}`;
	}

	/** Converts the quaternion to [ axis, angle ] representation. */
	toAxisAngle(targetAxis = new Vector3()): [Vector3, number] {
		this.normalize(); // if w>1 acos and sqrt will produce errors, this cant happen if quaternion is normalised
		const angle = 2 * Math.acos(this.w);
		const s = Math.sqrt(1 - this.w * this.w); // assuming quaternion normalised then w is less than 1, so term always positive.
		if (s < 0.001) {
			// test to avoid divide by zero, s is always positive due to sqrt
			// if s close to zero then direction of axis not important
			targetAxis.x = this.x; // if it is important that axis is normalised then replace with x=1; y=z=0;
			targetAxis.y = this.y;
			targetAxis.z = this.z;
		} else {
			targetAxis.x = this.x / s; // normalise axis
			targetAxis.y = this.y / s;
			targetAxis.z = this.z / s;
		}
		return [targetAxis, angle];
	}

	/**
	 * Rotate an absolute orientation quaternion given an angular velocity and a
	 * time step.
	 */
	integrate(
		angularVelocity: Vector3,
		dt: number,
		angularFactor: Vector3,
		target = new Quaternion(),
	): Quaternion {
		const ax = angularVelocity.x * angularFactor.x,
			ay = angularVelocity.y * angularFactor.y,
			az = angularVelocity.z * angularFactor.z,
			bx = this.x,
			by = this.y,
			bz = this.z,
			bw = this.w;

		const half_dt = dt * 0.5;

		target.x += half_dt * (ax * bw + ay * bz - az * by);
		target.y += half_dt * (ay * bw + az * bx - ax * bz);
		target.z += half_dt * (az * bw + ax * by - ay * bx);
		target.w += half_dt * (-ax * bx - ay * by - az * bz);

		return target;
	}

	/**
	 * Convert the quaternion to euler angle representation. Order: YZX, as this
	 * page describes: https://www.euclideanspace.com/maths/standards/index.htm
	 *
	 * @param order Three-character string, defaults to "YZX"
	 */
	toEuler(target: Vector3, order = 'YZX'): void {
		let heading;
		let attitude;
		let bank;
		const x = this.x;
		const y = this.y;
		const z = this.z;
		const w = this.w;

		switch (order) {
			case 'YZX':
				const test = x * y + z * w;
				if (test > 0.499) {
					// singularity at north pole
					heading = 2 * Math.atan2(x, w);
					attitude = Math.PI / 2;
					bank = 0;
				}
				if (test < -0.499) {
					// singularity at south pole
					heading = -2 * Math.atan2(x, w);
					attitude = -Math.PI / 2;
					bank = 0;
				}
				if (heading === undefined) {
					const sqx = x * x;
					const sqy = y * y;
					const sqz = z * z;
					heading = Math.atan2(2 * y * w - 2 * x * z, 1 - 2 * sqy - 2 * sqz); // Heading
					attitude = Math.asin(2 * test); // attitude
					bank = Math.atan2(2 * x * w - 2 * y * z, 1 - 2 * sqx - 2 * sqz); // bank
				}
				break;
			default:
				throw new Error(`Euler order ${order} not supported yet.`);
		}

		target.y = heading;
		target.z = attitude as number;
		target.x = bank as number;
	}
}
