import { GameComponent, GameComponentConstructor } from './GameComponent';

import { Entity } from 'ecsy';
import { THREE } from './index';

export type ExtendedEntity = Entity & {
	gameObject: GameObject;
};

/**
 * This class extends THREE.Object3D
 *
 * @see https://threejs.org/docs/#api/en/core/Object3D
 */
export class GameObject extends THREE.Object3D {
	static UNINITIALIZED_GAMEOBJECT_ERROR =
		'Cannot perform action on uninitialized GameObject';

	private _ecsyEntity: ExtendedEntity;
	protected _onInit() {}

	_init(ecsyEntity: ExtendedEntity): void {
		this._ecsyEntity = ecsyEntity;
		this._ecsyEntity.gameObject = this;
		this._onInit();
	}

	get isInitialized() {
		return this._ecsyEntity != null;
	}

	duplicate(): GameObject {
		if (!this.isInitialized) throw GameObject.UNINITIALIZED_GAMEOBJECT_ERROR;
		const newGameObject = super.clone(true);
		const newEntity = this._ecsyEntity.clone();
		newGameObject._init(newEntity);
		return newGameObject;
	}

	addComponent(
		GameComponent: GameComponentConstructor<GameComponent<any>>,
		values?: Partial<Omit<GameComponent<any>, keyof GameComponent<any>>>,
	): GameComponent<any> {
		if (!this.isInitialized) throw GameObject.UNINITIALIZED_GAMEOBJECT_ERROR;
		this._ecsyEntity.addComponent(GameComponent, values);
		const newComponent = this.getMutableComponent(GameComponent);
		newComponent.gameObject = this;
		return newComponent;
	}

	getComponent(
		GameComponent: GameComponentConstructor<GameComponent<any>>,
		includeRemoved?: boolean,
	): Readonly<GameComponent<any>> {
		if (!this.isInitialized) throw GameObject.UNINITIALIZED_GAMEOBJECT_ERROR;
		return this._ecsyEntity.getComponent(GameComponent, includeRemoved);
	}

	getMutableComponent(
		GameComponent: GameComponentConstructor<GameComponent<any>>,
	): GameComponent<any> {
		if (!this.isInitialized) throw GameObject.UNINITIALIZED_GAMEOBJECT_ERROR;
		return this._ecsyEntity.getMutableComponent(GameComponent);
	}

	getComponentTypes() {
		if (!this.isInitialized) throw GameObject.UNINITIALIZED_GAMEOBJECT_ERROR;
		return this._ecsyEntity.getComponentTypes();
	}

	getComponents() {
		if (!this.isInitialized) throw GameObject.UNINITIALIZED_GAMEOBJECT_ERROR;
		return this._ecsyEntity.getComponents();
	}

	getComponentsToRemove() {
		if (!this.isInitialized) throw GameObject.UNINITIALIZED_GAMEOBJECT_ERROR;
		return this._ecsyEntity.getComponentsToRemove();
	}

	getRemovedComponent(
		GameComponent: GameComponentConstructor<GameComponent<any>>,
	): Readonly<GameComponent<any>> {
		if (!this.isInitialized) throw GameObject.UNINITIALIZED_GAMEOBJECT_ERROR;
		return this._ecsyEntity.getRemovedComponent(GameComponent);
	}

	hasAllComponents(GameComponents: GameComponentConstructor<any>[]): boolean {
		if (!this.isInitialized) throw GameObject.UNINITIALIZED_GAMEOBJECT_ERROR;
		return this._ecsyEntity.hasAllComponents(GameComponents);
	}

	hasAnyComponents(GameComponents: GameComponentConstructor<any>[]): boolean {
		if (!this.isInitialized) throw GameObject.UNINITIALIZED_GAMEOBJECT_ERROR;
		return this._ecsyEntity.hasAnyComponents(GameComponents);
	}

	hasComponent(GameComponent: GameComponentConstructor<any>): boolean {
		if (!this.isInitialized) throw GameObject.UNINITIALIZED_GAMEOBJECT_ERROR;
		return this._ecsyEntity.hasComponent(GameComponent);
	}

	removeAllComponents(forceImmediate: boolean): void {
		if (!this.isInitialized) throw GameObject.UNINITIALIZED_GAMEOBJECT_ERROR;
		this._ecsyEntity.removeAllComponents(forceImmediate);
	}

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
