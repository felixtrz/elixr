[Elixr](../README.md) / GameComponent

# Class: GameComponent<C\>

## Type parameters

| Name |
| :------ |
| `C` |

## Hierarchy

- `Component`<`C`\>

  ↳ **`GameComponent`**

  ↳↳ [`PhysicsComponent`](PhysicsComponent.md)

  ↳↳ [`RigidBodyComponent`](RigidBodyComponent.md)

## Table of contents

### Constructors

- [constructor](GameComponent.md#constructor)

### Properties

- [gameObject](GameComponent.md#gameobject)

### Methods

- [onRemove](GameComponent.md#onremove)

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
| `props?` | ``false`` \| `Partial`<`Omit`<`C`, keyof `Component`<`any`\>\>\> |

#### Inherited from

Component<C\>.constructor

#### Defined in

node_modules/ecsy/src/Component.d.ts:19

## Properties

### gameObject

• **gameObject**: [`GameObject`](GameObject.md)

#### Defined in

[src/GameComponent.ts:6](https://github.com/felixtrz/elixr/blob/10ff080/src/GameComponent.ts#L6)

## Methods

### onRemove

▸ **onRemove**(): `void`

#### Returns

`void`

#### Defined in

[src/GameComponent.ts:7](https://github.com/felixtrz/elixr/blob/10ff080/src/GameComponent.ts#L7)
