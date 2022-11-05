import { AXES, GameComponent, Types, XRGameSystem } from '../index';

import { HANDEDNESS } from '../enums';

type XRSmoothTurnConfig = {
	JOYSTICK_DEADZONE: number;
	MAX_ANGULAR_SPEED: number;
	CONTROLLER_HANDEDNESS: HANDEDNESS;
};

export class XRSmoothTurnComponent extends GameComponent<any> {}

XRSmoothTurnComponent.schema = {
	JOYSTICK_DEADZONE: { type: Types.Number, default: 0.1 },
	MAX_ANGULAR_SPEED: { type: Types.Number, default: (Math.PI / 180) * 60 },
	CONTROLLER_HANDEDNESS: { type: Types.String, default: HANDEDNESS.RIGHT },
};

export class XRSmoothTurnSystem extends XRGameSystem {
	private _config: XRSmoothTurnConfig;

	init() {
		if (!this.core.hasRegisteredGameComponent(XRSmoothTurnComponent)) {
			this.core.registerGameComponent(XRSmoothTurnComponent);
		}

		if (!this.core.game.hasComponent(XRSmoothTurnComponent)) {
			this.core.game.addComponent(XRSmoothTurnComponent);
		}

		// @ts-ignore
		this._config = this.core.game.getComponent(XRSmoothTurnComponent);
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
