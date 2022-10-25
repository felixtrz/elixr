[Elixr](../README.md) / PhysicsComponent

# Class: PhysicsComponent

## Hierarchy

- [`GameComponent`](GameComponent.md)<`any`\>

  ↳ **`PhysicsComponent`**

## Table of contents

### Constructors

- [constructor](PhysicsComponent.md#constructor)

### Properties

- [gameObject](PhysicsComponent.md#gameobject)
- [gravity](PhysicsComponent.md#gravity)
- [solverIterations](PhysicsComponent.md#solveriterations)
- [stepTime](PhysicsComponent.md#steptime)
- [world](PhysicsComponent.md#world)

### Methods

- [onRemove](PhysicsComponent.md#onremove)

## Constructors

### constructor

• **new PhysicsComponent**(`props?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `props?` | ``false`` \| `Partial`<`Omit`<`any`, keyof `Component`<`any`\>\>\> |

#### Inherited from

[GameComponent](GameComponent.md).[constructor](GameComponent.md#constructor)

#### Defined in

node_modules/ecsy/src/Component.d.ts:19

## Properties

### gameObject

• **gameObject**: [`GameObject`](GameObject.md)

#### Inherited from

[GameComponent](GameComponent.md).[gameObject](GameComponent.md#gameobject)

#### Defined in

[src/GameComponent.ts:6](https://github.com/felixtrz/elixr/blob/10ff080/src/GameComponent.ts#L6)

___

### gravity

• **gravity**: `Vector3`

#### Defined in

[src/physics/PhysicsComponents.ts:9](https://github.com/felixtrz/elixr/blob/10ff080/src/physics/PhysicsComponents.ts#L9)

___

### solverIterations

• **solverIterations**: `number`

#### Defined in

[src/physics/PhysicsComponents.ts:10](https://github.com/felixtrz/elixr/blob/10ff080/src/physics/PhysicsComponents.ts#L10)

___

### stepTime

• **stepTime**: `number`

#### Defined in

[src/physics/PhysicsComponents.ts:11](https://github.com/felixtrz/elixr/blob/10ff080/src/physics/PhysicsComponents.ts#L11)

___

### world

• **world**: `World`

#### Defined in

[src/physics/PhysicsComponents.ts:12](https://github.com/felixtrz/elixr/blob/10ff080/src/physics/PhysicsComponents.ts#L12)

## Methods

### onRemove

▸ **onRemove**(): `void`

#### Returns

`void`

#### Inherited from

[GameComponent](GameComponent.md).[onRemove](GameComponent.md#onremove)

#### Defined in

[src/GameComponent.ts:7](https://github.com/felixtrz/elixr/blob/10ff080/src/GameComponent.ts#L7)
