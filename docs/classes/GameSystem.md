[Elixr](../README.md) / GameSystem

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
- [queryAddedGameObjects](GameSystem.md#queryaddedgameobjects)
- [queryGameObjects](GameSystem.md#querygameobjects)
- [queryRemovedGameObjects](GameSystem.md#queryremovedgameobjects)
- [update](GameSystem.md#update)

## Constructors

### constructor

• **new GameSystem**(`world`, `attributes?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `world` | `World`<`Entity`\> |
| `attributes?` | `Attributes` |

#### Overrides

System.constructor

#### Defined in

[src/GameSystem.ts:9](https://github.com/felixtrz/elixr/blob/10ff080/src/GameSystem.ts#L9)

## Properties

### core

• **core**: [`Core`](Core.md)

#### Defined in

[src/GameSystem.ts:7](https://github.com/felixtrz/elixr/blob/10ff080/src/GameSystem.ts#L7)

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

[src/GameSystem.ts:14](https://github.com/felixtrz/elixr/blob/10ff080/src/GameSystem.ts#L14)

___

### queryAddedGameObjects

▸ **queryAddedGameObjects**(`queryId`): [`GameObject`](GameObject.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `queryId` | `string` |

#### Returns

[`GameObject`](GameObject.md)[]

#### Defined in

[src/GameSystem.ts:26](https://github.com/felixtrz/elixr/blob/10ff080/src/GameSystem.ts#L26)

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

[src/GameSystem.ts:18](https://github.com/felixtrz/elixr/blob/10ff080/src/GameSystem.ts#L18)

___

### queryRemovedGameObjects

▸ **queryRemovedGameObjects**(`queryId`): [`GameObject`](GameObject.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `queryId` | `string` |

#### Returns

[`GameObject`](GameObject.md)[]

#### Defined in

[src/GameSystem.ts:37](https://github.com/felixtrz/elixr/blob/10ff080/src/GameSystem.ts#L37)

___

### update

▸ **update**(`_delta`, `_time`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `_delta` | `number` |
| `_time` | `number` |

#### Returns

`void`

#### Defined in

[src/GameSystem.ts:48](https://github.com/felixtrz/elixr/blob/10ff080/src/GameSystem.ts#L48)
