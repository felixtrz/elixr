import { Mesh, Object3D, Vector3 } from 'three';

import { ConvexPolyhedron } from '@dimforge/rapier3d';

export type RigidBodyConstraints = {
	translational: {
		x: boolean;
		y: boolean;
		z: boolean;
	};
	rotational: {
		x: boolean;
		y: boolean;
		z: boolean;
	};
};

export enum CollisionDetectionMode {
	Discrete = 'Discrete',
	Continuous = 'Continuous',
}

export const convexHullShape = (object: Object3D) => {
	const points: Vector3[] = [];
	object.updateMatrixWorld(true);

	object.traverse((node) => {
		if ((node as Mesh).isMesh) {
			const positions = (node as Mesh).geometry.attributes.position.array;
			for (let i = 0; i < positions.length; i += 3) {
				points.push(
					new Vector3(
						positions[i],
						positions[i + 1],
						positions[i + 2],
					).applyMatrix4(node.matrixWorld),
				);
			}
		}
	});

	return new ConvexPolyhedron(
		new Float32Array(points.flatMap((p) => [p.x, p.y, p.z])),
	);
};
