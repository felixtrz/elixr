import { HANDEDNESS, JOYSTICK_STATES } from '../enums';
import { MovementObstacle, MovementSurface } from './MovementComponents';

import { BUTTONS } from 'gamepad-wrapper';
import { CurveTubeGeometry } from '../geometries/CurveTubeGeometry';
import { CurvedRaycaster } from '../three/CurvedRaycaster';
import { GameObject } from '../GameObject';
import { SystemConfig } from '../GameComponent';
import { THREE } from '../three/CustomTHREE';
import { Types } from 'ecsy';
import { Vector3 } from '../three/Vectors';
import { XRGameSystem } from '../GameSystem';

export interface XRTeleportConfig extends XRTeleportComponent {
	JOYSTICK_ANGLE_MIN: number;
	JOYSTICK_ANGLE_MAX: number;
	JOYSTICK_DEADZONE: number;
	RAYCAST_SEGMENTS: number;
	RAY_SPEED: number;
	RAY_MIN_Y: number;
	CONTROLLER_HANDEDNESS: HANDEDNESS;
}

class XRTeleportComponent extends SystemConfig {
	public needsUpdate: boolean = false;
}

XRTeleportComponent.schema = {
	JOYSTICK_ANGLE_MIN: { type: Types.Number, default: (Math.PI / 180) * 135 },
	JOYSTICK_ANGLE_MAX: { type: Types.Number, default: (Math.PI / 180) * 180 },
	JOYSTICK_DEADZONE: { type: Types.Number, default: 0.95 },
	RAYCAST_SEGMENTS: { type: Types.Number, default: 10 },
	RAY_SPEED: { type: Types.Number, default: 7 },
	RAY_MIN_Y: { type: Types.Number, default: -0.1 },
	CONTROLLER_HANDEDNESS: { type: Types.String, default: HANDEDNESS.RIGHT },
};

export class XRTeleportSystem extends XRGameSystem {
	private _prevState: number;
	private _config: XRTeleportConfig;
	private _raycaster: CurvedRaycaster;
	private _rayMesh: THREE.Mesh;
	private _rayPath: THREE.CatmullRomCurve3;
	private _teleportMarker: THREE.Object3D;
	private _markerMesh: THREE.Mesh;
	private _material = new THREE.MeshBasicMaterial({
		color: 0xffffff,
		transparent: true,
		opacity: 0.5,
		side: THREE.DoubleSide,
	});

	private _tempMatrix3 = new THREE.Matrix3();
	private _normalWorld = new Vector3();

	init() {
		this._config = this.config as XRTeleportConfig;

		this._prevState = JOYSTICK_STATES.DISENGAGED;
		this._raycaster = new CurvedRaycaster(
			new Vector3(),
			new Vector3(),
			this._config.RAYCAST_SEGMENTS,
			this._config.RAY_SPEED,
			this._config.RAY_MIN_Y,
		);
		this._rayPath = new THREE.CatmullRomCurve3();
	}

	update() {
		if (!this.core.controllers[this._config.CONTROLLER_HANDEDNESS]) return;
		if (!this._rayMesh) {
			this._rayMesh = new THREE.Mesh(
				new CurveTubeGeometry(50, 8, 0.01, false),
				this._material,
			);
			this.core.scene.add(this._rayMesh);
			this._rayMesh.frustumCulled = false;
			this._rayMesh.renderOrder = 999;
		}
		if (!this._teleportMarker) {
			this._teleportMarker = new THREE.Object3D();
			this._markerMesh = new THREE.Mesh(
				new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32, 1, true),
				this._material,
			);
			this._markerMesh.rotateX(Math.PI / 2);
			this._markerMesh.position.y = 0.02;
			this._teleportMarker.add(this._markerMesh);
			this.core.scene.add(this._teleportMarker);
		}

		this._updateTeleportConfig();

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
			if (this._teleportMarker.visible && this._teleportMarker.userData.valid) {
				this.core.playerSpace.position.copy(this._teleportMarker.position);
			}
		}

		this._rayMesh.visible = curState === JOYSTICK_STATES.BACK;
		this._teleportMarker.visible = false;
		if (curState == JOYSTICK_STATES.BACK) {
			const objects = this.queryGameObjects('obstacles').concat(
				this.queryGameObjects('surfaces'),
			);
			const intersect = this._raycaster.intersectObjects(objects, true)[0];

			if (intersect) {
				this._tempMatrix3.getNormalMatrix(intersect.object.matrixWorld);
				this._normalWorld
					.copy(intersect.face.normal)
					.applyMatrix3(this._tempMatrix3)
					.normalize();

				let angleRandian;
				const opposite = Math.sqrt(
					Math.pow(this._normalWorld.x, 2) + Math.pow(this._normalWorld.z, 2),
				);
				if (opposite < 1e-6) {
					angleRandian = this._normalWorld.y > 0 ? 0 : Math.PI;
				} else {
					angleRandian = Math.atan(opposite / this._normalWorld.y);
				}

				this._teleportMarker.position.copy(intersect.point);
				this._teleportMarker.lookAt(
					new Vector3()
						.copy(this._teleportMarker.position)
						.add(this._normalWorld),
				);
				this._teleportMarker.visible = true;
				this._rayPath.points = calculateCulledRayPoints(
					this._raycaster.points as Vector3[],
					intersect.point as Vector3,
				);

				const object = findRootGameObject(intersect.object);
				this._teleportMarker.userData.valid =
					object.hasComponent(MovementSurface) && angleRandian < Math.PI / 4;
			} else {
				this._rayPath.points = this._raycaster.points as Vector3[];
			}
			(this._rayMesh.geometry as CurveTubeGeometry).setFromPath(this._rayPath);
		}

		this._prevState = curState;
	}

	_updateTeleportConfig() {
		if (this._config.needsUpdate) {
			this._config.needsUpdate = false;
			this._raycaster.numSegments = this._config.RAYCAST_SEGMENTS;
			this._raycaster.shootingSpeed = this._config.RAY_SPEED;
			this._raycaster.minY = this._config.RAY_MIN_Y;
		}
	}
}

XRTeleportSystem.queries = {
	obstacles: { components: [MovementObstacle] },
	surfaces: { components: [MovementSurface] },
};

XRTeleportSystem.systemConfig = XRTeleportComponent;

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
