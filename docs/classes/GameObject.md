[Elixr](../README.md) / GameObject

# Class: GameObject

## Hierarchy

- `Group`

  ↳ **`GameObject`**

## Table of contents

### Constructors

- [constructor](GameObject.md#constructor)

### Methods

- [\_init](GameObject.md#_init)
- [addComponent](GameObject.md#addcomponent)
- [duplicate](GameObject.md#duplicate)
- [getComponent](GameObject.md#getcomponent)
- [getComponentTypes](GameObject.md#getcomponenttypes)
- [getComponents](GameObject.md#getcomponents)
- [getComponentsToRemove](GameObject.md#getcomponentstoremove)
- [getMutableComponent](GameObject.md#getmutablecomponent)
- [getRemovedComponent](GameObject.md#getremovedcomponent)
- [hasAllComponents](GameObject.md#hasallcomponents)
- [hasAnyComponents](GameObject.md#hasanycomponents)
- [hasComponent](GameObject.md#hascomponent)
- [removeAllComponents](GameObject.md#removeallcomponents)
- [removeComponent](GameObject.md#removecomponent)

## Constructors

### constructor

• **new GameObject**()

#### Inherited from

THREE.Group.constructor

#### Defined in

node_modules/@types/three/src/objects/Group.d.ts:4

## Methods

### \_init

▸ **_init**(`ecsyEntity`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `ecsyEntity` | `ExtendedEntity` |

#### Returns

`void`

#### Defined in

[src/GameObject.ts:17](https://github.com/felixtrz/elixr/blob/10ff080/src/GameObject.ts#L17)

___

### addComponent

▸ **addComponent**(`GameComponent`, `values?`): [`GameComponent`](GameComponent.md)<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `GameComponent` | `GameComponentConstructor`<[`GameComponent`](GameComponent.md)<`any`\>\> |
| `values?` | `Partial`<`Omit`<[`GameComponent`](GameComponent.md)<`any`\>, keyof [`GameComponent`](GameComponent.md)<`any`\>\>\> |

#### Returns

[`GameComponent`](GameComponent.md)<`any`\>

#### Defined in

[src/GameObject.ts:30](https://github.com/felixtrz/elixr/blob/10ff080/src/GameObject.ts#L30)

___

### duplicate

▸ **duplicate**(): [`GameObject`](GameObject.md)

#### Returns

[`GameObject`](GameObject.md)

#### Defined in

[src/GameObject.ts:22](https://github.com/felixtrz/elixr/blob/10ff080/src/GameObject.ts#L22)

___

### getComponent

▸ **getComponent**(`GameComponent`, `includeRemoved?`): `Readonly`<[`GameComponent`](GameComponent.md)<`any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `GameComponent` | `GameComponentConstructor`<[`GameComponent`](GameComponent.md)<`any`\>\> |
| `includeRemoved?` | `boolean` |

#### Returns

`Readonly`<[`GameComponent`](GameComponent.md)<`any`\>\>

#### Defined in

[src/GameObject.ts:41](https://github.com/felixtrz/elixr/blob/10ff080/src/GameObject.ts#L41)

___

### getComponentTypes

▸ **getComponentTypes**(): `Component`<`any`\>[]

#### Returns

`Component`<`any`\>[]

#### Defined in

[src/GameObject.ts:56](https://github.com/felixtrz/elixr/blob/10ff080/src/GameObject.ts#L56)

___

### getComponents

▸ **getComponents**(): `Object`

#### Returns

`Object`

#### Defined in

[src/GameObject.ts:61](https://github.com/felixtrz/elixr/blob/10ff080/src/GameObject.ts#L61)

___

### getComponentsToRemove

▸ **getComponentsToRemove**(): `Object`

#### Returns

`Object`

#### Defined in

[src/GameObject.ts:66](https://github.com/felixtrz/elixr/blob/10ff080/src/GameObject.ts#L66)

___

### getMutableComponent

▸ **getMutableComponent**(`GameComponent`): [`GameComponent`](GameComponent.md)<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `GameComponent` | `GameComponentConstructor`<[`GameComponent`](GameComponent.md)<`any`\>\> |

#### Returns

[`GameComponent`](GameComponent.md)<`any`\>

#### Defined in

[src/GameObject.ts:49](https://github.com/felixtrz/elixr/blob/10ff080/src/GameObject.ts#L49)

___

### getRemovedComponent

▸ **getRemovedComponent**(`GameComponent`): `Readonly`<[`GameComponent`](GameComponent.md)<`any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `GameComponent` | `GameComponentConstructor`<[`GameComponent`](GameComponent.md)<`any`\>\> |

#### Returns

`Readonly`<[`GameComponent`](GameComponent.md)<`any`\>\>

#### Defined in

[src/GameObject.ts:71](https://github.com/felixtrz/elixr/blob/10ff080/src/GameObject.ts#L71)

___

### hasAllComponents

▸ **hasAllComponents**(`GameComponents`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `GameComponents` | `GameComponentConstructor`<`any`\>[] |

#### Returns

`boolean`

#### Defined in

[src/GameObject.ts:78](https://github.com/felixtrz/elixr/blob/10ff080/src/GameObject.ts#L78)

___

### hasAnyComponents

▸ **hasAnyComponents**(`GameComponents`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `GameComponents` | `GameComponentConstructor`<`any`\>[] |

#### Returns

`boolean`

#### Defined in

[src/GameObject.ts:83](https://github.com/felixtrz/elixr/blob/10ff080/src/GameObject.ts#L83)

___

### hasComponent

▸ **hasComponent**(`GameComponent`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `GameComponent` | `GameComponentConstructor`<`any`\> |

#### Returns

`boolean`

#### Defined in

[src/GameObject.ts:88](https://github.com/felixtrz/elixr/blob/10ff080/src/GameObject.ts#L88)

___

### removeAllComponents

▸ **removeAllComponents**(`forceImmediate`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `forceImmediate` | `boolean` |

#### Returns

`void`

#### Defined in

[src/GameObject.ts:93](https://github.com/felixtrz/elixr/blob/10ff080/src/GameObject.ts#L93)

___

### removeComponent

▸ **removeComponent**(`GameComponent`, `forceImmediate`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `GameComponent` | `GameComponentConstructor`<`any`\> |
| `forceImmediate` | `boolean` |

#### Returns

`void`

#### Defined in

[src/GameObject.ts:98](https://github.com/felixtrz/elixr/blob/10ff080/src/GameObject.ts#L98)
