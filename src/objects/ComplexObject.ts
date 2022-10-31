import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js';
import { PhysicsObject } from './PhysicsObject';
import { THREE } from '../index';

export class ComplexObject extends PhysicsObject {
	protected _convexHull?: THREE.Mesh;

	generateConvexBody() {
		const points: THREE.Vector3[] = [];

		this.traverse((node) => {
			if ((node as THREE.Mesh).isMesh) {
				const positions = (node as THREE.Mesh).geometry.attributes.position
					.array;
				for (let i = 0; i < positions.length; i += 3) {
					points.push(
						node.localToWorld(
							new THREE.Vector3(
								positions[i],
								positions[i + 1],
								positions[i + 2],
							),
						),
					);
				}
			}
		});
		const convexGeometry = new ConvexGeometry(points);
		const convexHull = new THREE.Mesh(
			convexGeometry,
			new THREE.MeshBasicMaterial({
				color: 0x00ff00,
				wireframe: true,
			}),
		);

		this.add(convexHull);
		convexHull.visible = false;
		this._convexHull = convexHull;

		this.generateConvexBodyFromGeometry(convexGeometry);
	}

	set colliderVisible(visible: boolean) {
		this._convexHull.visible = visible;
	}
}
