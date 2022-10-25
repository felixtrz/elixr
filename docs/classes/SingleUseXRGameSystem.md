[Elixr](../README.md) / SingleUseXRGameSystem

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
- [queryAddedGameObjects](SingleUseXRGameSystem.md#queryaddedgameobjects)
- [queryGameObjects](SingleUseXRGameSystem.md#querygameobjects)
- [queryRemovedGameObjects](SingleUseXRGameSystem.md#queryremovedgameobjects)
- [update](SingleUseXRGameSystem.md#update)

## Constructors

### constructor

• **new SingleUseXRGameSystem**(`world`, `attributes?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `world` | `World`<`Entity`\> |
| `attributes?` | `Attributes` |

#### Inherited from

[GameSystem](GameSystem.md).[constructor](GameSystem.md#constructor)

#### Defined in

[src/GameSystem.ts:9](https://github.com/felixtrz/elixr/blob/10ff080/src/GameSystem.ts#L9)

## Properties

### core

• **core**: [`Core`](Core.md)

#### Inherited from

[GameSystem](GameSystem.md).[core](GameSystem.md#core)

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

[GameSystem](GameSystem.md).[execute](GameSystem.md#execute)

#### Defined in

[src/GameSystem.ts:67](https://github.com/felixtrz/elixr/blob/10ff080/src/GameSystem.ts#L67)

___

### queryAddedGameObjects

▸ **queryAddedGameObjects**(`queryId`): [`GameObject`](GameObject.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `queryId` | `string` |

#### Returns

[`GameObject`](GameObject.md)[]

#### Inherited from

[GameSystem](GameSystem.md).[queryAddedGameObjects](GameSystem.md#queryaddedgameobjects)

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

#### Inherited from

[GameSystem](GameSystem.md).[queryGameObjects](GameSystem.md#querygameobjects)

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

#### Inherited from

[GameSystem](GameSystem.md).[queryRemovedGameObjects](GameSystem.md#queryremovedgameobjects)

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

#### Inherited from

[GameSystem](GameSystem.md).[update](GameSystem.md#update)

#### Defined in

[src/GameSystem.ts:48](https://github.com/felixtrz/elixr/blob/10ff080/src/GameSystem.ts#L48)
