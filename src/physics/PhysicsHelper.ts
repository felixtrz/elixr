import { ConvexPolyhedron } from '@dimforge/rapier3d';
import { THREE } from '../graphics/CustomTHREE';

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

export const convexHullShape = (object: THREE.Object3D) => {
	const points: THREE.Vector3[] = [];
	object.updateMatrixWorld(true);

	object.traverse((node) => {
		if ((node as THREE.Mesh).isMesh) {
			const positions = (node as THREE.Mesh).geometry.attributes.position.array;
			for (let i = 0; i < positions.length; i += 3) {
				points.push(
					new THREE.Vector3(
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
