import {
	AmbientLight,
	BoxGeometry,
	Color,
	DirectionalLight,
	GameObject,
	Mesh,
	MeshBasicMaterial,
	VRButton,
	initEngine,
} from 'elixr';

initEngine(document.getElementById('scene-container')).then((core) => {
	const cube = new GameObject().add(
		new Mesh(
			new BoxGeometry(1, 1, 1),
			new MeshBasicMaterial({ color: 0x00ff00 }),
		),
	);
	cube.position.z = -3;

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
