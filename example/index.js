import {
	AmbientLight,
	Color,
	DirectionalLight,
	GameObject,
	GameSystem,
	Mesh,
	MeshStandardMaterial,
	PhysicsMaterial,
	PlaneCollider,
	PlaneGeometry,
	Rigidbody,
	RigidbodyType,
	SphereCollider,
	SphereGeometry,
	VRButton,
	initEngine,
} from 'elixr';

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
		const pmat = new PhysicsMaterial({ friction: 1, restitution: 1 });
		const sphere = new Rigidbody()
			.add(new SphereCollider(1, false, pmat))
			.add(
				new Mesh(
					new SphereGeometry(1, 32, 32),
					new MeshStandardMaterial({ color: 0xff0000 }),
				),
			);
		sphere.position.set(0, 5, 0);
		sphere.updateTransform();
		sphere.colliderVisible = true;

		this.floor = new Rigidbody({ type: RigidbodyType.Kinematic })
			.add(new PlaneCollider(10, 10, false, pmat))
			.add(
				new Mesh(
					new PlaneGeometry(10, 10),
					new MeshStandardMaterial({ color: 0x00ff00 }),
				),
			);
		this.floor.position.set(0, -1, 0);
		this.floor.rotateX(-Math.PI / 2);
		this.floor.colliderVisible = true;
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
	core.camera.position.set(0, 0, 10);

	const vrButton = document.getElementById('vr-button');
	VRButton.convertToVRButton(vrButton, core.renderer);
});
