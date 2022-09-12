# Class: GameComponent<C\>

## Type parameters

| Name |
| :------ |
| `C` |

## Hierarchy

- `Component`<`any`\>

  ↳ **`GameComponent`**

## Table of contents

### Constructors

- [constructor](GameComponent.md#constructor)

### Methods

- [getGameObject](GameComponent.md#getgameobject)
- [setGameObject](GameComponent.md#setgameobject)

## Constructors

### constructor

• **new GameComponent**<`C`\>(`props?`)

#### Type parameters

| Name |
| :------ |
| `C` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `props?` | ``false`` \| `Partial`<`Omit`<`C`, keyof [`GameComponent`](GameComponent.md)<`any`\>\>\> |

#### Overrides

Component&lt;any\&gt;.constructor

#### Defined in

[src/GameComponent.d.ts:5](https://github.com/felixtrz/elixr/blob/a7ea62f/src/GameComponent.d.ts#L5)

## Methods

### getGameObject

▸ **getGameObject**(): [`GameObject`](GameObject.md)

#### Returns

[`GameObject`](GameObject.md)

#### Defined in

[src/GameComponent.d.ts:7](https://github.com/felixtrz/elixr/blob/a7ea62f/src/GameComponent.d.ts#L7)

___

### setGameObject

▸ **setGameObject**(`gameObject`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `gameObject` | [`GameObject`](GameObject.md) |

#### Returns

`void`

#### Defined in

[src/GameComponent.d.ts:6](https://github.com/felixtrz/elixr/blob/a7ea62f/src/GameComponent.d.ts#L6)
