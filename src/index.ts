/* -------------------------------------------------------------------------- */
/*                                 3D Library                                 */
/* -------------------------------------------------------------------------- */
import * as THREE from 'three';

import {
	acceleratedRaycast,
	computeBoundsTree,
	disposeBoundsTree,
} from 'three-mesh-bvh';

THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;
export { THREE };

/* -------------------------------------------------------------------------- */
/*                           Entity Component System                          */
/* -------------------------------------------------------------------------- */
export { Not, Types } from 'ecsy';
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
export {
	PhysicsComponent,
	RigidBodyComponent,
} from './physics/PhysicsComponents';

/* -------------------------------------------------------------------------- */
/*                                    Math                                    */
/* -------------------------------------------------------------------------- */
export { Vector2, Vector3, Vector4 } from './math/Vectors';
export { Quaternion } from './math/Quaternion';
export { Matrix3, Matrix4 } from './math/Matrices';
export { Box2, Box3 } from './math/Boxes';
export { Color } from './math/Color';
export { Euler } from './math/Euler';
export { CurvedRaycaster } from './math/CurvedRaycaster';

/* -------------------------------------------------------------------------- */
/*                              Prototype Objects                             */
/* -------------------------------------------------------------------------- */
export { BODY_TYPES, PhysicsObject } from './objects/PhysicsObject';
export { PrimitiveObject } from './objects/PrimitiveObject';
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
	XRSnapTurnComponent,
	XRSnapTurnSystem,
} from './locomotion/XRSnapTurnSystem';
export {
	XRSmoothTurnComponent,
	XRSmoothTurnSystem,
} from './locomotion/XRSmoothTurnSystem';
export {
	XRTeleportComponent,
	XRTeleportSystem,
} from './locomotion/XRTeleportSystem';
export {
	MovementSurface,
	MovementObstacle,
} from './locomotion/MovementComponents';

/* -------------------------------------------------------------------------- */
/*                                    Enums                                   */
/* -------------------------------------------------------------------------- */
export { JOYSTICK_STATES, HANDEDNESS } from './enums';

/* -------------------------------------------------------------------------- */
/*                                 Geometries                                 */
/* -------------------------------------------------------------------------- */
export { CurveTubeGeometry } from './geometries/CurveTubeGeometry';
