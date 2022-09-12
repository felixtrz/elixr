# Class: Core

## Table of contents

### Constructors

- [constructor](Core.md#constructor)

### Accessors

- [camera](Core.md#camera)
- [controllers](Core.md#controllers)
- [isImmersive](Core.md#isimmersive)
- [playerSpace](Core.md#playerspace)
- [renderer](Core.md#renderer)
- [scene](Core.md#scene)

### Methods

- [createEmptyGameObject](Core.md#createemptygameobject)
- [createGameObject](Core.md#creategameobject)
- [getGameSystem](Core.md#getgamesystem)
- [getGameSystems](Core.md#getgamesystems)
- [hasRegisteredGameComponent](Core.md#hasregisteredgamecomponent)
- [play](Core.md#play)
- [registerGameComponent](Core.md#registergamecomponent)
- [registerGameSystem](Core.md#registergamesystem)
- [stop](Core.md#stop)
- [unregisterGameSystem](Core.md#unregistergamesystem)

## Constructors

### constructor

• **new Core**(`sceneContainer`, `ecsyOptions`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `sceneContainer` | `HTMLElement` |
| `ecsyOptions` | `WorldOptions` |

#### Defined in

[src/Core.d.ts:10](https://github.com/felixtrz/elixr/blob/a7ea62f/src/Core.d.ts#L10)

## Accessors

### camera

• `get` **camera**(): `Camera`

#### Returns

`Camera`

#### Defined in

[src/Core.d.ts:16](https://github.com/felixtrz/elixr/blob/a7ea62f/src/Core.d.ts#L16)

___

### controllers

• `get` **controllers**(): `Object`

#### Returns

`Object`

#### Defined in

[src/Core.d.ts:20](https://github.com/felixtrz/elixr/blob/a7ea62f/src/Core.d.ts#L20)

___

### isImmersive

• `get` **isImmersive**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/Core.d.ts:28](https://github.com/felixtrz/elixr/blob/a7ea62f/src/Core.d.ts#L28)

___

### playerSpace

• `get` **playerSpace**(): `Group`

#### Returns

`Group`

#### Defined in

[src/Core.d.ts:18](https://github.com/felixtrz/elixr/blob/a7ea62f/src/Core.d.ts#L18)

___

### renderer

• `get` **renderer**(): `WebGLRenderer`

#### Returns

`WebGLRenderer`

#### Defined in

[src/Core.d.ts:14](https://github.com/felixtrz/elixr/blob/a7ea62f/src/Core.d.ts#L14)

___

### scene

• `get` **scene**(): `Scene`

#### Returns

`Scene`

#### Defined in

[src/Core.d.ts:12](https://github.com/felixtrz/elixr/blob/a7ea62f/src/Core.d.ts#L12)

## Methods

### createEmptyGameObject

▸ **createEmptyGameObject**(): [`GameObject`](GameObject.md)

#### Returns

[`GameObject`](GameObject.md)

#### Defined in

[src/Core.d.ts:52](https://github.com/felixtrz/elixr/blob/a7ea62f/src/Core.d.ts#L52)

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

[src/Core.d.ts:54](https://github.com/felixtrz/elixr/blob/a7ea62f/src/Core.d.ts#L54)

___

### getGameSystem

▸ **getGameSystem**<`T`\>(`GameSystem`): [`GameSystem`](GameSystem.md)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`GameSystem`](GameSystem.md)<`T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `GameSystem` | `SystemConstructor`<`T`\> |

#### Returns

[`GameSystem`](GameSystem.md)

#### Defined in

[src/Core.d.ts:34](https://github.com/felixtrz/elixr/blob/a7ea62f/src/Core.d.ts#L34)

___

### getGameSystems

▸ **getGameSystems**(): [`GameSystem`](GameSystem.md)[]

#### Returns

[`GameSystem`](GameSystem.md)[]

#### Defined in

[src/Core.d.ts:38](https://github.com/felixtrz/elixr/blob/a7ea62f/src/Core.d.ts#L38)

___

### hasRegisteredGameComponent

▸ **hasRegisteredGameComponent**<`C`\>(`GameComponent`): `boolean`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `C` | extends [`GameComponent`](GameComponent.md)<`any`, `C`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `GameComponent` | `GameComponentConstructor`<`C`\> |

#### Returns

`boolean`

#### Defined in

[src/Core.d.ts:44](https://github.com/felixtrz/elixr/blob/a7ea62f/src/Core.d.ts#L44)

___

### play

▸ **play**(): `void`

#### Returns

`void`

#### Defined in

[src/Core.d.ts:56](https://github.com/felixtrz/elixr/blob/a7ea62f/src/Core.d.ts#L56)

___

### registerGameComponent

▸ **registerGameComponent**<`C`\>(`GameComponent`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `C` | extends [`GameComponent`](GameComponent.md)<`any`, `C`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `GameComponent` | `GameComponentConstructor`<`C`\> |

#### Returns

`void`

#### Defined in

[src/Core.d.ts:40](https://github.com/felixtrz/elixr/blob/a7ea62f/src/Core.d.ts#L40)

___

### registerGameSystem

▸ **registerGameSystem**<`T`\>(`GameSystem`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`GameSystem`](GameSystem.md)<`T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `GameSystem` | `SystemConstructor`<`T`\> |

#### Returns

`void`

#### Defined in

[src/Core.d.ts:30](https://github.com/felixtrz/elixr/blob/a7ea62f/src/Core.d.ts#L30)

___

### stop

▸ **stop**(): `void`

#### Returns

`void`

#### Defined in

[src/Core.d.ts:58](https://github.com/felixtrz/elixr/blob/a7ea62f/src/Core.d.ts#L58)

___

### unregisterGameSystem

▸ **unregisterGameSystem**<`T`\>(`GameSystem`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`GameSystem`](GameSystem.md)<`T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `GameSystem` | `SystemConstructor`<`T`\> |

#### Returns

`void`

#### Defined in

[src/Core.d.ts:48](https://github.com/felixtrz/elixr/blob/a7ea62f/src/Core.d.ts#L48)
