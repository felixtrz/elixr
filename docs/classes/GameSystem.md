# Class: GameSystem

## Hierarchy

- `System`

  ↳ **`GameSystem`**

  ↳↳ [`XRGameSystem`](XRGameSystem.md)

  ↳↳ [`SingleUseGameSystem`](SingleUseGameSystem.md)

  ↳↳ [`SingleUseXRGameSystem`](SingleUseXRGameSystem.md)

## Table of contents

### Constructors

- [constructor](GameSystem.md#constructor)

### Properties

- [core](GameSystem.md#core)

### Methods

- [execute](GameSystem.md#execute)
- [queryGameObjects](GameSystem.md#querygameobjects)
- [update](GameSystem.md#update)

## Constructors

### constructor

• **new GameSystem**(`world`, `attributes`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `world` | `World`<`Entity`\> |
| `attributes` | `Attributes` |

#### Overrides

System.constructor

#### Defined in

[src/GameSystem.d.ts:6](https://github.com/felixtrz/elixr/blob/a7ea62f/src/GameSystem.d.ts#L6)

## Properties

### core

• **core**: [`Core`](Core.md)

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

#### Overrides

System.execute

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

#### Defined in

[src/GameSystem.d.ts:9](https://github.com/felixtrz/elixr/blob/a7ea62f/src/GameSystem.d.ts#L9)
