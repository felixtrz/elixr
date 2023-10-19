import {
	BoxGeometry,
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
	const vrButton = document.getElementById('vr-button');
	VRButton.convertToVRButton(vrButton, core.renderer);
});
