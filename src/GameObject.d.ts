import type { Component, ComponentConstructor } from 'ecsy';
import type * as THREE from 'three';

export class GameObject extends THREE.Group {
	destroy(): void;

	duplicate(): GameObject;

	addComponent<C extends Component<any>>(
		GameComponent: ComponentConstructor<C>,
		values?: Partial<Omit<C, keyof Component<any>>>,
	): C;

	getComponent<C extends Component<any>>(
		GameComponent: ComponentConstructor<C>,
	): Readonly<C> | undefined;

	getMutableComponent<C extends Component<any>>(
		GameComponent: ComponentConstructor<C>,
	): C | undefined;

	getComponentTypes(): Array<Component<any>>;

	getComponents(): { [componentName: string]: Component<any> };

	getComponentsToRemove(): { [componentName: string]: Component<any> };

	getRemovedComponent<C extends Component<any>>(
		GameComponent: ComponentConstructor<C>,
	): Readonly<C> | undefined;

	hasAllComponents(GameComponents: Array<ComponentConstructor<any>>): boolean;

	hasAnyComponents(GameComponents: Array<ComponentConstructor<any>>): boolean;

	hasComponent<C extends Component<any>>(
		GameComponent: ComponentConstructor<C>,
	): boolean;

	removeAllComponents(forceImmediate?: boolean): void;

	removeComponent<C extends Component<any>>(
		GameComponent: ComponentConstructor<C>,
		forceImmediate?: boolean,
	): void;
}
