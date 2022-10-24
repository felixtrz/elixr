import * as THREE from 'three';

import { GameComponent, GameComponentConstructor } from './GameComponent';

import { Entity } from 'ecsy';

export type ExtendedEntity = Entity & {
	gameObject: GameObject;
};

const UNINITIALIZED_GAMEOBJECT_ERROR =
	'Cannot perform action on uninitialized GameObject';

export class GameObject extends THREE.Group {
	private ecsyEntity: ExtendedEntity;

	_init(ecsyEntity: ExtendedEntity): void {
		this.ecsyEntity = ecsyEntity;
		this.ecsyEntity.gameObject = this;
	}

	duplicate(): GameObject {
		if (!this.ecsyEntity) throw UNINITIALIZED_GAMEOBJECT_ERROR;
		const newGameObject = super.clone(true);
		const newEntity = this.ecsyEntity.clone();
		newGameObject._init(newEntity);
		return newGameObject;
	}

	addComponent(
		GameComponent: GameComponentConstructor<GameComponent<any>>,
		values?: Partial<Omit<GameComponent<any>, keyof GameComponent<any>>>,
	): GameComponent<any> {
		if (!this.ecsyEntity) throw UNINITIALIZED_GAMEOBJECT_ERROR;
		this.ecsyEntity.addComponent(GameComponent, values);
		const newComponent = this.getMutableComponent(GameComponent);
		newComponent.gameObject = this;
		return newComponent;
	}

	getComponent(
		GameComponent: GameComponentConstructor<GameComponent<any>>,
		includeRemoved?: boolean,
	): Readonly<GameComponent<any>> {
		if (!this.ecsyEntity) throw UNINITIALIZED_GAMEOBJECT_ERROR;
		return this.ecsyEntity.getComponent(GameComponent, includeRemoved);
	}

	getMutableComponent(
		GameComponent: GameComponentConstructor<GameComponent<any>>,
	): GameComponent<any> {
		if (!this.ecsyEntity) throw UNINITIALIZED_GAMEOBJECT_ERROR;
		return this.ecsyEntity.getMutableComponent(GameComponent);
	}

	getComponentTypes() {
		if (!this.ecsyEntity) throw UNINITIALIZED_GAMEOBJECT_ERROR;
		return this.ecsyEntity.getComponentTypes();
	}

	getComponents() {
		if (!this.ecsyEntity) throw UNINITIALIZED_GAMEOBJECT_ERROR;
		return this.ecsyEntity.getComponents();
	}

	getComponentsToRemove() {
		if (!this.ecsyEntity) throw UNINITIALIZED_GAMEOBJECT_ERROR;
		return this.ecsyEntity.getComponentsToRemove();
	}

	getRemovedComponent(
		GameComponent: GameComponentConstructor<GameComponent<any>>,
	): Readonly<GameComponent<any>> {
		if (!this.ecsyEntity) throw UNINITIALIZED_GAMEOBJECT_ERROR;
		return this.ecsyEntity.getRemovedComponent(GameComponent);
	}

	hasAllComponents(GameComponents: GameComponentConstructor<any>[]): boolean {
		if (!this.ecsyEntity) throw UNINITIALIZED_GAMEOBJECT_ERROR;
		return this.ecsyEntity.hasAllComponents(GameComponents);
	}

	hasAnyComponents(GameComponents: GameComponentConstructor<any>[]): boolean {
		if (!this.ecsyEntity) throw UNINITIALIZED_GAMEOBJECT_ERROR;
		return this.ecsyEntity.hasAnyComponents(GameComponents);
	}

	hasComponent(GameComponent: GameComponentConstructor<any>): boolean {
		if (!this.ecsyEntity) throw UNINITIALIZED_GAMEOBJECT_ERROR;
		return this.ecsyEntity.hasComponent(GameComponent);
	}

	removeAllComponents(forceImmediate: boolean): void {
		if (!this.ecsyEntity) throw UNINITIALIZED_GAMEOBJECT_ERROR;
		this.ecsyEntity.removeAllComponents(forceImmediate);
	}

	removeComponent(
		GameComponent: GameComponentConstructor<any>,
		forceImmediate: boolean,
	): void {
		if (!this.ecsyEntity) throw UNINITIALIZED_GAMEOBJECT_ERROR;
		const component = this.ecsyEntity.getMutableComponent(GameComponent);
		if (component.onRemove) component.onRemove();
		this.ecsyEntity.removeComponent(GameComponent, forceImmediate);
	}
}
