import { Component, ComponentSchema } from 'ecsy';

import { GameObject } from './GameObject';

export class GameComponent<C> extends Component<C> {
	gameObject: GameObject;
	onRemove() {}
}

export interface GameComponentConstructor<C extends GameComponent<any>> {
	schema: ComponentSchema;
	isComponent: true;
	new (props?: Partial<Omit<C, keyof GameComponent<any>>> | false): C;
}
