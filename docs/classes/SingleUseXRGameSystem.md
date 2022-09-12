# Class: SingleUseXRGameSystem

## Hierarchy

- [`GameSystem`](GameSystem.md)

  ↳ **`SingleUseXRGameSystem`**

## Table of contents

### Constructors

- [constructor](SingleUseXRGameSystem.md#constructor)

### Properties

- [core](SingleUseXRGameSystem.md#core)

### Methods

- [execute](SingleUseXRGameSystem.md#execute)
- [queryGameObjects](SingleUseXRGameSystem.md#querygameobjects)
- [update](SingleUseXRGameSystem.md#update)

## Constructors

### constructor

• **new SingleUseXRGameSystem**(`world`, `attributes`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `world` | `World`<`Entity`\> |
| `attributes` | `Attributes` |

#### Inherited from

[GameSystem](GameSystem.md).[constructor](GameSystem.md#constructor)

#### Defined in

[src/GameSystem.d.ts:6](https://github.com/felixtrz/elixr/blob/a7ea62f/src/GameSystem.d.ts#L6)

## Properties

### core

• **core**: [`Core`](Core.md)

#### Inherited from

[GameSystem](GameSystem.md).[core](GameSystem.md#core)

#### Defined in

[src/GameSystem.d.ts:7](https://github.com/felixtrz/elixr/blob/a7ea62f/src/GameSystem.d.ts#L7)

## Methods

### execute

▸ **execute**(`delta`, `time`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `delta` | `number` |
| `time` | `number` |

#### Returns

`void`

#### Inherited from

[GameSystem](GameSystem.md).[execute](GameSystem.md#execute)

#### Defined in

[src/GameSystem.d.ts:8](https://github.com/felixtrz/elixr/blob/a7ea62f/src/GameSystem.d.ts#L8)

___

### queryGameObjects

▸ **queryGameObjects**(`queryId`): [`GameObject`](GameObject.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `queryId` | `string` |

#### Returns

[`GameObject`](GameObject.md)[]

#### Inherited from

[GameSystem](GameSystem.md).[queryGameObjects](GameSystem.md#querygameobjects)

#### Defined in

[src/GameSystem.d.ts:10](https://github.com/felixtrz/elixr/blob/a7ea62f/src/GameSystem.d.ts#L10)

___

### update

▸ **update**(`delta`, `time`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `delta` | `number` |
| `time` | `number` |

#### Returns

`void`

#### Inherited from

[GameSystem](GameSystem.md).[update](GameSystem.md#update)

#### Defined in

[src/GameSystem.d.ts:9](https://github.com/felixtrz/elixr/blob/a7ea62f/src/GameSystem.d.ts#L9)
