import { Matrix4, WebXRManager } from 'three';
import { PRIVATE as XRCONTROLLER_PRIVATE, XRController } from './XRController';

import { GameObject } from '../ecs/GameObject';
import { World } from '../ecs/World';

export const PRIVATE = Symbol('@elixr/xr/player');

export class Player extends GameObject {
	/** @ignore */
	[PRIVATE]: {
		head: GameObject;
		controllers: Record<XRHandedness, XRController>;
	} = {
		head: null,
		controllers: null,
	};

	constructor(world: World) {
		super(world);
		this[PRIVATE].head = world.createGameObject();
		this[PRIVATE].controllers = {
			none: new XRController(world, 'none', this),
			left: new XRController(world, 'left', this),
			right: new XRController(world, 'right', this),
		};
	}

	get controllers() {
		return this[PRIVATE].controllers;
	}

	/**
	 * Accurate source for player head transform, can be used to attach game
	 * objects / audio listeners.
	 */
	get head() {
		return this[PRIVATE].head;
	}

	updateMatrixWorld(force?: boolean): void {
		super.updateMatrixWorld(force);
	}

	update(xrManager: WebXRManager) {
		const session = xrManager.getSession();
		if (session) {
			const referenceSpace = xrManager.getReferenceSpace();
			const frame = xrManager.getFrame();
			if (frame) {
				// update controllers
				const inputSources = Array.from(
					session.inputSources,
				) as XRInputSource[];
				const inputSourceMap = new Map<XRHandedness, XRInputSource>();
				for (const inputSource of inputSources) {
					if (!inputSource.hand) {
						inputSourceMap.set(inputSource.handedness, inputSource);
					}
				}

				(['none', 'left', 'right'] as XRHandedness[]).forEach((handedness) => {
					const controller = this[PRIVATE].controllers[handedness];
					if (!inputSourceMap.has(handedness)) {
						if (controller[XRCONTROLLER_PRIVATE].connected) {
							controller.disconnect();
						}
						controller[XRCONTROLLER_PRIVATE].connected = false;
					} else {
						const inputSource = inputSourceMap.get(handedness)!;
						if (!controller[XRCONTROLLER_PRIVATE].connected) {
							controller.connect(inputSourceMap.get(handedness)!);
						}
						controller[XRCONTROLLER_PRIVATE].connected = true;
						controller.update(inputSource, frame, referenceSpace);
					}
				});

				// update head
				const pose = frame.getViewerPose(referenceSpace);
				if (pose) {
					const headsetMatrix = new Matrix4().fromArray(
						pose.views[0].transform.matrix,
					);
					headsetMatrix.decompose(
						this[PRIVATE].head.position,
						this[PRIVATE].head.quaternion,
						this[PRIVATE].head.scale,
					);
				}
			}
		}
	}
}
