import { Component, ComponentSchema } from 'ecsy';

import { GameObject } from './GameObject';
import { GameSystem } from './GameSystem';

/**
 * Base class for all game components.
 * @template C - The type of the component.
 */
export class GameComponent<C> extends Component<C> {
	gameObject: GameObject;

	/**
	 * Called when the component is added to an entity.
	 */
	onAdd() {}
}

/**
 * Configuration component for game systems.
 */
export class SystemConfig extends GameComponent<any> {
	system: GameSystem;
}

/**
 * Constructor interface for game components.
 * @template C - The type of the component.
 */
export interface GameComponentConstructor<C extends GameComponent<any>> {
	schema: ComponentSchema;
	isComponent: true;
	new (props?: Partial<Omit<C, keyof GameComponent<any>>> | false): C;
}
