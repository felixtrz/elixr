[Elixr](../README.md) / XRGameSystem

# Class: XRGameSystem

## Hierarchy

- [`GameSystem`](GameSystem.md)

  ↳ **`XRGameSystem`**

## Table of contents

### Constructors

- [constructor](XRGameSystem.md#constructor)

### Properties

- [core](XRGameSystem.md#core)

### Methods

- [execute](XRGameSystem.md#execute)
- [queryAddedGameObjects](XRGameSystem.md#queryaddedgameobjects)
- [queryGameObjects](XRGameSystem.md#querygameobjects)
- [queryRemovedGameObjects](XRGameSystem.md#queryremovedgameobjects)
- [update](XRGameSystem.md#update)

## Constructors

### constructor

• **new XRGameSystem**(`world`, `attributes?`)

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

[src/GameSystem.ts:52](https://github.com/felixtrz/elixr/blob/10ff080/src/GameSystem.ts#L52)

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
