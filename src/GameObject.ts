import { GameComponent, GameComponentConstructor } from './GameComponent';

import { Entity } from 'ecsy';
import { THREE } from './three/CustomTHREE';

export type ExtendedEntity = Entity & {
	gameObject: GameObject;
};

/**
 * This class extends THREE.Object3D
 *
 * @see https://threejs.org/docs/#api/en/core/Object3D
 */
export class GameObject extends THREE.Object3D {
	private static UNINITIALIZED_GAMEOBJECT_ERROR =
		'Cannot perform action on uninitialized GameObject';

	private _ecsyEntity: ExtendedEntity;
	private _componentsToAdd: {
		constructor: GameComponentConstructor<GameComponent<any>>;
		values: Partial<Omit<GameComponent<any>, keyof GameComponent<any>>>;
	}[] = [];
	isGameObject: boolean = true;

	_init(ecsyEntity: ExtendedEntity): void {
		this._ecsyEntity = ecsyEntity;
		this._ecsyEntity.gameObject = this;
		this._componentsToAdd.forEach((component) => {
			this._ecsyEntity.addComponent(component.constructor, component.values);
		});
		this._componentsToAdd = null;
	}

	/** Boolean value indicating whether the GameObject has been added to Core. */
	get isInitialized() {
		return this._ecsyEntity != null;
	}

	copy(_source: this, _recursive?: boolean): this {
		throw new Error('GameObject.copy() is not permitted');
	}

	clone(_recursive?: boolean): this {
		throw new Error('GameObject.clone() is not permitted');
	}

	/** Copy all components from the given GameObject. */
	copyAllComponentsFrom(gameObject: GameObject) {
		const components = gameObject.getComponents();

		if (!this.isInitialized) {
			this._componentsToAdd = [];
		} else {
			this.removeAllComponents(true);
		}

		for (const component of Object.values(components)) {
			const constructor =
				component.constructor as GameComponentConstructor<any>;
			const values = {};
			for (const key of Object.keys(constructor.schema)) {
				// @ts-ignore
				values[key] = component[key];
			}
			if (!this.isInitialized) {
				this._componentsToAdd.push({ constructor, values });
			} else {
				this._ecsyEntity.addComponent(constructor, values);
				const newComponent = this.getMutableComponent(constructor);
				newComponent.gameObject = this;
			}
		}
	}

	/** Add a {@link GameComponent} to the entity. */
	addComponent(
		GameComponent: GameComponentConstructor<GameComponent<any>>,
		values?: Partial<Omit<GameComponent<any>, keyof GameComponent<any>>>,
	) {
		if (!this.isInitialized) {
			this._componentsToAdd.push({
				constructor: GameComponent,
				values: values,
			});
		} else {
			this._ecsyEntity.addComponent(GameComponent, values);
			const newComponent = this.getMutableComponent(GameComponent);
			newComponent.gameObject = this;
		}
	}

	/** Get an immutable reference to a {@link GameComponent} on this entity. */
	getComponent(
		GameComponent: GameComponentConstructor<GameComponent<any>>,
		includeRemoved?: boolean,
	): Readonly<GameComponent<any>> {
		if (!this.isInitialized) throw GameObject.UNINITIALIZED_GAMEOBJECT_ERROR;
		return this._ecsyEntity.getComponent(GameComponent, includeRemoved);
	}

	/** Get an mutable reference to a {@link GameComponent} on this entity. */
	getMutableComponent(
		GameComponent: GameComponentConstructor<GameComponent<any>>,
	): GameComponent<any> {
		if (!this.isInitialized) throw GameObject.UNINITIALIZED_GAMEOBJECT_ERROR;
		return this._ecsyEntity.getMutableComponent(GameComponent);
	}

	/**
	 * Get a list of {@link GameComponent} types that have been added to this
	 * entity.
	 */
	getComponentTypes() {
		if (!this.isInitialized) throw GameObject.UNINITIALIZED_GAMEOBJECT_ERROR;
		return this._ecsyEntity.getComponentTypes();
	}

	/**
	 * Get an object containing all the {@link GameComponent} on this entity, where
	 * the object keys are the component types.
	 */
	getComponents() {
		if (!this.isInitialized) throw GameObject.UNINITIALIZED_GAMEOBJECT_ERROR;
		return this._ecsyEntity.getComponents();
	}

	/**
	 * Get an object containing all the {@link GameComponent} that are slated to be
	 * removed from this entity, where the object keys are the component types.
	 */
	getComponentsToRemove() {
		if (!this.isInitialized) throw GameObject.UNINITIALIZED_GAMEOBJECT_ERROR;
		return this._ecsyEntity.getComponentsToRemove();
	}

	/** Get a {@link GameComponent} that is slated to be removed from this entity. */
	getRemovedComponent(
		GameComponent: GameComponentConstructor<GameComponent<any>>,
	): Readonly<GameComponent<any>> {
		if (!this.isInitialized) throw GameObject.UNINITIALIZED_GAMEOBJECT_ERROR;
		return this._ecsyEntity.getRemovedComponent(GameComponent);
	}

	/**
	 * Boolean value indicating whether the entity has all {@link GameComponent} in
	 * a list.
	 */
	hasAllComponents(GameComponents: GameComponentConstructor<any>[]): boolean {
		if (!this.isInitialized) return false;
		return this._ecsyEntity.hasAllComponents(GameComponents);
	}

	/**
	 * Boolean value indicating whether the entity has any {@link GameComponent} in
	 * a list.
	 */
	hasAnyComponents(GameComponents: GameComponentConstructor<any>[]): boolean {
		if (!this.isInitialized) return false;
		return this._ecsyEntity.hasAnyComponents(GameComponents);
	}

	/**
	 * Boolean value indicating whether the entity has the given
	 * {@link GameComponent}.
	 */
	hasComponent(GameComponent: GameComponentConstructor<any>): boolean {
		if (!this.isInitialized) return false;
		return this._ecsyEntity.hasComponent(GameComponent);
	}

	/** Remove all {@link GameComponent} on this entity. */
	removeAllComponents(forceImmediate: boolean): void {
		if (!this.isInitialized) throw GameObject.UNINITIALIZED_GAMEOBJECT_ERROR;
		this._ecsyEntity.removeAllComponents(forceImmediate);
	}

	/** Remove a {@link GameComponent} from the entity. */
	removeComponent(
		GameComponent: GameComponentConstructor<any>,
		forceImmediate: boolean,
	): void {
		if (!this.isInitialized) throw GameObject.UNINITIALIZED_GAMEOBJECT_ERROR;
		const component = this._ecsyEntity.getMutableComponent(GameComponent);
		if (component.onRemove) component.onRemove();
		this._ecsyEntity.removeComponent(GameComponent, forceImmediate);
	}
}
