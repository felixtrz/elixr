[Elixr](../README.md) / RigidBodyComponent

# Class: RigidBodyComponent

## Hierarchy

- [`GameComponent`](GameComponent.md)<`any`\>

  ↳ **`RigidBodyComponent`**

## Table of contents

### Constructors

- [constructor](RigidBodyComponent.md#constructor)

### Properties

- [\_angularVelocityUpdate](RigidBodyComponent.md#_angularvelocityupdate)
- [\_body](RigidBodyComponent.md#_body)
- [\_positionUpdate](RigidBodyComponent.md#_positionupdate)
- [\_quaternionUpdate](RigidBodyComponent.md#_quaternionupdate)
- [\_velocityUpdate](RigidBodyComponent.md#_velocityupdate)
- [angularConstraints](RigidBodyComponent.md#angularconstraints)
- [angularDamping](RigidBodyComponent.md#angulardamping)
- [collisionGroup](RigidBodyComponent.md#collisiongroup)
- [fixedRotation](RigidBodyComponent.md#fixedrotation)
- [gameObject](RigidBodyComponent.md#gameobject)
- [initVelocity](RigidBodyComponent.md#initvelocity)
- [isTrigger](RigidBodyComponent.md#istrigger)
- [linearConstraints](RigidBodyComponent.md#linearconstraints)
- [linearDamping](RigidBodyComponent.md#lineardamping)
- [mass](RigidBodyComponent.md#mass)
- [shape](RigidBodyComponent.md#shape)
- [type](RigidBodyComponent.md#type)

### Accessors

- [angularVelocity](RigidBodyComponent.md#angularvelocity)
- [position](RigidBodyComponent.md#position)
- [quaternion](RigidBodyComponent.md#quaternion)
- [velocity](RigidBodyComponent.md#velocity)

### Methods

- [copyTransformToObject3D](RigidBodyComponent.md#copytransformtoobject3d)
- [onRemove](RigidBodyComponent.md#onremove)
- [remove](RigidBodyComponent.md#remove)
- [setTransformFromObject3D](RigidBodyComponent.md#settransformfromobject3d)

## Constructors

### constructor

• **new RigidBodyComponent**(`props?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `props?` | ``false`` \| `Partial`<`Omit`<`any`, keyof `Component`<`any`\>\>\> |

#### Inherited from

[GameComponent](GameComponent.md).[constructor](GameComponent.md#constructor)

#### Defined in

node_modules/ecsy/src/Component.d.ts:19

## Properties

### \_angularVelocityUpdate

• `Optional` **\_angularVelocityUpdate**: `Vector3`

#### Defined in

[src/physics/PhysicsComponents.ts:40](https://github.com/felixtrz/elixr/blob/10ff080/src/physics/PhysicsComponents.ts#L40)

___

### \_body

• **\_body**: `Body`

#### Defined in

[src/physics/PhysicsComponents.ts:36](https://github.com/felixtrz/elixr/blob/10ff080/src/physics/PhysicsComponents.ts#L36)

___

### \_positionUpdate

• `Optional` **\_positionUpdate**: `Vector3`

#### Defined in

[src/physics/PhysicsComponents.ts:37](https://github.com/felixtrz/elixr/blob/10ff080/src/physics/PhysicsComponents.ts#L37)

___

### \_quaternionUpdate

• `Optional` **\_quaternionUpdate**: `Quaternion`

#### Defined in

[src/physics/PhysicsComponents.ts:38](https://github.com/felixtrz/elixr/blob/10ff080/src/physics/PhysicsComponents.ts#L38)

___

### \_velocityUpdate

• `Optional` **\_velocityUpdate**: `Vector3`

#### Defined in

[src/physics/PhysicsComponents.ts:39](https://github.com/felixtrz/elixr/blob/10ff080/src/physics/PhysicsComponents.ts#L39)

___

### angularConstraints

• `Optional` **angularConstraints**: `Vector3`

#### Defined in

[src/physics/PhysicsComponents.ts:29](https://github.com/felixtrz/elixr/blob/10ff080/src/physics/PhysicsComponents.ts#L29)

___

### angularDamping

• `Optional` **angularDamping**: `number`

#### Defined in

[src/physics/PhysicsComponents.ts:28](https://github.com/felixtrz/elixr/blob/10ff080/src/physics/PhysicsComponents.ts#L28)

___

### collisionGroup

• `Optional` **collisionGroup**: `number`

#### Defined in

[src/physics/PhysicsComponents.ts:32](https://github.com/felixtrz/elixr/blob/10ff080/src/physics/PhysicsComponents.ts#L32)

___

### fixedRotation

• `Optional` **fixedRotation**: `boolean`

#### Defined in

[src/physics/PhysicsComponents.ts:33](https://github.com/felixtrz/elixr/blob/10ff080/src/physics/PhysicsComponents.ts#L33)

___

### gameObject

• **gameObject**: [`GameObject`](GameObject.md)

#### Inherited from

[GameComponent](GameComponent.md).[gameObject](GameComponent.md#gameobject)

#### Defined in

[src/GameComponent.ts:6](https://github.com/felixtrz/elixr/blob/10ff080/src/GameComponent.ts#L6)

___

### initVelocity

• **initVelocity**: `Vector3`

#### Defined in

[src/physics/PhysicsComponents.ts:26](https://github.com/felixtrz/elixr/blob/10ff080/src/physics/PhysicsComponents.ts#L26)

___

### isTrigger

• `Optional` **isTrigger**: `boolean`

#### Defined in

[src/physics/PhysicsComponents.ts:34](https://github.com/felixtrz/elixr/blob/10ff080/src/physics/PhysicsComponents.ts#L34)

___

### linearConstraints

• `Optional` **linearConstraints**: `Vector3`

#### Defined in

[src/physics/PhysicsComponents.ts:31](https://github.com/felixtrz/elixr/blob/10ff080/src/physics/PhysicsComponents.ts#L31)

___

### linearDamping

• `Optional` **linearDamping**: `number`

#### Defined in

[src/physics/PhysicsComponents.ts:30](https://github.com/felixtrz/elixr/blob/10ff080/src/physics/PhysicsComponents.ts#L30)

___

### mass

• **mass**: `number`

#### Defined in

[src/physics/PhysicsComponents.ts:23](https://github.com/felixtrz/elixr/blob/10ff080/src/physics/PhysicsComponents.ts#L23)

___

### shape

• **shape**: `Shape`

#### Defined in

[src/physics/PhysicsComponents.ts:24](https://github.com/felixtrz/elixr/blob/10ff080/src/physics/PhysicsComponents.ts#L24)

___

### type

• **type**: `BodyType`

#### Defined in

[src/physics/PhysicsComponents.ts:25](https://github.com/felixtrz/elixr/blob/10ff080/src/physics/PhysicsComponents.ts#L25)

## Accessors

### angularVelocity

• `get` **angularVelocity**(): `Vector3`

#### Returns

`Vector3`

#### Defined in

[src/physics/PhysicsComponents.ts:108](https://github.com/felixtrz/elixr/blob/10ff080/src/physics/PhysicsComponents.ts#L108)

• `set` **angularVelocity**(`vec3`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `vec3` | `Vector3` |

#### Returns

`void`

#### Defined in

[src/physics/PhysicsComponents.ts:116](https://github.com/felixtrz/elixr/blob/10ff080/src/physics/PhysicsComponents.ts#L116)

___

### position

• `get` **position**(): `Vector3`

#### Returns

`Vector3`

#### Defined in

[src/physics/PhysicsComponents.ts:71](https://github.com/felixtrz/elixr/blob/10ff080/src/physics/PhysicsComponents.ts#L71)

• `set` **position**(`vec3`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `vec3` | `Vector3` |

#### Returns

`void`

#### Defined in

[src/physics/PhysicsComponents.ts:79](https://github.com/felixtrz/elixr/blob/10ff080/src/physics/PhysicsComponents.ts#L79)

___

### quaternion

• `get` **quaternion**(): `Quaternion`

#### Returns

`Quaternion`

#### Defined in

[src/physics/PhysicsComponents.ts:83](https://github.com/felixtrz/elixr/blob/10ff080/src/physics/PhysicsComponents.ts#L83)

• `set` **quaternion**(`quat`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `quat` | `Quaternion` |

#### Returns

`void`

#### Defined in

[src/physics/PhysicsComponents.ts:92](https://github.com/felixtrz/elixr/blob/10ff080/src/physics/PhysicsComponents.ts#L92)

___

### velocity

• `get` **velocity**(): `Vector3`

#### Returns

`Vector3`

#### Defined in

[src/physics/PhysicsComponents.ts:96](https://github.com/felixtrz/elixr/blob/10ff080/src/physics/PhysicsComponents.ts#L96)

• `set` **velocity**(`vec3`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `vec3` | `Vector3` |

#### Returns

`void`

#### Defined in

[src/physics/PhysicsComponents.ts:104](https://github.com/felixtrz/elixr/blob/10ff080/src/physics/PhysicsComponents.ts#L104)

## Methods

### copyTransformToObject3D

▸ **copyTransformToObject3D**(`object3D`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `object3D` | `Object3D`<`Event`\> |

#### Returns

`void`

#### Defined in

[src/physics/PhysicsComponents.ts:42](https://github.com/felixtrz/elixr/blob/10ff080/src/physics/PhysicsComponents.ts#L42)

___

### onRemove

▸ **onRemove**(): `void`

#### Returns

`void`

#### Overrides

[GameComponent](GameComponent.md).[onRemove](GameComponent.md#onremove)

#### Defined in

[src/physics/PhysicsComponents.ts:120](https://github.com/felixtrz/elixr/blob/10ff080/src/physics/PhysicsComponents.ts#L120)

___

### remove

▸ **remove**(): `void`

#### Returns

`void`

#### Defined in

[src/physics/PhysicsComponents.ts:67](https://github.com/felixtrz/elixr/blob/10ff080/src/physics/PhysicsComponents.ts#L67)

___

### setTransformFromObject3D

▸ **setTransformFromObject3D**(`object3D`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `object3D` | `Object3D`<`Event`\> |

#### Returns

`void`

#### Defined in

[src/physics/PhysicsComponents.ts:60](https://github.com/felixtrz/elixr/blob/10ff080/src/physics/PhysicsComponents.ts#L60)
