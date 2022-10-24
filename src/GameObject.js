import * as THREE from 'three';

const UNINITIALIZED_GAMEOBJECT_ERROR =
	'Cannot perform action on uninitialized GameObject';

export class GameObject extends THREE.Group {
	/** @param {import('ecsy').Entity} ecsyEntity */
	_init(ecsyEntity) {
		this._ecsyEntity = ecsyEntity;
		this._ecsyEntity.gameObject = this;
	}

	destroy() {
		Object.values(this.getComponents()).forEach((component) => {
			if (component.onRemove) component.onRemove();
		});
		if (this._ecsyEntity) this._ecsyEntity.remove(true);
		if (this.parent) this.parent.remove(this);
	}

	/** @returns {GameObject} */
	duplicate() {
		if (!this._ecsyEntity) throw UNINITIALIZED_GAMEOBJECT_ERROR;
		const newGameObject = super.clone(true);
		const newEntity = this._ecsyEntity.clone();
		newGameObject._init(newEntity);
		return newGameObject;
	}

	/**
	 * @param {import('ecsy').ComponentConstructor} GameComponent
	 * @param {Object<string, any>} values
	 * @returns {import('./GameComponent').GameComponent}
	 */
	addComponent(GameComponent, values) {
		if (!this._ecsyEntity) throw UNINITIALIZED_GAMEOBJECT_ERROR;
		this._ecsyEntity.addComponent(GameComponent, values);
		const newComponent = this.getMutableComponent(GameComponent);
		newComponent.setGameObject(this);
		return newComponent;
	}

	/**
	 * @param {import('ecsy').ComponentConstructor} GameComponent
	 * @returns {import('./GameComponent').GameComponent}
	 */
	getComponent(GameComponent) {
		if (!this._ecsyEntity) throw UNINITIALIZED_GAMEOBJECT_ERROR;
		return this._ecsyEntity.getComponent(GameComponent);
	}

	/**
	 * @param {import('ecsy').ComponentConstructor} GameComponent
	 * @returns {import('./GameComponent').GameComponent}
	 */
	getMutableComponent(GameComponent) {
		if (!this._ecsyEntity) throw UNINITIALIZED_GAMEOBJECT_ERROR;
		return this._ecsyEntity.getMutableComponent(GameComponent);
	}

	/** @returns {import('ecsy').ComponentConstructor[]} */
	getComponentTypes() {
		if (!this._ecsyEntity) throw UNINITIALIZED_GAMEOBJECT_ERROR;
		return this._ecsyEntity.getComponentTypes();
	}

	/** @returns {import('./GameComponent').GameComponent[]} */
	getComponents() {
		if (!this._ecsyEntity) throw UNINITIALIZED_GAMEOBJECT_ERROR;
		return this._ecsyEntity.getComponents();
	}

	/** @returns {import('./GameComponent').GameComponent[]} */
	getComponentsToRemove() {
		if (!this._ecsyEntity) throw UNINITIALIZED_GAMEOBJECT_ERROR;
		return this._ecsyEntity.getComponentsToRemove();
	}

	/**
	 * @param {import('ecsy').ComponentConstructor} GameComponent
	 * @returns {import('./GameComponent').GameComponent}
	 */
	getRemovedComponent(GameComponent) {
		if (!this._ecsyEntity) throw UNINITIALIZED_GAMEOBJECT_ERROR;
		return this._ecsyEntity.getRemovedComponent(GameComponent);
	}

	/**
	 * @param {import('ecsy').ComponentConstructor[]} GameComponents
	 * @returns {boolean}
	 */
	hasAllComponents(GameComponents) {
		if (!this._ecsyEntity) throw UNINITIALIZED_GAMEOBJECT_ERROR;
		return this._ecsyEntity.hasAllComponents(GameComponents);
	}

	/**
	 * @param {import('ecsy').ComponentConstructor[]} GameComponents
	 * @returns {boolean}
	 */
	hasAnyComponents(GameComponents) {
		if (!this._ecsyEntity) throw UNINITIALIZED_GAMEOBJECT_ERROR;
		return this._ecsyEntity.hasAnyComponents(GameComponents);
	}

	/**
	 * @param {import('ecsy').ComponentConstructor} GameComponent
	 * @returns {boolean}
	 */
	hasComponent(GameComponent) {
		if (!this._ecsyEntity) throw UNINITIALIZED_GAMEOBJECT_ERROR;
		return this._ecsyEntity.hasComponent(GameComponent);
	}

	/** @param {boolean} forceImmediate */
	removeAllComponents(forceImmediate) {
		if (!this._ecsyEntity) throw UNINITIALIZED_GAMEOBJECT_ERROR;
		this._ecsyEntity.removeAllComponents(forceImmediate);
	}

	/**
	 * @param {import('ecsy').ComponentConstructor} GameComponent
	 * @param {boolean} forceImmediate
	 */
	removeComponent(GameComponent, forceImmediate) {
		if (!this._ecsyEntity) throw UNINITIALIZED_GAMEOBJECT_ERROR;
		const component = this._ecsyEntity.getMutableComponent(GameComponent);
		if (component.onRemove) component.onRemove();
		this._ecsyEntity.removeComponent(GameComponent, forceImmediate);
	}
}
