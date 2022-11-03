<img alt="elixr" src="assets/images/elixr.png" width="300">

[![npm version](https://badge.fury.io/js/elixr.svg)](https://badge.fury.io/js/elixr)
[![language](https://badgen.net/badge/icon/typescript?icon=typescript&label)](https://www.typescriptlang.org/)
[![npm download](https://badgen.net/npm/dw/elixr)](https://www.npmjs.com/package/elixr)
[![license](https://badgen.net/github/license/felixtrz/elixr)](/LICENSE.md)

A WebXR framework for building the metaverse, powered by [three.js](https://threejs.org/) and [cannon-es](https://pmndrs.github.io/cannon-es/)

## Table of contents

**[Key features](#key-features)** |
**[Installation](#installation)** |
**[Usage](#usage)** |
**[API](#api)** |
**[License](#license)**

## Key features

- 🥽 **WebXR in focus**: Elixr automates the 3D and WebXR setup process, with full support for advanced features like multiview rendering and immersive-ar mode.
- 💡 **ThreeD made easy**: Built top of the popular 3D library three.js. Enjoy support from three's vast community while taking advantage of elixr's handy add-ons.
- 🍎 **Let there be physics**: Full translation layer to bind the Cannon physics engine with three's rendering, let Elixr move those Object3Ds for you.
- 🤖 **Entity-Component-System**: Elixr extends the full-featured ECS framework [ecsy](https://ecsyjs.github.io/ecsy/), implements a Unity-style ECS architecture that is powerful and flexible.

## Installation

To install and set up the library, run:

```sh
$ npm install elixr
```

Or if you prefer using Yarn:

```sh
$ yarn add elixr
```

To use without a bundler:

```html
<script src="https://unpkg.com/elixr@0.4.4/dist/elixr.min.js"></script>
```

## Usage

To import elixr and set up your new world with a cube:

```js
import { Core, CubeObject, THREE } from 'elixr';

// create a Core objects automatically sets up the base scene and the render loop
const core = new Core(document.getElementById('scene-container'));
document.body.append(core.vrButton);

const cubeObject = new CubeObject(1, 1, 1, { color: 0xffffff });
core.addGameObject(cubeObject);
cubeObject.position.set(0, 1, 2);

// add some lighting
core.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
core.scene.add(new THREE.DirectionalLight(0xffffff, 1));
```

Use ECS to add a spin behavior to that cube:

```js
import { GameComponent, GameSystem } from 'elixr';

class Spin extends GameComponent {}

class SpinSystem extends GameSystem {
	// update(delta, time) is run every frame, define the game loop behavior here
	update(delta) {
		// query game objects as defined in SpinSystem.queries
		this.queryGameObjects('cubes').forEach((cubeObject) => {
			// GameObjects extends THREE.Object3D
			cubeObject.rotateY(Math.PI * delta);
		});
	}
}

SpinSystem.queries = {
	cubes: { components: [Spin] },
};

core.registerGameComponent(Spin);
core.registerGameSystem(SpinSystem);

// GameObjects also function as entities that can be queried in systems
cubeObject.addComponent(Spin);
```

Make the world and the cube have physics:

```js
import { BODY_TYPES, Core, CubeObject, SphereObject } from 'elixr';

const core = new Core(document.getElementById('scene-container'));
document.body.append(core.vrButton);
core.physics.gravity.set(0, -9.82, 0);
core.physics.solverIterations = 5;
core.physics.stepTime = 1 / 90;

const floorObject = new CubeObject(
	100,
	0.1,
	100,
	{ color: 0xffffff },
	{ hasPhysics: true, mass: 0, type: BODY_TYPES.STATIC },
);
core.addGameObject(floorObject);

const sphereObject = new SphereObject(
	1,
	{ color: 0xfff000 },
	{ hasPhysics: true, mass: 1, type: BODY_TYPES.DYNAMIC },
);
sphereObject.position.set(0, 2, 0);
core.addGameObject(sphereObject);
```

To implement naive joystick movement:

```js
import { AXES, Vector3, XRGameSystem } from 'elixr';

const MAX_MOVEMENT_SPEED = 1;

export class JoystickMovementSystem extends XRGameSystem {
	update(delta, _time) {
		// "left" and "right" controllers are stored in core.controllers
		// they are only available after entering XR
		if (!this.core.controllers['left']) return;
		const gamepad = this.core.controllers['left'].gamepad;
		const xValue = gamepad.getAxis(AXES.XR_STANDARD.THUMBSTICK_X);
		const zValue = gamepad.getAxis(AXES.XR_STANDARD.THUMBSTICK_Y);
		// core.playerSpace is a THREE.Group that contains the camera and both controllers
		this.core.playerSpace.position.x += xValue * delta * MAX_MOVEMENT_SPEED;
		this.core.playerSpace.position.z += zValue * delta * MAX_MOVEMENT_SPEED;
	}
}
```

## API

### Entity-Component-System

- [Core](https://elixrjs.io/classes/Core.html): functions like world in most ECS implementations
- [GameObject](https://elixrjs.io/classes/GameObject.html): entity, but also extends THREE.Object3D
- [GameComponent](https://elixrjs.io/classes/GameComponent.html)
- [GameSystem](https://elixrjs.io/classes/GameSystem.html)

### Common Math Classes

- [Vector2](https://elixrjs.io/classes/Vector2.html)
- [Vector3](https://elixrjs.io/classes/Vector3.html)
- [Vector4](https://elixrjs.io/classes/Vector4.html)
- [Quaternion](https://elixrjs.io/classes/Quaternion.html)
- [Box2](https://elixrjs.io/classes/Box2.html)
- [Box3](https://elixrjs.io/classes/Box3.html)

### GameObject Prototypes

- [PhysicsObject](https://elixrjs.io/classes/PhysicsObject.html)
  - [PrimitiveObject](https://elixrjs.io/classes/PrimitiveObject.html)
    - [CubeObject](https://elixrjs.io/classes/CubeObject.html)
    - [ConeObject](https://elixrjs.io/classes/ConeObject.html)
    - [SphereObject](https://elixrjs.io/classes/SphereObject.html)
    - [CylinderObject](https://elixrjs.io/classes/CylinderObject.html)
  - [ComplexObject](https://elixrjs.io/classes/ComplexObject.html)
    - [GLTFObject](https://elixrjs.io/classes/GLTFObject.html)

### Physics Engine Bindings

- [PhysicsComponent](https://elixrjs.io/classes/PhysicsComponent.html)
- [RigidBodyComponent](https://elixrjs.io/classes/RigidBodyComponent.html)

## License

[Apache-2.0 License](/LICENSE.md) © 2022 Felix Zhang
