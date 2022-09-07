import type { Component, ComponentSchema } from 'ecsy';
import type { GameObject } from './GameObject';

export class GameComponent<C> extends Component<any> {
	constructor(props?: Partial<Omit<C, keyof GameComponent<any>>> | false);
	setGameObject(gameObject: GameObject): void;
	getGameObject(): GameObject;
}

export interface GameComponentConstructor<C extends GameComponent<C>> {
	schema: ComponentSchema;
	isComponent: true;
	new (props?: Partial<Omit<C, keyof GameComponent<any>>> | false): C;
}
