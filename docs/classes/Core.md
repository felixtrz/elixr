[Elixr](../README.md) / Core

# Class: Core

## Table of contents

### Constructors

- [constructor](Core.md#constructor)

### Properties

- [arButton](Core.md#arbutton)
- [camera](Core.md#camera)
- [controllers](Core.md#controllers)
- [game](Core.md#game)
- [playerSpace](Core.md#playerspace)
- [renderer](Core.md#renderer)
- [scene](Core.md#scene)
- [vrButton](Core.md#vrbutton)

### Accessors

- [physics](Core.md#physics)

### Methods

- [createEmptyGameObject](Core.md#createemptygameobject)
- [createGameObject](Core.md#creategameobject)
- [enablePhysics](Core.md#enablephysics)
- [getGameSystem](Core.md#getgamesystem)
- [getGameSystems](Core.md#getgamesystems)
- [hasRegisteredGameComponent](Core.md#hasregisteredgamecomponent)
- [isImmersive](Core.md#isimmersive)
- [play](Core.md#play)
- [registerGameComponent](Core.md#registergamecomponent)
- [registerGameSystem](Core.md#registergamesystem)
- [stop](Core.md#stop)
- [unregisterGameSystem](Core.md#unregistergamesystem)

## Constructors

### constructor

• **new Core**(`sceneContainer`, `ecsyOptions?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `sceneContainer` | `HTMLElement` |
| `ecsyOptions` | `WorldOptions` |

#### Defined in

[src/Core.ts:40](https://github.com/felixtrz/elixr/blob/10ff080/src/Core.ts#L40)

## Properties

### arButton

• **arButton**: `HTMLElement`

#### Defined in

[src/Core.ts:37](https://github.com/felixtrz/elixr/blob/10ff080/src/Core.ts#L37)

___

### camera

• **camera**: `PerspectiveCamera`

#### Defined in

[src/Core.ts:26](https://github.com/felixtrz/elixr/blob/10ff080/src/Core.ts#L26)

___

### controllers

• **controllers**: `Object`

#### Index signature

▪ [handedness: `string`]: { `gamepad`: `GamepadWrapper` ; `gripSpace`: `THREE.Object3D` ; `model`: `THREE.Object3D` ; `targetRaySpace`: `THREE.Object3D`  }

#### Defined in

[src/Core.ts:27](https://github.com/felixtrz/elixr/blob/10ff080/src/Core.ts#L27)

___

### game

• **game**: [`GameObject`](GameObject.md)

#### Defined in

[src/Core.ts:38](https://github.com/felixtrz/elixr/blob/10ff080/src/Core.ts#L38)

___

### playerSpace

• **playerSpace**: `Group`

#### Defined in

[src/Core.ts:35](https://github.com/felixtrz/elixr/blob/10ff080/src/Core.ts#L35)

___

### renderer

• **renderer**: `WebGLRenderer`

#### Defined in

[src/Core.ts:25](https://github.com/felixtrz/elixr/blob/10ff080/src/Core.ts#L25)

___

### scene

• **scene**: `Scene`

#### Defined in

[src/Core.ts:24](https://github.com/felixtrz/elixr/blob/10ff080/src/Core.ts#L24)

___

### vrButton

• **vrButton**: `HTMLElement`

#### Defined in

[src/Core.ts:36](https://github.com/felixtrz/elixr/blob/10ff080/src/Core.ts#L36)

## Accessors

### physics

• `get` **physics**(): [`PhysicsComponent`](PhysicsComponent.md)

#### Returns

[`PhysicsComponent`](PhysicsComponent.md)

#### Defined in

[src/Core.ts:145](https://github.com/felixtrz/elixr/blob/10ff080/src/Core.ts#L145)

## Methods

### createEmptyGameObject

▸ **createEmptyGameObject**(): [`GameObject`](GameObject.md)

#### Returns

[`GameObject`](GameObject.md)

#### Defined in

[src/Core.ts:177](https://github.com/felixtrz/elixr/blob/10ff080/src/Core.ts#L177)

___

### createGameObject

▸ **createGameObject**(`object3D`): [`GameObject`](GameObject.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `object3D` | `Object3D`<`Event`\> |

#### Returns

[`GameObject`](GameObject.md)

#### Defined in

[src/Core.ts:184](https://github.com/felixtrz/elixr/blob/10ff080/src/Core.ts#L184)

___

### enablePhysics

▸ **enablePhysics**(): `void`

#### Returns

`void`

#### Defined in

[src/Core.ts:208](https://github.com/felixtrz/elixr/blob/10ff080/src/Core.ts#L208)

___

### getGameSystem

▸ **getGameSystem**(`GameSystem`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `GameSystem` | `GameSystemConstructor`<`any`\> |

#### Returns

`any`

#### Defined in

[src/Core.ts:157](https://github.com/felixtrz/elixr/blob/10ff080/src/Core.ts#L157)

___

### getGameSystems

▸ **getGameSystems**(): `System`<`Entity`\>[]

#### Returns

`System`<`Entity`\>[]

#### Defined in

[src/Core.ts:161](https://github.com/felixtrz/elixr/blob/10ff080/src/Core.ts#L161)

___

### hasRegisteredGameComponent

▸ **hasRegisteredGameComponent**(`GameComponent`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `GameComponent` | `GameComponentConstructor`<`any`\> |

#### Returns

`boolean`

#### Defined in

[src/Core.ts:169](https://github.com/felixtrz/elixr/blob/10ff080/src/Core.ts#L169)

___

### isImmersive

▸ **isImmersive**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/Core.ts:149](https://github.com/felixtrz/elixr/blob/10ff080/src/Core.ts#L149)

___

### play

▸ **play**(): `void`

#### Returns

`void`

#### Defined in

[src/Core.ts:200](https://github.com/felixtrz/elixr/blob/10ff080/src/Core.ts#L200)

___

### registerGameComponent

▸ **registerGameComponent**(`GameComponent`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `GameComponent` | `GameComponentConstructor`<`any`\> |

#### Returns

`void`

#### Defined in

[src/Core.ts:165](https://github.com/felixtrz/elixr/blob/10ff080/src/Core.ts#L165)

___

### registerGameSystem

▸ **registerGameSystem**(`GameSystem`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `GameSystem` | `GameSystemConstructor`<`any`\> |

#### Returns

`void`

#### Defined in

[src/Core.ts:153](https://github.com/felixtrz/elixr/blob/10ff080/src/Core.ts#L153)

___

### stop

▸ **stop**(): `void`

#### Returns

`void`

#### Defined in

[src/Core.ts:204](https://github.com/felixtrz/elixr/blob/10ff080/src/Core.ts#L204)

___

### unregisterGameSystem

▸ **unregisterGameSystem**(`GameSystem`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `GameSystem` | `GameSystemConstructor`<`any`\> |

#### Returns

`void`

#### Defined in

[src/Core.ts:173](https://github.com/felixtrz/elixr/blob/10ff080/src/Core.ts#L173)
