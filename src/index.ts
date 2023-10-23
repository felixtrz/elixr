import { VERSION as ELIXR_VERSION } from './version';
import { version as RAPIER_VERSION } from '@dimforge/rapier3d';
import { REVISION as THREE_VERSION } from 'three';

const FIGLET = String.raw`
| __|| |(_)\ \/ /| _ \  
| _| | || | >  < |   /  
|___||_||_|/_/\_\|_|_\ `;

/* -------------------------------------------------------------------------- */
/*                                 3D Library                                 */
/* -------------------------------------------------------------------------- */
export * from './graphics/Three';
export { CurvedRaycaster } from './addons/CurvedRaycaster';
export {
	AssetManager,
	AssetDescriptor,
	ASSET_TYPE,
} from './graphics/AssetManager';

/* -------------------------------------------------------------------------- */
/*                           Entity Component System                          */
/* -------------------------------------------------------------------------- */
export { Not, Types } from 'ecsy';
export { GameObject, PrimitiveType } from './ecs/GameObject';
export { GameComponent } from './ecs/GameComponent';
export { SystemConfig } from './ecs/GameComponent';
export {
	GameSystem,
	XRGameSystem,
	SingleUseGameSystem,
	SingleUseXRGameSystem,
} from './ecs/GameSystem';
export { Core } from './ecs/Core';
export { initEngine, EngineInitOptions } from './init';

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
} from './addons/locomotion/MovementComponents';
export {
	XRSnapTurnConfig,
	XRSnapTurnSystem,
} from './addons/locomotion/XRSnapTurnSystem';
export {
	XRSmoothTurnConfig,
	XRSmoothTurnSystem,
} from './addons/locomotion/XRSmoothTurnSystem';
export {
	XRTeleportConfig,
	XRTeleportSystem,
} from './addons/locomotion/XRTeleportSystem';
export {
	XRSlideConfig,
	XRSlideSystem,
} from './addons/locomotion/XRSlideSystem';

/* -------------------------------------------------------------------------- */
/*                                    Enums                                   */
/* -------------------------------------------------------------------------- */
export { JOYSTICK_STATES, SESSION_MODE } from './constants';

/* -------------------------------------------------------------------------- */
/*                                 Geometries                                 */
/* -------------------------------------------------------------------------- */
export { CurveTubeGeometry } from './addons/geometries/CurveTubeGeometry';

/* -------------------------------------------------------------------------- */
/*                                 XR Buttons                                 */
/* -------------------------------------------------------------------------- */
export { VRButtonOptions, VRButton } from './xr/VRButton';
export { ARButtonOptions, ARButton } from './xr/ARButton';
export { Player } from './xr/Player';
export { XRController } from './xr/XRController';

console.info(
	FIGLET +
		`\n\nEliXR Version (https://github.com/felixtrz/elixr): v${ELIXR_VERSION}`,
);
console.info(
	`THREE Version (https://github.com/supermedium/three.js): r${THREE_VERSION}`,
);
console.info(
	`Rapier Version (https://github.com/dimforge/rapier): v${RAPIER_VERSION()}`,
);
export { ELIXR_VERSION };
