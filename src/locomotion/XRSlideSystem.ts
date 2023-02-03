import { AXES, BUTTONS } from 'gamepad-wrapper';
import { MovementObstacle, MovementSurface } from './MovementComponents';

import { HANDEDNESS } from '../enums';
import { SystemConfig } from '../GameComponent';
import { THREE } from '../three/CustomTHREE';
import { Types } from 'ecsy';
import { XRGameSystem } from '../GameSystem';

export interface XRSlideConfig extends XRSlideComponent {
	JOYSTICK_DEADZONE: number;
	MAX_MOVEMENT_SPEED: number;
	DESCEND_ANGLE_THRESHOLD: number;
	CLIMB_ANGLE_THRESHOLD: number;
	CONTROLLER_HANDEDNESS: HANDEDNESS;
}

class XRSlideComponent extends SystemConfig {}

XRSlideComponent.schema = {
	JOYSTICK_DEADZONE: { type: Types.Number, default: 0.1 },
	MAX_MOVEMENT_SPEED: { type: Types.Number, default: 1 },
	DESCEND_ANGLE_THRESHOLD: { type: Types.Number, default: -Math.PI / 4 },
	CLIMB_ANGLE_THRESHOLD: { type: Types.Number, default: Math.PI / 4 },
	CONTROLLER_HANDEDNESS: { type: Types.String, default: HANDEDNESS.LEFT },
};

const DOWNWARD_VECTOR = new THREE.Vector3(0, -1, 0);

export class XRSlideSystem extends XRGameSystem {
	private _config: XRSlideConfig;
	private _raycaster: THREE.Raycaster;

	init() {
		this._config = this.config as XRSlideConfig;
		this._raycaster = new THREE.Raycaster();
	}

	update(delta: number) {
		if (!this.core.controllers[this._config.CONTROLLER_HANDEDNESS]) return;
		const gamepad = this.core.controllers['left'].gamepad;
		const xValue = gamepad.getAxis(AXES.XR_STANDARD.THUMBSTICK_X);
		const yValue = gamepad.getAxis(AXES.XR_STANDARD.THUMBSTICK_Y);
		const inputValue = gamepad.get2DInputValue(BUTTONS.XR_STANDARD.THUMBSTICK);
		if (inputValue < this._config.JOYSTICK_DEADZONE) return;

		const camera = this.core.renderer.xr.getCamera();
		const direction = new THREE.Vector3(xValue, 0, yValue).applyQuaternion(
			camera.getWorldQuaternion(new THREE.Quaternion()),
		);
		direction.y = 0;
		const expectedHorizontalDistance =
			this._config.MAX_MOVEMENT_SPEED * delta * inputValue;
		const expectedPosition = new THREE.Vector3().addVectors(
			this.core.playerSpace.position,
			direction.normalize().multiplyScalar(expectedHorizontalDistance),
		);
		const cameraHeight = this.core.renderer.xr
			.getCamera()
			.getWorldPosition(new THREE.Vector3()).y;
		const rayOrigin = expectedPosition.clone().setY(cameraHeight);
		this._raycaster.set(rayOrigin, DOWNWARD_VECTOR);

		const objects = this.queryGameObjects('obstacles').concat(
			this.queryGameObjects('surfaces'),
		);
		const intersect = this._raycaster.intersectObjects(objects, true)[0];
		if (!intersect || expectedHorizontalDistance < 1e-5) return;
		const deltaY = intersect.point.y - expectedPosition.y;
		const pitchAngle = Math.atan(deltaY / expectedHorizontalDistance);
		if (
			pitchAngle < this._config.CLIMB_ANGLE_THRESHOLD &&
			pitchAngle > this._config.DESCEND_ANGLE_THRESHOLD
		) {
			this.core.playerSpace.position.copy(intersect.point);
		}
	}
}

XRSlideSystem.queries = {
	obstacles: { components: [MovementObstacle] },
	surfaces: { components: [MovementSurface] },
};

XRSlideSystem.systemConfig = XRSlideComponent;
