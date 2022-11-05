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
	private _rayPath: THREE.CatmullRomCurve3;
	private _teleortMarker: THREE.Mesh;

	init() {
		this._prevState = JOYSTICK_STATES.DISENGAGED;
		this._raycaster = new CurvedRaycaster(new Vector3(), new Vector3());
		this._rayPath = new THREE.CatmullRomCurve3();

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
		if (!this._teleortMarker) {
			this._teleortMarker = new THREE.Mesh(
				new THREE.SphereGeometry(0.1, 32, 32),
			);
			this.core.scene.add(this._teleortMarker);
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

		if (
			curState !== JOYSTICK_STATES.BACK &&
			this._prevState === JOYSTICK_STATES.BACK
		) {
			if (this._teleortMarker.visible && this._teleortMarker.userData.valid) {
				this.core.playerSpace.position.copy(this._teleortMarker.position);
			}
		}

		this._rayMesh.visible = curState === JOYSTICK_STATES.BACK;
		this._teleortMarker.visible = false;
		if (curState == JOYSTICK_STATES.BACK) {
			const objects = this.queryGameObjects('obstacles').concat(
				this.queryGameObjects('surfaces'),
			);
			const intersect = this._raycaster.intersectObjects(objects, true)[0];

			if (intersect) {
				this._teleortMarker.position.copy(intersect.point);
				this._teleortMarker.visible = true;
				this._rayPath.points = calculateCulledRayPoints(
					this._raycaster.points as Vector3[],
					intersect.point as Vector3,
				);

				const object = findRootGameObject(intersect.object);
				if (object.hasComponent(MovementSurface)) {
					this._teleortMarker.userData.valid = true;
				} else {
					this._teleortMarker.userData.valid = false;
				}
			} else {
				this._rayPath.points = this._raycaster.points as Vector3[];
			}
			(this._rayMesh.geometry as CurveTubeGeometry).setFromPath(this._rayPath);
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

const calculateCulledRayPoints = (
	segmentPoints: Vector3[],
	intersectPoint: Vector3,
) => {
	const culledPoints = [];

	for (let i = 0; i < segmentPoints.length - 1; i++) {
		const p1 = segmentPoints[i];
		const p2 = segmentPoints[i + 1];
		if (
			(p1.x - intersectPoint.x) * (intersectPoint.x - p2.x) >= 0 &&
			(p1.y - intersectPoint.y) * (intersectPoint.y - p2.y) >= 0 &&
			(p1.z - intersectPoint.z) * (intersectPoint.z - p2.z) >= 0
		) {
			culledPoints.push(p1);
			culledPoints.push(intersectPoint);
			return culledPoints;
		} else {
			culledPoints.push(p1);
		}
	}
	return segmentPoints;
};
