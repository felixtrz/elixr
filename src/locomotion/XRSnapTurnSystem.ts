import {
	BUTTONS,
	GameComponent,
	Quaternion,
	Types,
	Vector3,
	XRGameSystem,
} from '../index';
import { HANDEDNESS, JOYSTICK_STATES } from '../enums';

type XRSnapTurnConfig = {
	JOYSTICK_ANGLE_MIN: number;
	JOYSTICK_ANGLE_MAX: number;
	JOYSTICK_DEADZONE: number;
	SNAP_ANGLE: number;
	CONTROLLER_HANDEDNESS: HANDEDNESS;
};

export class XRSnapTurnComponent extends GameComponent<any> {}

XRSnapTurnComponent.schema = {
	JOYSTICK_ANGLE_MIN: { type: Types.Number, default: (Math.PI / 180) * 45 },
	JOYSTICK_ANGLE_MAX: { type: Types.Number, default: (Math.PI / 180) * 135 },
	JOYSTICK_DEADZONE: { type: Types.Number, default: 0.95 },
	SNAP_ANGLE: { type: Types.Number, default: (Math.PI / 180) * 45 },
	CONTROLLER_HANDEDNESS: { type: Types.String, default: HANDEDNESS.RIGHT },
};

export class XRSnapTurnSystem extends XRGameSystem {
	private _prevState: number;
	private _config: XRSnapTurnConfig;

	init() {
		this._prevState = JOYSTICK_STATES.DISENGAGED;

		if (!this.core.hasRegisteredGameComponent(XRSnapTurnComponent)) {
			this.core.registerGameComponent(XRSnapTurnComponent);
		}

		if (!this.core.game.hasComponent(XRSnapTurnComponent)) {
			this.core.game.addComponent(XRSnapTurnComponent);
		}

		// @ts-ignore
		this._config = this.core.game.getComponent(XRSnapTurnComponent);
	}

	update() {
		if (!this.core.controllers[this._config.CONTROLLER_HANDEDNESS]) return;
		const gamepad =
			this.core.controllers[this._config.CONTROLLER_HANDEDNESS].gamepad;
		const inputAngle = gamepad.get2DInputAngle(BUTTONS.XR_STANDARD.THUMBSTICK);
		const inputValue = gamepad.get2DInputValue(BUTTONS.XR_STANDARD.THUMBSTICK);
		let curState = JOYSTICK_STATES.DISENGAGED;

		if (
			Math.abs(inputAngle) > this._config.JOYSTICK_ANGLE_MIN &&
			Math.abs(inputAngle) <= this._config.JOYSTICK_ANGLE_MAX &&
			inputValue >= this._config.JOYSTICK_DEADZONE
		) {
			if (inputAngle > 0) {
				curState = JOYSTICK_STATES.RIGHT;
			} else {
				curState = JOYSTICK_STATES.LEFT;
			}
		}
		if (this._prevState == JOYSTICK_STATES.DISENGAGED) {
			if (curState == JOYSTICK_STATES.RIGHT) {
				this.core.playerSpace.quaternion.multiply(
					new Quaternion().setFromAxisAngle(
						new Vector3(0, 1, 0),
						-this._config.SNAP_ANGLE,
					),
				);
			} else if (curState == JOYSTICK_STATES.LEFT) {
				this.core.playerSpace.quaternion.multiply(
					new Quaternion().setFromAxisAngle(
						new Vector3(0, 1, 0),
						this._config.SNAP_ANGLE,
					),
				);
			}
		}
		this._prevState = curState;
	}
}
