import { THREE } from './CustomTHREE';
import { Vector3 } from './Vectors';

export class CurvedRaycaster extends THREE.Raycaster {
	private _numSegments: number;
	shootingSpeed: number;
	minY: number;
	private _points: Vector3[];

	constructor(
		origin: Vector3,
		direction: Vector3,
		numSegments = 10,
		shootingSpeed = 7,
		minY = -0.1,
	) {
		super(origin, direction);

		this._numSegments = numSegments;
		this.shootingSpeed = shootingSpeed;
		this.minY = minY;
		this._points = Array.from(
			{ length: this._numSegments + 1 },
			() => new Vector3(),
		);

		this._calculatePoints();
	}

	set numSegments(numSegments: number) {
		this._numSegments = numSegments;
		this._points = Array.from(
			{ length: this._numSegments + 1 },
			() => new Vector3(),
		);
		this._calculatePoints();
	}

	get points(): Readonly<Vector3[]> {
		return this._points;
	}

	private _calculatePoints() {
		const g = -9.8;
		const a = new Vector3(0, g, 0);
		let v0 = new Vector3();
		v0.copy(this.ray.direction).multiplyScalar(this.shootingSpeed);
		let max_t = calculateMaxTime(this.ray.origin as Vector3, v0, a, this.minY);
		let dt = max_t / this._numSegments;
		let newPos = new Vector3();
		for (var i = 0; i < this._numSegments + 1; i++) {
			parabolicCurve(this.ray.origin as Vector3, v0, a, dt * i, newPos);
			this._points[i].copy(newPos);
		}
	}

	set(origin: Vector3, direction: Vector3): void {
		super.set(origin, direction);
		this._calculatePoints();
	}

	setFromCamera(coords: { x: number; y: number }, camera: THREE.Camera): void {
		super.setFromCamera(coords, camera);
		this._calculatePoints();
	}

	intersectObject<TIntersected extends THREE.Object3D<THREE.Event>>(
		object: THREE.Object3D<THREE.Event>,
		recursive?: boolean,
		optionalTarget?: THREE.Intersection<TIntersected>[],
	): THREE.Intersection<TIntersected>[] {
		return this.intersectObjects([object], recursive, optionalTarget);
	}

	intersectObjects<TIntersected extends THREE.Object3D<THREE.Event>>(
		objects: THREE.Object3D<THREE.Event>[],
		recursive?: boolean,
		intersects?: THREE.Intersection<TIntersected>[],
	): THREE.Intersection<TIntersected>[] {
		if (!intersects) {
			intersects = [];
		}
		let p1, p2;
		for (let i = 0; i < this._numSegments; i++) {
			p1 = this._points[i];
			p2 = this._points[i + 1];
			let segment = p2.clone().sub(p1);
			this.far = segment.length() * (i == this._numSegments - 1 ? 1.1 : 1);
			super.set(p1, segment.normalize());
			const segmentIntersetcs = super.intersectObjects(objects, recursive);
			intersects = intersects.concat(
				segmentIntersetcs as THREE.Intersection<TIntersected>[],
			);
		}
		return intersects;
	}
}

const calculateMaxTime = (
	p0: Vector3,
	v0: Vector3,
	a: Vector3,
	minY: number,
) => {
	let p1 = a.y / 2;
	let p2 = v0.y;
	let p3 = p0.y - minY;
	// solve p1*x^2 + p2*x + p3 = 0
	var t = (-1 * p2 - Math.sqrt(Math.pow(p2, 2) - 4 * p1 * p3)) / (2 * p1);
	return t;
};

// Utils
// Parabolic motion equation, y = p0 + v0*t + 1/2at^2
const parabolicCurveScalar = (p0: number, v0: number, a: number, t: number) => {
	return p0 + v0 * t + 0.5 * a * t * t;
};

// Parabolic motion equation applied to 3 dimensions
const parabolicCurve = (
	p0: Vector3,
	v0: Vector3,
	a: Vector3,
	t: number,
	out: Vector3,
) => {
	out.x = parabolicCurveScalar(p0.x, v0.x, a.x, t);
	out.y = parabolicCurveScalar(p0.y, v0.y, a.y, t);
	out.z = parabolicCurveScalar(p0.z, v0.z, a.z, t);
	return out;
};
