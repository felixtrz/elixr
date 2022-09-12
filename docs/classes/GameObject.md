# Class: GameObject

## Hierarchy

- `Group`

  ↳ **`GameObject`**

## Table of contents

### Constructors

- [constructor](GameObject.md#constructor)

### Methods

- [addComponent](GameObject.md#addcomponent)
- [destroy](GameObject.md#destroy)
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

### addComponent

▸ **addComponent**<`C`\>(`GameComponent`, `values?`): `C`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `C` | extends `Component`<`any`, `C`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `GameComponent` | `ComponentConstructor`<`C`\> |
| `values?` | `Partial`<`Omit`<`C`, keyof `Component`<`any`\>\>\> |

#### Returns

`C`

#### Defined in

[src/GameObject.d.ts:9](https://github.com/felixtrz/elixr/blob/a7ea62f/src/GameObject.d.ts#L9)

___

### destroy

▸ **destroy**(): `void`

#### Returns

`void`

#### Defined in

[src/GameObject.d.ts:5](https://github.com/felixtrz/elixr/blob/a7ea62f/src/GameObject.d.ts#L5)

___

### duplicate

▸ **duplicate**(): [`GameObject`](GameObject.md)

#### Returns

[`GameObject`](GameObject.md)

#### Defined in

[src/GameObject.d.ts:7](https://github.com/felixtrz/elixr/blob/a7ea62f/src/GameObject.d.ts#L7)

___

### getComponent

▸ **getComponent**<`C`\>(`GameComponent`): `Readonly`<`C`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `C` | extends `Component`<`any`, `C`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `GameComponent` | `ComponentConstructor`<`C`\> |

#### Returns

`Readonly`<`C`\>

#### Defined in

[src/GameObject.d.ts:14](https://github.com/felixtrz/elixr/blob/a7ea62f/src/GameObject.d.ts#L14)

___

### getComponentTypes

▸ **getComponentTypes**(): `Component`<`any`\>[]

#### Returns

`Component`<`any`\>[]

#### Defined in

[src/GameObject.d.ts:22](https://github.com/felixtrz/elixr/blob/a7ea62f/src/GameObject.d.ts#L22)

___

### getComponents

▸ **getComponents**(): `Object`

#### Returns

`Object`

#### Defined in

[src/GameObject.d.ts:24](https://github.com/felixtrz/elixr/blob/a7ea62f/src/GameObject.d.ts#L24)

___

### getComponentsToRemove

▸ **getComponentsToRemove**(): `Object`

#### Returns

`Object`

#### Defined in

[src/GameObject.d.ts:26](https://github.com/felixtrz/elixr/blob/a7ea62f/src/GameObject.d.ts#L26)

___

### getMutableComponent

▸ **getMutableComponent**<`C`\>(`GameComponent`): `C`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `C` | extends `Component`<`any`, `C`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `GameComponent` | `ComponentConstructor`<`C`\> |

#### Returns

`C`

#### Defined in

[src/GameObject.d.ts:18](https://github.com/felixtrz/elixr/blob/a7ea62f/src/GameObject.d.ts#L18)

___

### getRemovedComponent

▸ **getRemovedComponent**<`C`\>(`GameComponent`): `Readonly`<`C`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `C` | extends `Component`<`any`, `C`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `GameComponent` | `ComponentConstructor`<`C`\> |

#### Returns

`Readonly`<`C`\>

#### Defined in

[src/GameObject.d.ts:28](https://github.com/felixtrz/elixr/blob/a7ea62f/src/GameObject.d.ts#L28)

___

### hasAllComponents

▸ **hasAllComponents**(`GameComponents`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `GameComponents` | `ComponentConstructor`<`any`\>[] |

#### Returns

`boolean`

#### Defined in

[src/GameObject.d.ts:32](https://github.com/felixtrz/elixr/blob/a7ea62f/src/GameObject.d.ts#L32)

___

### hasAnyComponents

▸ **hasAnyComponents**(`GameComponents`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `GameComponents` | `ComponentConstructor`<`any`\>[] |

#### Returns

`boolean`

#### Defined in

[src/GameObject.d.ts:34](https://github.com/felixtrz/elixr/blob/a7ea62f/src/GameObject.d.ts#L34)

___

### hasComponent

▸ **hasComponent**<`C`\>(`GameComponent`): `boolean`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `C` | extends `Component`<`any`, `C`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `GameComponent` | `ComponentConstructor`<`C`\> |

#### Returns

`boolean`

#### Defined in

[src/GameObject.d.ts:36](https://github.com/felixtrz/elixr/blob/a7ea62f/src/GameObject.d.ts#L36)

___

### removeAllComponents

▸ **removeAllComponents**(`forceImmediate?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `forceImmediate?` | `boolean` |

#### Returns

`void`

#### Defined in

[src/GameObject.d.ts:40](https://github.com/felixtrz/elixr/blob/a7ea62f/src/GameObject.d.ts#L40)

___

### removeComponent

▸ **removeComponent**<`C`\>(`GameComponent`, `forceImmediate?`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `C` | extends `Component`<`any`, `C`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `GameComponent` | `ComponentConstructor`<`C`\> |
| `forceImmediate?` | `boolean` |

#### Returns

`void`

#### Defined in

[src/GameObject.d.ts:42](https://github.com/felixtrz/elixr/blob/a7ea62f/src/GameObject.d.ts#L42)
