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
export { AssetManager } from './graphics/AssetManager';

/* -------------------------------------------------------------------------- */
/*                           Entity Component System                          */
/* -------------------------------------------------------------------------- */

export { GameObject } from './ecs/GameObject';
export { GameSystem, XRGameSystem } from './ecs/GameSystem';
export { World } from './ecs/World';
export { initEngine, EngineInitOptions } from './init';

/* -------------------------------------------------------------------------- */
/*                                Gamepad Utils                               */
/* -------------------------------------------------------------------------- */
export { BUTTONS, AXES, GamepadWrapper } from 'gamepad-wrapper';

/* -------------------------------------------------------------------------- */
/*                               Physics Engine                               */
/* -------------------------------------------------------------------------- */
export { ActiveCollisionTypes } from '@dimforge/rapier3d/geometry';
export { RigidBodyType, CoefficientCombineRule } from '@dimforge/rapier3d';
export {
	CollisionDetectionMode,
	RigidBodyConstraints,
	convexHullShape,
} from './physics/PhysicsHelper';
export { Collider } from './physics/Collider';
export { BoxCollider } from './physics/colliders/BoxCollider';
export { CapsuleCollider } from './physics/colliders/CapsuleCollider';
export { ConeCollider } from './physics/colliders/ConeCollider';
export { CylinderCollider } from './physics/colliders/CylinderCollider';
export { PlaneCollider } from './physics/colliders/PlaneCollider';
export { SphereCollider } from './physics/colliders/SphereCollider';
export { Physics } from './physics/Physics';
export {
	Rigidbody,
	RigidbodyType,
	RigidbodyConstraints,
} from './physics/Rigidbody';
export { PhysicsMaterial } from './physics/Material';

/* -------------------------------------------------------------------------- */
/*                                Audio Engine                                */
/* -------------------------------------------------------------------------- */
export { AudioManager } from './audio/AudioManager';
export { AudioSource, AudioOptions } from './audio/AudioSource';

/* -------------------------------------------------------------------------- */
/*                                Locomotion                                  */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                    Enums                                   */
/* -------------------------------------------------------------------------- */
export { JOYSTICK_STATES, ASSET_TYPE, AssetDescriptor } from './constants';

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
