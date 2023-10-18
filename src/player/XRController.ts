import { GameObject } from '../core/GameObject';
import { GamepadWrapper } from 'gamepad-wrapper';
import { Group } from 'three';
import { HANDEDNESS } from '../constants';

export const PRIVATE = Symbol('@elixr/player/xr-controller');

export class XRController extends GameObject {
	[PRIVATE]: {
		handedness: HANDEDNESS;
		raySpace: THREE.Object3D;
		gamepad: GamepadWrapper;
		model: THREE.Object3D;
	};

	constructor(handedness: HANDEDNESS, player: GameObject) {
		super(player);
		this[PRIVATE].handedness = handedness;
		this[PRIVATE].raySpace = new Group();
		player.add(this[PRIVATE].raySpace);
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
	}
}
