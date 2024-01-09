import { Component, ComponentMask } from 'elics/lib/Component';
import { World as ElicsWorld, PRIVATE as WORLD_PRIVATE } from 'elics/lib/World';
import { Object3D, Object3DEventMap } from 'three';

import { ComponentManager } from 'elics/lib/ComponentManager';
import { EntityLike } from 'elics';
import { EntityManager } from 'elics/lib/EntityManager';
import { QueryManager } from 'elics/lib/QueryManager';
import { World } from './World';

const ERRORS = {
	MODIFY_DESTROYED_ENTITY: 'Cannot modify a destroyed entity',
	ACCESS_DESTROYED_ENTITY: 'Cannot access a destroyed entity',
};

export class GameObject<TEventMap extends Object3DEventMap = Object3DEventMap>
	extends Object3D<TEventMap>
	implements EntityLike
{
	readonly isGameObject: boolean = true;
	public componentMask: ComponentMask = 0;
	public active = true;

	protected components: Map<typeof Component, Component> = new Map();
	protected entityManager: EntityManager;
	protected queryManager: QueryManager;
	protected componentManager: ComponentManager;
	private world: World;

	constructor(world: ElicsWorld) {
		super();
		this.world = world as World;
		this.entityManager = world[WORLD_PRIVATE].entityManager;
		this.queryManager = world[WORLD_PRIVATE].queryManager;
		this.componentManager = world[WORLD_PRIVATE].componentManager;
	}

	copy(_source: this, _recursive?: boolean): this {
		throw new Error('GameObject.copy() is not permitted');
	}

	clone(_recursive?: boolean): this {
		throw new Error('GameObject.clone() is not permitted');
	}

	addComponent<T extends typeof Component>(
		componentClass: T,
		initialData: { [key: string]: any } = {},
	) {
		if (!this.active) throw new Error(ERRORS.MODIFY_DESTROYED_ENTITY);
		if (componentClass.bitmask !== null) {
			this.componentMask |= componentClass.bitmask;
			const componentInstance = this.componentManager.requestComponentInstance(
				componentClass,
				initialData,
			);
			this.components.set(componentClass, componentInstance);
			this.queryManager.updateEntity(this);
			return componentInstance;
		} else {
			throw new Error('Component type not registered');
		}
	}

	removeComponent<T extends typeof Component>(componentClass: T): void {
		if (!this.active) throw new Error(ERRORS.MODIFY_DESTROYED_ENTITY);
		if (
			componentClass.bitmask !== null &&
			this.components.has(componentClass)
		) {
			const componentInstance = this.components.get(componentClass);
			this.componentManager.releaseComponentInstance(componentInstance!);
			this.componentMask &= ~componentClass.bitmask;
			this.components.delete(componentClass);
			this.queryManager.updateEntity(this);
		} else {
			throw new Error('Component not found');
		}
	}

	hasComponent<T extends typeof Component>(componentClass: T): boolean {
		if (!this.active) throw new Error(ERRORS.ACCESS_DESTROYED_ENTITY);
		return this.components.has(componentClass);
	}

	getComponent<T extends Component>(componentClass: {
		new (_cm: ComponentManager, _mi: number): T;
		bitmask: ComponentMask;
		defaults: { [key: string]: any };
	}): T | null {
		if (!this.active) throw new Error(ERRORS.ACCESS_DESTROYED_ENTITY);
		const component = this.components.get(componentClass);
		if (!component) return null;
		return component as T;
	}

	getComponentTypes(): (typeof Component)[] {
		if (!this.active) throw new Error(ERRORS.ACCESS_DESTROYED_ENTITY);
		return Array.from(this.components.keys());
	}

	destroy(): void {
		if (!this.active) throw new Error(ERRORS.MODIFY_DESTROYED_ENTITY);
		this.entityManager.releaseEntityInstance(this);

		// Clear all child objects and restore the transform
		this.world.scene.add(this);
		while (this.children.length > 0) {
			this.remove(this.children[0]);
		}
		this.position.set(0, 0, 0);
		this.rotation.set(0, 0, 0);
		this.scale.set(1, 1, 1);

		// Mark the entity as inactive
		this.active = false;

		// Clear the components map and reset the component mask
		this.components.forEach((component) => {
			this.componentManager.releaseComponentInstance(component);
		});
		this.components.clear();
		this.componentMask = 0;
		this.queryManager.updateEntity(this);
	}
}
