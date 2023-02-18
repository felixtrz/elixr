import { AXES } from 'gamepad-wrapper';
import { HANDEDNESS } from '../../core/enums';
import { SystemConfig } from '../../core/GameComponent';
import { Types } from 'ecsy';
import { XRGameSystem } from '../../core/GameSystem';

export interface XRSmoothTurnConfig extends XRSmoothTurnComponent {
	JOYSTICK_DEADZONE: number;
	MAX_ANGULAR_SPEED: number;
	CONTROLLER_HANDEDNESS: HANDEDNESS;
}

class XRSmoothTurnComponent extends SystemConfig {}

XRSmoothTurnComponent.schema = {
	JOYSTICK_DEADZONE: { type: Types.Number, default: 0.1 },
	MAX_ANGULAR_SPEED: { type: Types.Number, default: (Math.PI / 180) * 60 },
	CONTROLLER_HANDEDNESS: { type: Types.String, default: HANDEDNESS.RIGHT },
};

export class XRSmoothTurnSystem extends XRGameSystem {
	private _config: XRSmoothTurnConfig;

	init() {
		this._config = this.config as XRSmoothTurnConfig;
	}

	update(delta: number) {
		if (!this.core.controllers[this._config.CONTROLLER_HANDEDNESS]) return;
		const rightController =
			this.core.controllers[this._config.CONTROLLER_HANDEDNESS];
		const xVal = rightController.gamepad.getAxis(AXES.XR_STANDARD.THUMBSTICK_X);
		if (Math.abs(xVal) > this._config.JOYSTICK_DEADZONE) {
			this.core.playerSpace.rotateY(
				this._config.MAX_ANGULAR_SPEED * delta * -xVal,
			);
		}
	}
}

XRSmoothTurnSystem.systemConfig = XRSmoothTurnComponent;
