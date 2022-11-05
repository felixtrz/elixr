import {
	BUTTONS,
	CurveTubeGeometry,
	CurvedRaycaster,
	GameComponent,
	GameObject,
	THREE,
	Types,
	Vector3,
	XRGameSystem,
} from '../index';
import { HANDEDNESS, JOYSTICK_STATES } from '../enums';
import { MovementObstacle, MovementSurface } from './MovementComponents';

type XRTeleportConfig = {
	JOYSTICK_ANGLE_MIN: number;
	JOYSTICK_ANGLE_MAX: number;
	JOYSTICK_DEADZONE: number;
	CONTROLLER_HANDEDNESS: HANDEDNESS;
};

export class XRTeleportComponent extends GameComponent<any> {}

XRTeleportComponent.schema = {
	JOYSTICK_ANGLE_MIN: { type: Types.Number, default: (Math.PI / 180) * 135 },
	JOYSTICK_ANGLE_MAX: { type: Types.Number, default: (Math.PI / 180) * 180 },
	JOYSTICK_DEADZONE: { type: Types.Number, default: 0.95 },
	CONTROLLER_HANDEDNESS: { type: Types.String, default: HANDEDNESS.RIGHT },
};

export class XRTeleportSystem extends XRGameSystem {
	private _prevState: number;
	private _config: XRTeleportConfig;
	private _raycaster: CurvedRaycaster;
	private _rayMesh: THREE.Mesh;

	init() {
		this._prevState = JOYSTICK_STATES.DISENGAGED;
		this._raycaster = new CurvedRaycaster(new Vector3(), new Vector3());

		if (!this.core.hasRegisteredGameComponent(XRTeleportComponent)) {
			this.core.registerGameComponent(XRTeleportComponent);
		}

		if (!this.core.game.hasComponent(XRTeleportComponent)) {
			this.core.game.addComponent(XRTeleportComponent);
		}

		// @ts-ignore
		this._config = this.core.game.getComponent(XRTeleportComponent);
	}

	update() {
		if (!this.core.controllers[this._config.CONTROLLER_HANDEDNESS]) return;
		if (!this._rayMesh) {
			this._rayMesh = new THREE.Mesh(new CurveTubeGeometry(50, 8, 0.01, false));
			this.core.scene.add(this._rayMesh);
			this._rayMesh.frustumCulled = false;
			this._rayMesh.renderOrder = 999;
		}

		const controller =
			this.core.controllers[this._config.CONTROLLER_HANDEDNESS];

		this._raycaster.set(
			controller.targetRaySpace.getWorldPosition(
				new THREE.Vector3(),
			) as Vector3,
			controller.targetRaySpace
				.getWorldDirection(new THREE.Vector3())
				.multiplyScalar(-1) as Vector3,
		);

		(this._rayMesh.geometry as CurveTubeGeometry).setFromPath(
			this._raycaster.curve,
		);

		const gamepad = controller.gamepad;
		const inputAngle = gamepad.get2DInputAngle(BUTTONS.XR_STANDARD.THUMBSTICK);
		const inputValue = gamepad.get2DInputValue(BUTTONS.XR_STANDARD.THUMBSTICK);
		let curState = JOYSTICK_STATES.DISENGAGED;

		if (
			Math.abs(inputAngle) > this._config.JOYSTICK_ANGLE_MIN &&
			Math.abs(inputAngle) <= this._config.JOYSTICK_ANGLE_MAX &&
			inputValue >= this._config.JOYSTICK_DEADZONE
		) {
			curState = JOYSTICK_STATES.BACK;
		}
		if (this._prevState == JOYSTICK_STATES.DISENGAGED) {
			if (curState == JOYSTICK_STATES.BACK) {
				const objects = this.queryGameObjects('obstacles').concat(
					this.queryGameObjects('surfaces'),
				);
				const intersects = this._raycaster.intersectObjects(objects, true);
				if (intersects[0]) {
					console.log(findRootGameObject(intersects[0].object));
				}
			}
		}
		this._prevState = curState;
	}
}

XRTeleportSystem.queries = {
	obstacles: { components: [MovementObstacle] },
	surfaces: { components: [MovementSurface] },
};

const findRootGameObject = (obj: THREE.Object3D): GameObject | null => {
	if ((obj as GameObject).isGameObject) {
		return obj as GameObject;
	} else if (!obj.parent) {
		return null;
	} else {
		return findRootGameObject(obj.parent);
	}
};
