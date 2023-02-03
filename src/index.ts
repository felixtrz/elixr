/* -------------------------------------------------------------------------- */
/*                                 3D Library                                 */
/* -------------------------------------------------------------------------- */
export { THREE } from './three/CustomTHREE';
export { Vector2, Vector3, Vector4 } from './three/Vectors';
export { Quaternion } from './three/Quaternion';
export { CurvedRaycaster } from './three/CurvedRaycaster';

/* -------------------------------------------------------------------------- */
/*                           Entity Component System                          */
/* -------------------------------------------------------------------------- */
export { Not, Types } from 'ecsy';
export { World } from './World';
export { GameObject } from './GameObject';
export { GameComponent } from './GameComponent';
export { SystemConfig } from './GameComponent';
export {
	GameSystem,
	XRGameSystem,
	SingleUseGameSystem,
	SingleUseXRGameSystem,
} from './GameSystem';
export { Core } from './Core';

/* -------------------------------------------------------------------------- */
/*                                Gamepad Utils                               */
/* -------------------------------------------------------------------------- */
export { BUTTONS, AXES, GamepadWrapper } from 'gamepad-wrapper';

/* -------------------------------------------------------------------------- */
/*                               Physics Engine                               */
/* -------------------------------------------------------------------------- */
export * as Physics from 'cannon-es';
export { RigidBodyComponent } from './physics/PhysicsComponents';
export {
	RigidBodyPhysicsSystem,
	PhysicsConfig,
} from './physics/RigidBodyPhysicsSystem';

/* -------------------------------------------------------------------------- */
/*                              Prototype Objects                             */
/* -------------------------------------------------------------------------- */
export {
	BODY_TYPES,
	PhysicsObject,
	PhysicsOptions,
} from './objects/PhysicsObject';
export {
	PrimitiveObject,
	PrimitiveMaterialOptions,
} from './objects/PrimitiveObject';
export { CubeObject } from './objects/CubeObject';
export { SphereObject } from './objects/SphereObject';
export { CylinderObject } from './objects/CylinderObject';
export { ConeObject } from './objects/ConeObject';
export { ComplexObject } from './objects/ComplexObject';
export { GLTFObject, GLTFModelLoader } from './objects/GLTFObject';

/* -------------------------------------------------------------------------- */
/*                                Locomotion                                  */
/* -------------------------------------------------------------------------- */
export {
	MovementSurface,
	MovementObstacle,
} from './locomotion/MovementComponents';
export {
	XRSnapTurnConfig,
	XRSnapTurnSystem,
} from './locomotion/XRSnapTurnSystem';
export {
	XRSmoothTurnConfig,
	XRSmoothTurnSystem,
} from './locomotion/XRSmoothTurnSystem';
export {
	XRTeleportConfig,
	XRTeleportSystem,
} from './locomotion/XRTeleportSystem';
export { XRSlideConfig, XRSlideSystem } from './locomotion/XRSlideSystem';

/* -------------------------------------------------------------------------- */
/*                                    Enums                                   */
/* -------------------------------------------------------------------------- */
export { JOYSTICK_STATES, HANDEDNESS, SESSION_MODE } from './enums';

/* -------------------------------------------------------------------------- */
/*                                 Geometries                                 */
/* -------------------------------------------------------------------------- */
export { CurveTubeGeometry } from './geometries/CurveTubeGeometry';

/* -------------------------------------------------------------------------- */
/*                                 XR Buttons                                 */
/* -------------------------------------------------------------------------- */
export { VRButtonOptions, VRButton } from './utils/VRButton';
export { ARButtonOptions, ARButton } from './utils/ARButton';
