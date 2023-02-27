/* -------------------------------------------------------------------------- */
/*                                 3D Library                                 */
/* -------------------------------------------------------------------------- */
export { THREE } from './graphics/CustomTHREE';
export { Vector2, Vector3, Vector4 } from './graphics/Vectors';
export { Quaternion } from './graphics/Quaternion';
export { CurvedRaycaster } from './graphics/CurvedRaycaster';
export { GLTFModelLoader } from './graphics/GLTFModelLoader';
export { MeshRenderer } from './graphics/meshes/MeshRendererComponent';

/* -------------------------------------------------------------------------- */
/*                           Entity Component System                          */
/* -------------------------------------------------------------------------- */
export { Not, Types } from 'ecsy';
export { GameObject } from './core/GameObject';
export { GameComponent } from './core/GameComponent';
export { SystemConfig } from './core/GameComponent';
export {
	GameSystem,
	XRGameSystem,
	SingleUseGameSystem,
	SingleUseXRGameSystem,
} from './core/GameSystem';
export { Core } from './core/Core';

/* -------------------------------------------------------------------------- */
/*                                Gamepad Utils                               */
/* -------------------------------------------------------------------------- */
export { BUTTONS, AXES, GamepadWrapper } from 'gamepad-wrapper';

/* -------------------------------------------------------------------------- */
/*                               Physics Engine                               */
/* -------------------------------------------------------------------------- */
export { RigidBody } from './physics/RigidBodyComponent';
export { Collider } from './physics/ColliderComponent';
export { PhysicsMaterial } from './physics/PhysicsMaterial';
export { PhysicsSystem, PhysicsConfig } from './physics/PhysicsSystem';
export { ActiveCollisionTypes } from '@dimforge/rapier3d/geometry';
export { RigidBodyType, CoefficientCombineRule } from '@dimforge/rapier3d';
export {
	PrimitiveShape,
	PlaneShape,
	CubeShape,
	SphereShape,
	CylinderShape,
	CapsuleShape,
	ConeShape,
	QuadShape,
} from './physics/ColliderShapes';
export {
	CollisionDetectionMode,
	RigidBodyConstraints,
	convexHullShape,
} from './physics/PhysicsHelper';

/* -------------------------------------------------------------------------- */
/*                                Locomotion                                  */
/* -------------------------------------------------------------------------- */
export {
	MovementSurface,
	MovementObstacle,
} from './xr/locomotion/MovementComponents';
export {
	XRSnapTurnConfig,
	XRSnapTurnSystem,
} from './xr/locomotion/XRSnapTurnSystem';
export {
	XRSmoothTurnConfig,
	XRSmoothTurnSystem,
} from './xr/locomotion/XRSmoothTurnSystem';
export {
	XRTeleportConfig,
	XRTeleportSystem,
} from './xr/locomotion/XRTeleportSystem';
export { XRSlideConfig, XRSlideSystem } from './xr/locomotion/XRSlideSystem';

/* -------------------------------------------------------------------------- */
/*                                    Enums                                   */
/* -------------------------------------------------------------------------- */
export { JOYSTICK_STATES, HANDEDNESS, SESSION_MODE } from './core/enums';

/* -------------------------------------------------------------------------- */
/*                                 Geometries                                 */
/* -------------------------------------------------------------------------- */
export { CurveTubeGeometry } from './graphics/geometries/CurveTubeGeometry';

/* -------------------------------------------------------------------------- */
/*                                 XR Buttons                                 */
/* -------------------------------------------------------------------------- */
export { VRButtonOptions, VRButton } from './xr/VRButton';
export { ARButtonOptions, ARButton } from './xr/ARButton';
