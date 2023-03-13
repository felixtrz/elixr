<img alt="elixr" src="assets/images/elixr.png" width="400">

[![npm version](https://badge.fury.io/js/elixr.svg)](https://badge.fury.io/js/elixr)
[![language](https://badgen.net/badge/icon/typescript?icon=typescript&label)](https://www.typescriptlang.org/)
[![npm download](https://badgen.net/npm/dw/elixr)](https://www.npmjs.com/package/elixr)
[![license](https://badgen.net/github/license/felixtrz/elixr)](/LICENSE.md)

Elixr is a lightweight and flexible framework for building WebXR experiences. Built on top of the popular [three.js](https://threejs.org/) library and integrated with the highly performant [Rapier](https://rapier.rs/) physics engine, Elixr aims to provide an easy-to-use and customizable solution for creating XR experiences on the web.

## Table of contents

**[Key features](#key-features)** |
**[Installation](#installation)** |
**[Usage](#usage)** |
**[API](#api)** |
**[License](#license)**

## Key features

- 🚀 **Easy-to-use WebXR scene setup**: Intuitive APIs for setting up WebXR scenes.
- 🎮 **Powerful ECS architecture**: Efficient game logic with a flexible entity-component system.
- 🏗️ **Rapier physics integration**: Realistic physics simulations with the highly performant Rapier physics engine.
- 🕹️ **Pre-built, customizable interaction systems**: Easily add pre-built interaction systems like snap-turn and teleportation.
- 🌐 **Compatibility with three.js plugins**: Build on top of an established three.js ecosystem with compatibility for plugins.

## Installation

To install and set up the library, run:

```sh
$ npm install elixr
```

Or if you prefer using Yarn:

```sh
$ yarn add elixr
```

## Usage

To import elixr and set up your new world with a cube:

```js
import { Core, GameObject, PrimitiveType, THREE, VRButton } from 'elixr';

// create a Core objects automatically sets up the base scene and the render loop
Core.init(document.getElementById('scene-container')).then((core) => {
	const cubeObject = new GameObject();
	cubeObject.addComponent(MeshRenderer, {
		meshRef: new THREE.Mesh(
			new THREE.BoxGeometry(1, 1, 1),
			new THREE.MeshStandardMaterial({ color: 0xff0000 }),
		),
	});
	cubeObject.position.set(0, 1, -2);

	// add some lighting
	core.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
	core.scene.add(new THREE.DirectionalLight(0xffffff, 1));

	// convert a button to the Enter VR button
	const vrButton = document.getElementById('vr-button');
	VRButton.convertToVRButton(vrButton, core.renderer);
});
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
import { Core, GameObject, PrimitiveType, THREE, VRButton } from 'elixr';

// set gravity
core.physics.gravity.set(0, -9.8, 0);

// primitive objects come with rigidbodies and colliders
const cubeObject = GameObject.createPrimitive(PrimitiveType.Cube);
cubeObject.position.set(0, 10, -2);
const floor = GameObject.createPrimitive(PrimitiveType.Plane);
floor.position.set(0, 0, 0);
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

Please refer to [elixrjs.io](https://elixrjs.io) for full API documentation.

## License

[Apache-2.0 License](/LICENSE.md) © 2023 Felix Zhang
