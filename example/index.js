import {
	AmbientLight,
	Color,
	DirectionalLight,
	GameSystem,
	Mesh,
	MeshStandardMaterial,
	PhysicsMaterial,
	PlaneCollider,
	PlaneGeometry,
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
		const sphere = this.createRigidbody()
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
		this.scene.add(sphere);
		this.floor = this.createRigidbody({ type: RigidbodyType.Kinematic })
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
).then((world) => {
	world.registerSystem(ExampleSystem);
	world.scene.background = new Color(0x000000);

	// Add ambient light
	const ambientLight = new AmbientLight(new Color(0xffffff), 1);
	world.scene.add(ambientLight);

	// Add directional light
	const directionalLight = new DirectionalLight(new Color(0xffffff), 0.5);
	directionalLight.position.set(0, 1, 0);
	world.scene.add(directionalLight);

	// Set camera position
	world.camera.position.set(0, 0, 10);
	console.log(world.camera.position);
	globalThis.world = world;

	const vrButton = document.getElementById('vr-button');
	VRButton.convertToVRButton(vrButton, world.renderer);
});
