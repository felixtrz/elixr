import { AXES } from 'gamepad-wrapper';
import { SystemConfig } from '../../ecs/GameComponent';
import { Types } from 'ecsy';
import { XRGameSystem } from '../../ecs/GameSystem';

export interface XRSmoothTurnConfig extends XRSmoothTurnComponent {
	JOYSTICK_DEADZONE: number;
	MAX_ANGULAR_SPEED: number;
	CONTROLLER_HANDEDNESS: XRHandedness;
}

class XRSmoothTurnComponent extends SystemConfig {}

XRSmoothTurnComponent.schema = {
	JOYSTICK_DEADZONE: { type: Types.Number, default: 0.1 },
	MAX_ANGULAR_SPEED: { type: Types.Number, default: (Math.PI / 180) * 60 },
	CONTROLLER_HANDEDNESS: { type: Types.String, default: 'right' },
};

export class XRSmoothTurnSystem extends XRGameSystem {
	private _config: XRSmoothTurnConfig;

	init() {
		this._config = this.config as XRSmoothTurnConfig;
	}

	update(delta: number) {
		if (
			!this.core.player.controllers[this._config.CONTROLLER_HANDEDNESS]
				.connected
		)
			return;
		const rightController =
			this.core.player.controllers[this._config.CONTROLLER_HANDEDNESS];
		const xVal = rightController.gamepad.getAxis(AXES.XR_STANDARD.THUMBSTICK_X);
		if (Math.abs(xVal) > this._config.JOYSTICK_DEADZONE) {
			this.core.player.rotateY(this._config.MAX_ANGULAR_SPEED * delta * -xVal);
		}
	}
}

XRSmoothTurnSystem.systemConfig = XRSmoothTurnComponent;
