import { GameObject } from '../core/GameObject';
import { GamepadWrapper } from 'gamepad-wrapper';
import { Group } from 'three';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';

export const PRIVATE = Symbol('@elixr/player/xr-controller');
const controllerModelFactory = new XRControllerModelFactory();

export class XRController extends GameObject {
	[PRIVATE]: {
		handedness: XRHandedness;
		connected: boolean;
		raySpace: THREE.Object3D;
		gamepad: GamepadWrapper;
		model: THREE.Object3D;
	} = {
		handedness: null,
		connected: false,
		raySpace: new Group(),
		gamepad: null,
		model: null,
	};

	isGroup = true;

	constructor(handedness: XRHandedness, player: GameObject) {
		super(player);
		this[PRIVATE].handedness = handedness;
		player.add(this[PRIVATE].raySpace);
		this[PRIVATE].model = controllerModelFactory.createControllerModel(
			this as Group,
		);
		this.add(this[PRIVATE].model);
	}

	get connected() {
		return this[PRIVATE].connected;
	}

	get handedness() {
		return this[PRIVATE].handedness;
	}

	get gamepad() {
		return this[PRIVATE].gamepad;
	}

	get raySpace() {
		return this[PRIVATE].raySpace;
	}

	get model() {
		return this[PRIVATE].model;
	}

	update(
		inputSource: XRInputSource,
		frame: XRFrame,
		referenceSpace: XRReferenceSpace,
	) {
		let inputPose = null;
		let gripPose = null;

		if (inputSource && frame.session.visibilityState !== 'visible-blurred') {
			if (inputSource.gripSpace) {
				gripPose = frame.getPose(inputSource.gripSpace, referenceSpace);

				if (gripPose !== null) {
					this.visible = true;
					this.matrix.fromArray(gripPose.transform.matrix);
					this.matrix.decompose(this.position, this.quaternion, this.scale);
					this.matrixWorldNeedsUpdate = true;
				} else {
					this.visible = false;
				}
			}

			inputPose = frame.getPose(inputSource.targetRaySpace, referenceSpace);

			// Some runtimes (namely Vive Cosmos with Vive OpenXR Runtime) have only grip space and ray space is equal to it
			if (inputPose === null && gripPose !== null) {
				inputPose = gripPose;
			}

			if (inputPose !== null) {
				this[PRIVATE].raySpace.visible = true;
				this[PRIVATE].raySpace.matrix.fromArray(inputPose.transform.matrix);
				this[PRIVATE].raySpace.matrix.decompose(
					this[PRIVATE].raySpace.position,
					this[PRIVATE].raySpace.quaternion,
					this[PRIVATE].raySpace.scale,
				);
				this[PRIVATE].raySpace.matrixWorldNeedsUpdate = true;
			} else {
				this[PRIVATE].raySpace.visible = false;
			}
		}

		if (this[PRIVATE].gamepad) {
			this[PRIVATE].gamepad.update();
		}
	}

	connect(inputSource: XRInputSource) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		this.dispatchEvent({ type: 'connected', data: inputSource });
		this[PRIVATE].gamepad = new GamepadWrapper(inputSource.gamepad);
	}

	disconnect() {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		this.dispatchEvent({ type: 'disconnected' });
		this.visible = false;
		this[PRIVATE].raySpace.visible = false;
		this[PRIVATE].gamepad = null;
	}

	updateMatrixWorld(force?: boolean): void {
		super.updateMatrixWorld(force);
		this[PRIVATE].raySpace.updateMatrixWorld(force);
	}
}
