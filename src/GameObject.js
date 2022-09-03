import * as THREE from 'three';

const UNINITIALIZED_GAMEOBJECT_ERROR =
	'Cannot perform action on uninitialized GameObject';

export class GameObject extends THREE.Group {
	init(ecsyEntity) {
		this._ecsyEntity = ecsyEntity;
	}

	destroy() {
		if (this._ecsyEntity) this._ecsyEntity.remove(true);
		if (this.parent) this.parent.remove(this);
	}

	clone() {
		if (!this._ecsyEntity) throw UNINITIALIZED_GAMEOBJECT_ERROR;
		const newGameObject = super.clone(true);
		const newEntity = this._ecsyEntity.clone();
		newGameObject.init(newEntity);
		return newGameObject;
	}

	addComponent(GameComponent, values) {
		if (!this._ecsyEntity) throw UNINITIALIZED_GAMEOBJECT_ERROR;
		this._ecsyEntity.addComponent(GameComponent, values);
		const newComponent = this.getMutableComponent(GameComponent);
		newComponent.setGameObject(this);
		return newComponent;
	}

	getComponent(GameComponent) {
		if (!this._ecsyEntity) throw UNINITIALIZED_GAMEOBJECT_ERROR;
		return this._ecsyEntity.getComponent(GameComponent);
	}

	getMutableComponent(GameComponent) {
		if (!this._ecsyEntity) throw UNINITIALIZED_GAMEOBJECT_ERROR;
		return this._ecsyEntity.getMutableComponent(GameComponent);
	}

	getComponentTypes() {
		if (!this._ecsyEntity) throw UNINITIALIZED_GAMEOBJECT_ERROR;
		return this._ecsyEntity.getComponentTypes();
	}

	getComponents() {
		if (!this._ecsyEntity) throw UNINITIALIZED_GAMEOBJECT_ERROR;
		return this._ecsyEntity.getComponents();
	}

	getComponentsToRemove() {
		if (!this._ecsyEntity) throw UNINITIALIZED_GAMEOBJECT_ERROR;
		return this._ecsyEntity.getComponentsToRemove();
	}

	getRemovedComponent(GameComponent) {
		if (!this._ecsyEntity) throw UNINITIALIZED_GAMEOBJECT_ERROR;
		return this._ecsyEntity.getRemovedComponent(GameComponent);
	}

	hasAllComponents(GameComponents) {
		if (!this._ecsyEntity) throw UNINITIALIZED_GAMEOBJECT_ERROR;
		return this._ecsyEntity.hasAllComponents(GameComponents);
	}

	hasAnyComponents(GameComponents) {
		if (!this._ecsyEntity) throw UNINITIALIZED_GAMEOBJECT_ERROR;
		return this._ecsyEntity.hasAnyComponents(GameComponents);
	}

	hasComponent(GameComponent) {
		if (!this._ecsyEntity) throw UNINITIALIZED_GAMEOBJECT_ERROR;
		return this._ecsyEntity.hasComponent(GameComponent);
	}

	removeAllComponents(forceImmediate) {
		if (!this._ecsyEntity) throw UNINITIALIZED_GAMEOBJECT_ERROR;
		this._ecsyEntity.removeAllComponents(forceImmediate);
	}

	removeComponent(GameComponent, forceImmediate) {
		if (!this._ecsyEntity) throw UNINITIALIZED_GAMEOBJECT_ERROR;
		this._ecsyEntity.removeComponent(GameComponent, forceImmediate);
	}
}
