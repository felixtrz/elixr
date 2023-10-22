import {
	AmbientLight,
	BoxGeometry,
	Color,
	DirectionalLight,
	GameObject,
	GameSystem,
	Mesh,
	MeshBasicMaterial,
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
	}

	initXR() {
		console.log('initXR');
	}

	update(delta) {
		this.cube.rotateOnAxis(
			new Vector3(Math.random(), Math.random(), Math.random()).normalize(),
			delta,
		);
	}
}

initEngine(
	document.getElementById('scene-container'),
	{ enablePhysics: false },
	assets,
).then((core) => {
	core.registerGameSystem(ExampleSystem);

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
