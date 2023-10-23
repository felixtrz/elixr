import {
	AmbientLight,
	BUTTONS,
	BoxGeometry,
	Collider,
	Color,
	CubeShape,
	DirectionalLight,
	GameObject,
	GameSystem,
	Mesh,
	MeshBasicMaterial,
	MeshStandardMaterial,
	PlaneGeometry,
	PlaneShape,
	PrimitiveType,
	RigidBody,
	RigidBodyType,
	VRButton,
	Vector3,
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
		this.cube = new GameObject().add(
			new Mesh(
				new BoxGeometry(1, 1, 1),
				new MeshBasicMaterial({ color: 0x00ff00 }),
			),
		);
		this.cube.position.z = -3;
		this.cube.addComponent(RigidBody, {
			initConfig: { bodyType: RigidBodyType.KinematicPositionBased },
		});
		const shape = new CubeShape(1, 1, 1);
		this.cube.addComponent(Collider, { shape: shape });
		this.rotationAxis = new Vector3(
			Math.random(),
			Math.random(),
			Math.random(),
		).normalize();
	}

	initXR() {
		console.log('initXR');
	}

	update(delta) {
		this.cube.rotateOnAxis(this.rotationAxis, delta * 5);
		const gamepad = this.player.controllers.right.gamepad;
		if (gamepad && gamepad.getButtonClick(BUTTONS.XR_STANDARD.TRIGGER)) {
			if (this.dropCube) {
				this.dropCube.destroy();
			}
			this.dropCube = GameObject.createPrimitive(PrimitiveType.Cube);
			this.dropCube.position.set(0, 2, -3);
		}
	}
}

initEngine(
	document.getElementById('scene-container'),
	{ enablePhysics: true },
	assets,
).then((core) => {
	core.registerGameSystem(ExampleSystem);

	const material = new MeshStandardMaterial({ color: 0xffffff });

	const mesh = new Mesh(new PlaneGeometry(5, 5), material);
	mesh.rotateX(-Math.PI / 2);
	const gameObject = new GameObject().add(mesh);
	gameObject.addComponent(RigidBody, {
		initConfig: { bodyType: RigidBodyType.Fixed },
	});
	const shape = new PlaneShape(5, 5);
	gameObject.addComponent(Collider, { shape: shape });
	gameObject.position.set(0, -1, -3);

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
