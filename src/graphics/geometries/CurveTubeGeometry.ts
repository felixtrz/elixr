import {
	BufferGeometry,
	Float32BufferAttribute,
	Vector2,
	Vector3,
} from 'three';

export class CurveTubeGeometry extends BufferGeometry {
	tangents: Vector3[];

	normals: Vector3[];

	binormals: Vector3[];

	private parameters: {
		tubularSegments: number;
		radialSegments: number;
		radius: number;
		closed: boolean;
	};

	private _vertex: Vector3;

	private _normal: Vector3;

	private _uv: Vector2;

	private _P: Vector3;

	private _vertices: number[];

	private _normals: number[];

	private _uvs: number[];

	private _indices: number[];

	constructor(
		tubularSegments = 64,
		radialSegments = 8,
		radius = 0.1,
		closed = false,
	) {
		super();
		this.parameters = {
			tubularSegments: tubularSegments,
			radialSegments: radialSegments,
			radius: radius,
			closed: closed,
		};

		this.tangents = null;
		this.normals = null;
		this.binormals = null;
		Object.defineProperty(this, 'type', { value: 'CurveTubeGeometry' });
	}

	setFromPath(path: THREE.Curve<Vector3>) {
		const tubularSegments = this.parameters['tubularSegments'];
		const closed = this.parameters['closed'];
		const frames = path.computeFrenetFrames(tubularSegments, closed);

		// expose internals
		this.tangents = frames.tangents;
		this.normals = frames.normals;
		this.binormals = frames.binormals;

		// reset helper variables
		this._vertex = new Vector3();
		this._normal = new Vector3();
		this._uv = new Vector2();
		this._P = new Vector3();
		this._vertices = [];
		this._normals = [];
		this._uvs = [];
		this._indices = [];

		// create buffer data

		this._generateBufferData(path);

		// build geometry

		this.setIndex(this._indices);
		this.setAttribute(
			'position',
			new Float32BufferAttribute(this._vertices, 3),
		);
		this.setAttribute('normal', new Float32BufferAttribute(this._normals, 3));
		this.setAttribute('uv', new Float32BufferAttribute(this._uvs, 2));
	}

	private _generateSegment(i: number, path: THREE.Curve<Vector3>) {
		const tubularSegments = this.parameters['tubularSegments'];
		const radialSegments = this.parameters['radialSegments'];
		// we use getPointAt to sample evenly distributed points from the given path

		this._P = path.getPointAt(i / tubularSegments, this._P);

		// retrieve corresponding normal and binormal

		const N = this.normals[i];
		const B = this.binormals[i];

		// generate normals and vertices for the current segment

		for (let j = 0; j <= radialSegments; j++) {
			const v = (j / radialSegments) * Math.PI * 2;

			const sin = Math.sin(v);
			const cos = -Math.cos(v);

			// normal

			this._normal.x = cos * N.x + sin * B.x;
			this._normal.y = cos * N.y + sin * B.y;
			this._normal.z = cos * N.z + sin * B.z;
			this._normal.normalize();

			this._normals.push(this._normal.x, this._normal.y, this._normal.z);

			// vertex

			const curRadius = this.parameters['radius'];
			this._vertex.x = this._P.x + curRadius * this._normal.x;
			this._vertex.y = this._P.y + curRadius * this._normal.y;
			this._vertex.z = this._P.z + curRadius * this._normal.z;

			this._vertices.push(this._vertex.x, this._vertex.y, this._vertex.z);
		}
	}

	private _generateIndices() {
		const tubularSegments = this.parameters['tubularSegments'];
		const radialSegments = this.parameters['radialSegments'];
		for (let j = 1; j <= tubularSegments; j++) {
			for (let i = 1; i <= radialSegments; i++) {
				const a = (radialSegments + 1) * (j - 1) + (i - 1);
				const b = (radialSegments + 1) * j + (i - 1);
				const c = (radialSegments + 1) * j + i;
				const d = (radialSegments + 1) * (j - 1) + i;

				// faces

				this._indices.push(a, b, d);
				this._indices.push(b, c, d);
			}
		}
	}

	private _generateUVs() {
		const tubularSegments = this.parameters['tubularSegments'];
		const radialSegments = this.parameters['radialSegments'];
		for (let i = 0; i <= tubularSegments; i++) {
			for (let j = 0; j <= radialSegments; j++) {
				this._uv.x = i / tubularSegments;
				this._uv.y = j / radialSegments;

				this._uvs.push(this._uv.x, this._uv.y);
			}
		}
	}

	private _generateBufferData(path: THREE.Curve<Vector3>) {
		const tubularSegments = this.parameters['tubularSegments'];
		const closed = this.parameters['closed'];
		for (let i = 0; i < tubularSegments; i++) {
			this._generateSegment(i, path);
		}
		this._generateSegment(closed === false ? tubularSegments : 0, path);
		this._generateUVs();
		this._generateIndices();
	}
}
