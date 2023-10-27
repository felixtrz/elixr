import {
	AmbientLight,
	Color,
	DirectionalLight,
	GameObject,
	GameSystem,
	Mesh,
	MeshStandardMaterial,
	PlaneCollider,
	PlaneGeometry,
	Rigidbody,
	SphereCollider,
	SphereGeometry,
	VRButton,
	initEngine,
} from 'elixr';

import { RigidbodyType } from 'elixr/dist/physics/Rigidbody';

const assets = {
	props: {
		url: 'https://elysian.fun/assets/gltf/props.gltf',
		type: 'GLTF',
		callback: (gltf) => {
			console.log(gltf);
		},
	},
};

class ExampleSystem extends GameSystem {
	init() {
		const sphere = new GameObject().add(
			new Mesh(
				new SphereGeometry(1, 32, 32),
				new MeshStandardMaterial({ color: 0xff0000 }),
			),
		);
		sphere.position.set(0, 5, 0);
		const sphereRigidBody = new Rigidbody().add(new SphereCollider(1));
		sphere.add(sphereRigidBody);
		this.sphereRigidBody = sphereRigidBody;

		const floor = new GameObject().add(
			new Mesh(
				new PlaneGeometry(10, 10),
				new MeshStandardMaterial({ color: 0x00ff00 }),
			),
		);
		floor.position.set(0, -1, 0);
		floor.rotateX(-Math.PI / 2);
		const floorRigidBody = new Rigidbody({ type: RigidbodyType.Kinematic }).add(
			new PlaneCollider(10, 10),
		);
		floor.add(floorRigidBody);
		this.floor = floor;
	}

	initXR() {
		console.log('initXR');
	}

	update(delta) {
		this.floor.position.y += delta;

		if (this.floor.position.y > 1) {
			this.floor.position.y = -1;
		}
		// console.log(this.sphereRigidBody.parent.position.toArray());
	}
}

initEngine(
	document.getElementById('scene-container'),
	{ enablePhysics: true },
	assets,
).then((core) => {
	core.registerGameSystem(ExampleSystem);
	core.scene.background = new Color(0x000000);

	const material = new MeshStandardMaterial({ color: 0xffffff });

	const mesh = new Mesh(new PlaneGeometry(5, 5), material);
	mesh.rotateX(-Math.PI / 2);
	new GameObject().add(mesh);

	// Add ambient light
	const ambientLight = new AmbientLight(new Color(0xffffff), 1);
	core.scene.add(ambientLight);

	// Add directional light
	const directionalLight = new DirectionalLight(new Color(0xffffff), 0.5);
	directionalLight.position.set(0, 1, 0);
	core.scene.add(directionalLight);

	// Set camera position
	core.camera.position.set(0, 0, 5);

	const vrButton = document.getElementById('vr-button');
	VRButton.convertToVRButton(vrButton, core.renderer);
});
