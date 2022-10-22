(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('three'), require('gamepad-wrapper'), require('three/examples/jsm/webxr/XRControllerModelFactory')) :
	typeof define === 'function' && define.amd ? define(['exports', 'three', 'gamepad-wrapper', 'three/examples/jsm/webxr/XRControllerModelFactory'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, (function () {
		var current = global.ELIXR;
		var exports = global.ELIXR = {};
		factory(exports, global.THREE, global.gamepadWrapper, global.XRControllerModelFactory);
		exports.noConflict = function () { global.ELIXR = current; return exports; };
	})());
})(this, (function (exports, THREE, gamepadWrapper, XRControllerModelFactory) { 'use strict';

	function _interopNamespace(e) {
		if (e && e.__esModule) return e;
		var n = Object.create(null);
		if (e) {
			Object.keys(e).forEach(function (k) {
				if (k !== 'default') {
					var d = Object.getOwnPropertyDescriptor(e, k);
					Object.defineProperty(n, k, d.get ? d : {
						enumerable: true,
						get: function () { return e[k]; }
					});
				}
			});
		}
		n["default"] = e;
		return Object.freeze(n);
	}

	var THREE__namespace = /*#__PURE__*/_interopNamespace(THREE);

	/**
	 * Return the name of a component
	 * @param {Component} Component
	 * @private
	 */

	/**
	 * Get a key from a list of components
	 * @param {Array(Component)} Components Array of components to generate the key
	 * @private
	 */
	function queryKey(Components) {
	  var ids = [];
	  for (var n = 0; n < Components.length; n++) {
	    var T = Components[n];

	    if (!componentRegistered(T)) {
	      throw new Error(`Tried to create a query with an unregistered component`);
	    }

	    if (typeof T === "object") {
	      var operator = T.operator === "not" ? "!" : T.operator;
	      ids.push(operator + T.Component._typeId);
	    } else {
	      ids.push(T._typeId);
	    }
	  }

	  return ids.sort().join("-");
	}

	// Detector for browser's "window"
	const hasWindow = typeof window !== "undefined";

	// performance.now() "polyfill"
	const now =
	  hasWindow && typeof window.performance !== "undefined"
	    ? performance.now.bind(performance)
	    : Date.now.bind(Date);

	function componentRegistered(T) {
	  return (
	    (typeof T === "object" && T.Component._typeId !== undefined) ||
	    (T.isComponent && T._typeId !== undefined)
	  );
	}

	class SystemManager {
	  constructor(world) {
	    this._systems = [];
	    this._executeSystems = []; // Systems that have `execute` method
	    this.world = world;
	    this.lastExecutedSystem = null;
	  }

	  registerSystem(SystemClass, attributes) {
	    if (!SystemClass.isSystem) {
	      throw new Error(
	        `System '${SystemClass.name}' does not extend 'System' class`
	      );
	    }

	    if (this.getSystem(SystemClass) !== undefined) {
	      console.warn(`System '${SystemClass.getName()}' already registered.`);
	      return this;
	    }

	    var system = new SystemClass(this.world, attributes);
	    if (system.init) system.init(attributes);
	    system.order = this._systems.length;
	    this._systems.push(system);
	    if (system.execute) {
	      this._executeSystems.push(system);
	      this.sortSystems();
	    }
	    return this;
	  }

	  unregisterSystem(SystemClass) {
	    let system = this.getSystem(SystemClass);
	    if (system === undefined) {
	      console.warn(
	        `Can unregister system '${SystemClass.getName()}'. It doesn't exist.`
	      );
	      return this;
	    }

	    this._systems.splice(this._systems.indexOf(system), 1);

	    if (system.execute) {
	      this._executeSystems.splice(this._executeSystems.indexOf(system), 1);
	    }

	    // @todo Add system.unregister() call to free resources
	    return this;
	  }

	  sortSystems() {
	    this._executeSystems.sort((a, b) => {
	      return a.priority - b.priority || a.order - b.order;
	    });
	  }

	  getSystem(SystemClass) {
	    return this._systems.find((s) => s instanceof SystemClass);
	  }

	  getSystems() {
	    return this._systems;
	  }

	  removeSystem(SystemClass) {
	    var index = this._systems.indexOf(SystemClass);
	    if (!~index) return;

	    this._systems.splice(index, 1);
	  }

	  executeSystem(system, delta, time) {
	    if (system.initialized) {
	      if (system.canExecute()) {
	        let startTime = now();
	        system.execute(delta, time);
	        system.executeTime = now() - startTime;
	        this.lastExecutedSystem = system;
	        system.clearEvents();
	      }
	    }
	  }

	  stop() {
	    this._executeSystems.forEach((system) => system.stop());
	  }

	  execute(delta, time, forcePlay) {
	    this._executeSystems.forEach(
	      (system) =>
	        (forcePlay || system.enabled) && this.executeSystem(system, delta, time)
	    );
	  }

	  stats() {
	    var stats = {
	      numSystems: this._systems.length,
	      systems: {},
	    };

	    for (var i = 0; i < this._systems.length; i++) {
	      var system = this._systems[i];
	      var systemStats = (stats.systems[system.getName()] = {
	        queries: {},
	        executeTime: system.executeTime,
	      });
	      for (var name in system.ctx) {
	        systemStats.queries[name] = system.ctx[name].stats();
	      }
	    }

	    return stats;
	  }
	}

	class ObjectPool {
	  // @todo Add initial size
	  constructor(T, initialSize) {
	    this.freeList = [];
	    this.count = 0;
	    this.T = T;
	    this.isObjectPool = true;

	    if (typeof initialSize !== "undefined") {
	      this.expand(initialSize);
	    }
	  }

	  acquire() {
	    // Grow the list by 20%ish if we're out
	    if (this.freeList.length <= 0) {
	      this.expand(Math.round(this.count * 0.2) + 1);
	    }

	    var item = this.freeList.pop();

	    return item;
	  }

	  release(item) {
	    item.reset();
	    this.freeList.push(item);
	  }

	  expand(count) {
	    for (var n = 0; n < count; n++) {
	      var clone = new this.T();
	      clone._pool = this;
	      this.freeList.push(clone);
	    }
	    this.count += count;
	  }

	  totalSize() {
	    return this.count;
	  }

	  totalFree() {
	    return this.freeList.length;
	  }

	  totalUsed() {
	    return this.count - this.freeList.length;
	  }
	}

	/**
	 * @private
	 * @class EventDispatcher
	 */
	class EventDispatcher {
	  constructor() {
	    this._listeners = {};
	    this.stats = {
	      fired: 0,
	      handled: 0,
	    };
	  }

	  /**
	   * Add an event listener
	   * @param {String} eventName Name of the event to listen
	   * @param {Function} listener Callback to trigger when the event is fired
	   */
	  addEventListener(eventName, listener) {
	    let listeners = this._listeners;
	    if (listeners[eventName] === undefined) {
	      listeners[eventName] = [];
	    }

	    if (listeners[eventName].indexOf(listener) === -1) {
	      listeners[eventName].push(listener);
	    }
	  }

	  /**
	   * Check if an event listener is already added to the list of listeners
	   * @param {String} eventName Name of the event to check
	   * @param {Function} listener Callback for the specified event
	   */
	  hasEventListener(eventName, listener) {
	    return (
	      this._listeners[eventName] !== undefined &&
	      this._listeners[eventName].indexOf(listener) !== -1
	    );
	  }

	  /**
	   * Remove an event listener
	   * @param {String} eventName Name of the event to remove
	   * @param {Function} listener Callback for the specified event
	   */
	  removeEventListener(eventName, listener) {
	    var listenerArray = this._listeners[eventName];
	    if (listenerArray !== undefined) {
	      var index = listenerArray.indexOf(listener);
	      if (index !== -1) {
	        listenerArray.splice(index, 1);
	      }
	    }
	  }

	  /**
	   * Dispatch an event
	   * @param {String} eventName Name of the event to dispatch
	   * @param {Entity} entity (Optional) Entity to emit
	   * @param {Component} component
	   */
	  dispatchEvent(eventName, entity, component) {
	    this.stats.fired++;

	    var listenerArray = this._listeners[eventName];
	    if (listenerArray !== undefined) {
	      var array = listenerArray.slice(0);

	      for (var i = 0; i < array.length; i++) {
	        array[i].call(this, entity, component);
	      }
	    }
	  }

	  /**
	   * Reset stats counters
	   */
	  resetCounters() {
	    this.stats.fired = this.stats.handled = 0;
	  }
	}

	class Query {
	  /**
	   * @param {Array(Component)} Components List of types of components to query
	   */
	  constructor(Components, manager) {
	    this.Components = [];
	    this.NotComponents = [];

	    Components.forEach((component) => {
	      if (typeof component === "object") {
	        this.NotComponents.push(component.Component);
	      } else {
	        this.Components.push(component);
	      }
	    });

	    if (this.Components.length === 0) {
	      throw new Error("Can't create a query without components");
	    }

	    this.entities = [];

	    this.eventDispatcher = new EventDispatcher();

	    // This query is being used by a reactive system
	    this.reactive = false;

	    this.key = queryKey(Components);

	    // Fill the query with the existing entities
	    for (var i = 0; i < manager._entities.length; i++) {
	      var entity = manager._entities[i];
	      if (this.match(entity)) {
	        // @todo ??? this.addEntity(entity); => preventing the event to be generated
	        entity.queries.push(this);
	        this.entities.push(entity);
	      }
	    }
	  }

	  /**
	   * Add entity to this query
	   * @param {Entity} entity
	   */
	  addEntity(entity) {
	    entity.queries.push(this);
	    this.entities.push(entity);

	    this.eventDispatcher.dispatchEvent(Query.prototype.ENTITY_ADDED, entity);
	  }

	  /**
	   * Remove entity from this query
	   * @param {Entity} entity
	   */
	  removeEntity(entity) {
	    let index = this.entities.indexOf(entity);
	    if (~index) {
	      this.entities.splice(index, 1);

	      index = entity.queries.indexOf(this);
	      entity.queries.splice(index, 1);

	      this.eventDispatcher.dispatchEvent(
	        Query.prototype.ENTITY_REMOVED,
	        entity
	      );
	    }
	  }

	  match(entity) {
	    return (
	      entity.hasAllComponents(this.Components) &&
	      !entity.hasAnyComponents(this.NotComponents)
	    );
	  }

	  toJSON() {
	    return {
	      key: this.key,
	      reactive: this.reactive,
	      components: {
	        included: this.Components.map((C) => C.name),
	        not: this.NotComponents.map((C) => C.name),
	      },
	      numEntities: this.entities.length,
	    };
	  }

	  /**
	   * Return stats for this query
	   */
	  stats() {
	    return {
	      numComponents: this.Components.length,
	      numEntities: this.entities.length,
	    };
	  }
	}

	Query.prototype.ENTITY_ADDED = "Query#ENTITY_ADDED";
	Query.prototype.ENTITY_REMOVED = "Query#ENTITY_REMOVED";
	Query.prototype.COMPONENT_CHANGED = "Query#COMPONENT_CHANGED";

	/**
	 * @private
	 * @class QueryManager
	 */
	class QueryManager {
	  constructor(world) {
	    this._world = world;

	    // Queries indexed by a unique identifier for the components it has
	    this._queries = {};
	  }

	  onEntityRemoved(entity) {
	    for (var queryName in this._queries) {
	      var query = this._queries[queryName];
	      if (entity.queries.indexOf(query) !== -1) {
	        query.removeEntity(entity);
	      }
	    }
	  }

	  /**
	   * Callback when a component is added to an entity
	   * @param {Entity} entity Entity that just got the new component
	   * @param {Component} Component Component added to the entity
	   */
	  onEntityComponentAdded(entity, Component) {
	    // @todo Use bitmask for checking components?

	    // Check each indexed query to see if we need to add this entity to the list
	    for (var queryName in this._queries) {
	      var query = this._queries[queryName];

	      if (
	        !!~query.NotComponents.indexOf(Component) &&
	        ~query.entities.indexOf(entity)
	      ) {
	        query.removeEntity(entity);
	        continue;
	      }

	      // Add the entity only if:
	      // Component is in the query
	      // and Entity has ALL the components of the query
	      // and Entity is not already in the query
	      if (
	        !~query.Components.indexOf(Component) ||
	        !query.match(entity) ||
	        ~query.entities.indexOf(entity)
	      )
	        continue;

	      query.addEntity(entity);
	    }
	  }

	  /**
	   * Callback when a component is removed from an entity
	   * @param {Entity} entity Entity to remove the component from
	   * @param {Component} Component Component to remove from the entity
	   */
	  onEntityComponentRemoved(entity, Component) {
	    for (var queryName in this._queries) {
	      var query = this._queries[queryName];

	      if (
	        !!~query.NotComponents.indexOf(Component) &&
	        !~query.entities.indexOf(entity) &&
	        query.match(entity)
	      ) {
	        query.addEntity(entity);
	        continue;
	      }

	      if (
	        !!~query.Components.indexOf(Component) &&
	        !!~query.entities.indexOf(entity) &&
	        !query.match(entity)
	      ) {
	        query.removeEntity(entity);
	        continue;
	      }
	    }
	  }

	  /**
	   * Get a query for the specified components
	   * @param {Component} Components Components that the query should have
	   */
	  getQuery(Components) {
	    var key = queryKey(Components);
	    var query = this._queries[key];
	    if (!query) {
	      this._queries[key] = query = new Query(Components, this._world);
	    }
	    return query;
	  }

	  /**
	   * Return some stats from this class
	   */
	  stats() {
	    var stats = {};
	    for (var queryName in this._queries) {
	      stats[queryName] = this._queries[queryName].stats();
	    }
	    return stats;
	  }
	}

	class Component {
	  constructor(props) {
	    if (props !== false) {
	      const schema = this.constructor.schema;

	      for (const key in schema) {
	        if (props && props.hasOwnProperty(key)) {
	          this[key] = props[key];
	        } else {
	          const schemaProp = schema[key];
	          if (schemaProp.hasOwnProperty("default")) {
	            this[key] = schemaProp.type.clone(schemaProp.default);
	          } else {
	            const type = schemaProp.type;
	            this[key] = type.clone(type.default);
	          }
	        }
	      }

	      if (props !== undefined) {
	        this.checkUndefinedAttributes(props);
	      }
	    }

	    this._pool = null;
	  }

	  copy(source) {
	    const schema = this.constructor.schema;

	    for (const key in schema) {
	      const prop = schema[key];

	      if (source.hasOwnProperty(key)) {
	        this[key] = prop.type.copy(source[key], this[key]);
	      }
	    }

	    // @DEBUG
	    {
	      this.checkUndefinedAttributes(source);
	    }

	    return this;
	  }

	  clone() {
	    return new this.constructor().copy(this);
	  }

	  reset() {
	    const schema = this.constructor.schema;

	    for (const key in schema) {
	      const schemaProp = schema[key];

	      if (schemaProp.hasOwnProperty("default")) {
	        this[key] = schemaProp.type.copy(schemaProp.default, this[key]);
	      } else {
	        const type = schemaProp.type;
	        this[key] = type.copy(type.default, this[key]);
	      }
	    }
	  }

	  dispose() {
	    if (this._pool) {
	      this._pool.release(this);
	    }
	  }

	  getName() {
	    return this.constructor.getName();
	  }

	  checkUndefinedAttributes(src) {
	    const schema = this.constructor.schema;

	    // Check that the attributes defined in source are also defined in the schema
	    Object.keys(src).forEach((srcKey) => {
	      if (!schema.hasOwnProperty(srcKey)) {
	        console.warn(
	          `Trying to set attribute '${srcKey}' not defined in the '${this.constructor.name}' schema. Please fix the schema, the attribute value won't be set`
	        );
	      }
	    });
	  }
	}

	Component.schema = {};
	Component.isComponent = true;
	Component.getName = function () {
	  return this.displayName || this.name;
	};

	class SystemStateComponent extends Component {}

	SystemStateComponent.isSystemStateComponent = true;

	class EntityPool extends ObjectPool {
	  constructor(entityManager, entityClass, initialSize) {
	    super(entityClass, undefined);
	    this.entityManager = entityManager;

	    if (typeof initialSize !== "undefined") {
	      this.expand(initialSize);
	    }
	  }

	  expand(count) {
	    for (var n = 0; n < count; n++) {
	      var clone = new this.T(this.entityManager);
	      clone._pool = this;
	      this.freeList.push(clone);
	    }
	    this.count += count;
	  }
	}

	/**
	 * @private
	 * @class EntityManager
	 */
	class EntityManager {
	  constructor(world) {
	    this.world = world;
	    this.componentsManager = world.componentsManager;

	    // All the entities in this instance
	    this._entities = [];
	    this._nextEntityId = 0;

	    this._entitiesByNames = {};

	    this._queryManager = new QueryManager(this);
	    this.eventDispatcher = new EventDispatcher();
	    this._entityPool = new EntityPool(
	      this,
	      this.world.options.entityClass,
	      this.world.options.entityPoolSize
	    );

	    // Deferred deletion
	    this.entitiesWithComponentsToRemove = [];
	    this.entitiesToRemove = [];
	    this.deferredRemovalEnabled = true;
	  }

	  getEntityByName(name) {
	    return this._entitiesByNames[name];
	  }

	  /**
	   * Create a new entity
	   */
	  createEntity(name) {
	    var entity = this._entityPool.acquire();
	    entity.alive = true;
	    entity.name = name || "";
	    if (name) {
	      if (this._entitiesByNames[name]) {
	        console.warn(`Entity name '${name}' already exist`);
	      } else {
	        this._entitiesByNames[name] = entity;
	      }
	    }

	    this._entities.push(entity);
	    this.eventDispatcher.dispatchEvent(ENTITY_CREATED, entity);
	    return entity;
	  }

	  // COMPONENTS

	  /**
	   * Add a component to an entity
	   * @param {Entity} entity Entity where the component will be added
	   * @param {Component} Component Component to be added to the entity
	   * @param {Object} values Optional values to replace the default attributes
	   */
	  entityAddComponent(entity, Component, values) {
	    // @todo Probably define Component._typeId with a default value and avoid using typeof
	    if (
	      typeof Component._typeId === "undefined" &&
	      !this.world.componentsManager._ComponentsMap[Component._typeId]
	    ) {
	      throw new Error(
	        `Attempted to add unregistered component "${Component.getName()}"`
	      );
	    }

	    if (~entity._ComponentTypes.indexOf(Component)) {
	      {
	        console.warn(
	          "Component type already exists on entity.",
	          entity,
	          Component.getName()
	        );
	      }
	      return;
	    }

	    entity._ComponentTypes.push(Component);

	    if (Component.__proto__ === SystemStateComponent) {
	      entity.numStateComponents++;
	    }

	    var componentPool = this.world.componentsManager.getComponentsPool(
	      Component
	    );

	    var component = componentPool
	      ? componentPool.acquire()
	      : new Component(values);

	    if (componentPool && values) {
	      component.copy(values);
	    }

	    entity._components[Component._typeId] = component;

	    this._queryManager.onEntityComponentAdded(entity, Component);
	    this.world.componentsManager.componentAddedToEntity(Component);

	    this.eventDispatcher.dispatchEvent(COMPONENT_ADDED, entity, Component);
	  }

	  /**
	   * Remove a component from an entity
	   * @param {Entity} entity Entity which will get removed the component
	   * @param {*} Component Component to remove from the entity
	   * @param {Bool} immediately If you want to remove the component immediately instead of deferred (Default is false)
	   */
	  entityRemoveComponent(entity, Component, immediately) {
	    var index = entity._ComponentTypes.indexOf(Component);
	    if (!~index) return;

	    this.eventDispatcher.dispatchEvent(COMPONENT_REMOVE, entity, Component);

	    if (immediately) {
	      this._entityRemoveComponentSync(entity, Component, index);
	    } else {
	      if (entity._ComponentTypesToRemove.length === 0)
	        this.entitiesWithComponentsToRemove.push(entity);

	      entity._ComponentTypes.splice(index, 1);
	      entity._ComponentTypesToRemove.push(Component);

	      entity._componentsToRemove[Component._typeId] =
	        entity._components[Component._typeId];
	      delete entity._components[Component._typeId];
	    }

	    // Check each indexed query to see if we need to remove it
	    this._queryManager.onEntityComponentRemoved(entity, Component);

	    if (Component.__proto__ === SystemStateComponent) {
	      entity.numStateComponents--;

	      // Check if the entity was a ghost waiting for the last system state component to be removed
	      if (entity.numStateComponents === 0 && !entity.alive) {
	        entity.remove();
	      }
	    }
	  }

	  _entityRemoveComponentSync(entity, Component, index) {
	    // Remove T listing on entity and property ref, then free the component.
	    entity._ComponentTypes.splice(index, 1);
	    var component = entity._components[Component._typeId];
	    delete entity._components[Component._typeId];
	    component.dispose();
	    this.world.componentsManager.componentRemovedFromEntity(Component);
	  }

	  /**
	   * Remove all the components from an entity
	   * @param {Entity} entity Entity from which the components will be removed
	   */
	  entityRemoveAllComponents(entity, immediately) {
	    let Components = entity._ComponentTypes;

	    for (let j = Components.length - 1; j >= 0; j--) {
	      if (Components[j].__proto__ !== SystemStateComponent)
	        this.entityRemoveComponent(entity, Components[j], immediately);
	    }
	  }

	  /**
	   * Remove the entity from this manager. It will clear also its components
	   * @param {Entity} entity Entity to remove from the manager
	   * @param {Bool} immediately If you want to remove the component immediately instead of deferred (Default is false)
	   */
	  removeEntity(entity, immediately) {
	    var index = this._entities.indexOf(entity);

	    if (!~index) throw new Error("Tried to remove entity not in list");

	    entity.alive = false;
	    this.entityRemoveAllComponents(entity, immediately);

	    if (entity.numStateComponents === 0) {
	      // Remove from entity list
	      this.eventDispatcher.dispatchEvent(ENTITY_REMOVED, entity);
	      this._queryManager.onEntityRemoved(entity);
	      if (immediately === true) {
	        this._releaseEntity(entity, index);
	      } else {
	        this.entitiesToRemove.push(entity);
	      }
	    }
	  }

	  _releaseEntity(entity, index) {
	    this._entities.splice(index, 1);

	    if (this._entitiesByNames[entity.name]) {
	      delete this._entitiesByNames[entity.name];
	    }
	    entity._pool.release(entity);
	  }

	  /**
	   * Remove all entities from this manager
	   */
	  removeAllEntities() {
	    for (var i = this._entities.length - 1; i >= 0; i--) {
	      this.removeEntity(this._entities[i]);
	    }
	  }

	  processDeferredRemoval() {
	    if (!this.deferredRemovalEnabled) {
	      return;
	    }

	    for (let i = 0; i < this.entitiesToRemove.length; i++) {
	      let entity = this.entitiesToRemove[i];
	      let index = this._entities.indexOf(entity);
	      this._releaseEntity(entity, index);
	    }
	    this.entitiesToRemove.length = 0;

	    for (let i = 0; i < this.entitiesWithComponentsToRemove.length; i++) {
	      let entity = this.entitiesWithComponentsToRemove[i];
	      while (entity._ComponentTypesToRemove.length > 0) {
	        let Component = entity._ComponentTypesToRemove.pop();

	        var component = entity._componentsToRemove[Component._typeId];
	        delete entity._componentsToRemove[Component._typeId];
	        component.dispose();
	        this.world.componentsManager.componentRemovedFromEntity(Component);

	        //this._entityRemoveComponentSync(entity, Component, index);
	      }
	    }

	    this.entitiesWithComponentsToRemove.length = 0;
	  }

	  /**
	   * Get a query based on a list of components
	   * @param {Array(Component)} Components List of components that will form the query
	   */
	  queryComponents(Components) {
	    return this._queryManager.getQuery(Components);
	  }

	  // EXTRAS

	  /**
	   * Return number of entities
	   */
	  count() {
	    return this._entities.length;
	  }

	  /**
	   * Return some stats
	   */
	  stats() {
	    var stats = {
	      numEntities: this._entities.length,
	      numQueries: Object.keys(this._queryManager._queries).length,
	      queries: this._queryManager.stats(),
	      numComponentPool: Object.keys(this.componentsManager._componentPool)
	        .length,
	      componentPool: {},
	      eventDispatcher: this.eventDispatcher.stats,
	    };

	    for (var ecsyComponentId in this.componentsManager._componentPool) {
	      var pool = this.componentsManager._componentPool[ecsyComponentId];
	      stats.componentPool[pool.T.getName()] = {
	        used: pool.totalUsed(),
	        size: pool.count,
	      };
	    }

	    return stats;
	  }
	}

	const ENTITY_CREATED = "EntityManager#ENTITY_CREATE";
	const ENTITY_REMOVED = "EntityManager#ENTITY_REMOVED";
	const COMPONENT_ADDED = "EntityManager#COMPONENT_ADDED";
	const COMPONENT_REMOVE = "EntityManager#COMPONENT_REMOVE";

	class ComponentManager {
	  constructor() {
	    this.Components = [];
	    this._ComponentsMap = {};

	    this._componentPool = {};
	    this.numComponents = {};
	    this.nextComponentId = 0;
	  }

	  hasComponent(Component) {
	    return this.Components.indexOf(Component) !== -1;
	  }

	  registerComponent(Component, objectPool) {
	    if (this.Components.indexOf(Component) !== -1) {
	      console.warn(
	        `Component type: '${Component.getName()}' already registered.`
	      );
	      return;
	    }

	    const schema = Component.schema;

	    if (!schema) {
	      throw new Error(
	        `Component "${Component.getName()}" has no schema property.`
	      );
	    }

	    for (const propName in schema) {
	      const prop = schema[propName];

	      if (!prop.type) {
	        throw new Error(
	          `Invalid schema for component "${Component.getName()}". Missing type for "${propName}" property.`
	        );
	      }
	    }

	    Component._typeId = this.nextComponentId++;
	    this.Components.push(Component);
	    this._ComponentsMap[Component._typeId] = Component;
	    this.numComponents[Component._typeId] = 0;

	    if (objectPool === undefined) {
	      objectPool = new ObjectPool(Component);
	    } else if (objectPool === false) {
	      objectPool = undefined;
	    }

	    this._componentPool[Component._typeId] = objectPool;
	  }

	  componentAddedToEntity(Component) {
	    this.numComponents[Component._typeId]++;
	  }

	  componentRemovedFromEntity(Component) {
	    this.numComponents[Component._typeId]--;
	  }

	  getComponentsPool(Component) {
	    return this._componentPool[Component._typeId];
	  }
	}

	const Version = "0.3.1";

	const proxyMap = new WeakMap();

	const proxyHandler = {
	  set(target, prop) {
	    throw new Error(
	      `Tried to write to "${target.constructor.getName()}#${String(
        prop
      )}" on immutable component. Use .getMutableComponent() to modify a component.`
	    );
	  },
	};

	function wrapImmutableComponent(T, component) {
	  if (component === undefined) {
	    return undefined;
	  }

	  let wrappedComponent = proxyMap.get(component);

	  if (!wrappedComponent) {
	    wrappedComponent = new Proxy(component, proxyHandler);
	    proxyMap.set(component, wrappedComponent);
	  }

	  return wrappedComponent;
	}

	class Entity {
	  constructor(entityManager) {
	    this._entityManager = entityManager || null;

	    // Unique ID for this entity
	    this.id = entityManager._nextEntityId++;

	    // List of components types the entity has
	    this._ComponentTypes = [];

	    // Instance of the components
	    this._components = {};

	    this._componentsToRemove = {};

	    // Queries where the entity is added
	    this.queries = [];

	    // Used for deferred removal
	    this._ComponentTypesToRemove = [];

	    this.alive = false;

	    //if there are state components on a entity, it can't be removed completely
	    this.numStateComponents = 0;
	  }

	  // COMPONENTS

	  getComponent(Component, includeRemoved) {
	    var component = this._components[Component._typeId];

	    if (!component && includeRemoved === true) {
	      component = this._componentsToRemove[Component._typeId];
	    }

	    return wrapImmutableComponent(Component, component)
	      ;
	  }

	  getRemovedComponent(Component) {
	    const component = this._componentsToRemove[Component._typeId];

	    return wrapImmutableComponent(Component, component)
	      ;
	  }

	  getComponents() {
	    return this._components;
	  }

	  getComponentsToRemove() {
	    return this._componentsToRemove;
	  }

	  getComponentTypes() {
	    return this._ComponentTypes;
	  }

	  getMutableComponent(Component) {
	    var component = this._components[Component._typeId];

	    if (!component) {
	      return;
	    }

	    for (var i = 0; i < this.queries.length; i++) {
	      var query = this.queries[i];
	      // @todo accelerate this check. Maybe having query._Components as an object
	      // @todo add Not components
	      if (query.reactive && query.Components.indexOf(Component) !== -1) {
	        query.eventDispatcher.dispatchEvent(
	          Query.prototype.COMPONENT_CHANGED,
	          this,
	          component
	        );
	      }
	    }
	    return component;
	  }

	  addComponent(Component, values) {
	    this._entityManager.entityAddComponent(this, Component, values);
	    return this;
	  }

	  removeComponent(Component, forceImmediate) {
	    this._entityManager.entityRemoveComponent(this, Component, forceImmediate);
	    return this;
	  }

	  hasComponent(Component, includeRemoved) {
	    return (
	      !!~this._ComponentTypes.indexOf(Component) ||
	      (includeRemoved === true && this.hasRemovedComponent(Component))
	    );
	  }

	  hasRemovedComponent(Component) {
	    return !!~this._ComponentTypesToRemove.indexOf(Component);
	  }

	  hasAllComponents(Components) {
	    for (var i = 0; i < Components.length; i++) {
	      if (!this.hasComponent(Components[i])) return false;
	    }
	    return true;
	  }

	  hasAnyComponents(Components) {
	    for (var i = 0; i < Components.length; i++) {
	      if (this.hasComponent(Components[i])) return true;
	    }
	    return false;
	  }

	  removeAllComponents(forceImmediate) {
	    return this._entityManager.entityRemoveAllComponents(this, forceImmediate);
	  }

	  copy(src) {
	    // TODO: This can definitely be optimized
	    for (var ecsyComponentId in src._components) {
	      var srcComponent = src._components[ecsyComponentId];
	      this.addComponent(srcComponent.constructor);
	      var component = this.getComponent(srcComponent.constructor);
	      component.copy(srcComponent);
	    }

	    return this;
	  }

	  clone() {
	    return new Entity(this._entityManager).copy(this);
	  }

	  reset() {
	    this.id = this._entityManager._nextEntityId++;
	    this._ComponentTypes.length = 0;
	    this.queries.length = 0;

	    for (var ecsyComponentId in this._components) {
	      delete this._components[ecsyComponentId];
	    }
	  }

	  remove(forceImmediate) {
	    return this._entityManager.removeEntity(this, forceImmediate);
	  }
	}

	const DEFAULT_OPTIONS = {
	  entityPoolSize: 0,
	  entityClass: Entity,
	};

	class World {
	  constructor(options = {}) {
	    this.options = Object.assign({}, DEFAULT_OPTIONS, options);

	    this.componentsManager = new ComponentManager(this);
	    this.entityManager = new EntityManager(this);
	    this.systemManager = new SystemManager(this);

	    this.enabled = true;

	    this.eventQueues = {};

	    if (hasWindow && typeof CustomEvent !== "undefined") {
	      var event = new CustomEvent("ecsy-world-created", {
	        detail: { world: this, version: Version },
	      });
	      window.dispatchEvent(event);
	    }

	    this.lastTime = now() / 1000;
	  }

	  registerComponent(Component, objectPool) {
	    this.componentsManager.registerComponent(Component, objectPool);
	    return this;
	  }

	  registerSystem(System, attributes) {
	    this.systemManager.registerSystem(System, attributes);
	    return this;
	  }

	  hasRegisteredComponent(Component) {
	    return this.componentsManager.hasComponent(Component);
	  }

	  unregisterSystem(System) {
	    this.systemManager.unregisterSystem(System);
	    return this;
	  }

	  getSystem(SystemClass) {
	    return this.systemManager.getSystem(SystemClass);
	  }

	  getSystems() {
	    return this.systemManager.getSystems();
	  }

	  execute(delta, time) {
	    if (!delta) {
	      time = now() / 1000;
	      delta = time - this.lastTime;
	      this.lastTime = time;
	    }

	    if (this.enabled) {
	      this.systemManager.execute(delta, time);
	      this.entityManager.processDeferredRemoval();
	    }
	  }

	  stop() {
	    this.enabled = false;
	  }

	  play() {
	    this.enabled = true;
	  }

	  createEntity(name) {
	    return this.entityManager.createEntity(name);
	  }

	  stats() {
	    var stats = {
	      entities: this.entityManager.stats(),
	      system: this.systemManager.stats(),
	    };

	    return stats;
	  }
	}

	class System {
	  canExecute() {
	    if (this._mandatoryQueries.length === 0) return true;

	    for (let i = 0; i < this._mandatoryQueries.length; i++) {
	      var query = this._mandatoryQueries[i];
	      if (query.entities.length === 0) {
	        return false;
	      }
	    }

	    return true;
	  }

	  getName() {
	    return this.constructor.getName();
	  }

	  constructor(world, attributes) {
	    this.world = world;
	    this.enabled = true;

	    // @todo Better naming :)
	    this._queries = {};
	    this.queries = {};

	    this.priority = 0;

	    // Used for stats
	    this.executeTime = 0;

	    if (attributes && attributes.priority) {
	      this.priority = attributes.priority;
	    }

	    this._mandatoryQueries = [];

	    this.initialized = true;

	    if (this.constructor.queries) {
	      for (var queryName in this.constructor.queries) {
	        var queryConfig = this.constructor.queries[queryName];
	        var Components = queryConfig.components;
	        if (!Components || Components.length === 0) {
	          throw new Error("'components' attribute can't be empty in a query");
	        }

	        // Detect if the components have already been registered
	        let unregisteredComponents = Components.filter(
	          (Component) => !componentRegistered(Component)
	        );

	        if (unregisteredComponents.length > 0) {
	          throw new Error(
	            `Tried to create a query '${
              this.constructor.name
            }.${queryName}' with unregistered components: [${unregisteredComponents
              .map((c) => c.getName())
              .join(", ")}]`
	          );
	        }

	        var query = this.world.entityManager.queryComponents(Components);

	        this._queries[queryName] = query;
	        if (queryConfig.mandatory === true) {
	          this._mandatoryQueries.push(query);
	        }
	        this.queries[queryName] = {
	          results: query.entities,
	        };

	        // Reactive configuration added/removed/changed
	        var validEvents = ["added", "removed", "changed"];

	        const eventMapping = {
	          added: Query.prototype.ENTITY_ADDED,
	          removed: Query.prototype.ENTITY_REMOVED,
	          changed: Query.prototype.COMPONENT_CHANGED, // Query.prototype.ENTITY_CHANGED
	        };

	        if (queryConfig.listen) {
	          validEvents.forEach((eventName) => {
	            if (!this.execute) {
	              console.warn(
	                `System '${this.getName()}' has defined listen events (${validEvents.join(
                  ", "
                )}) for query '${queryName}' but it does not implement the 'execute' method.`
	              );
	            }

	            // Is the event enabled on this system's query?
	            if (queryConfig.listen[eventName]) {
	              let event = queryConfig.listen[eventName];

	              if (eventName === "changed") {
	                query.reactive = true;
	                if (event === true) {
	                  // Any change on the entity from the components in the query
	                  let eventList = (this.queries[queryName][eventName] = []);
	                  query.eventDispatcher.addEventListener(
	                    Query.prototype.COMPONENT_CHANGED,
	                    (entity) => {
	                      // Avoid duplicates
	                      if (eventList.indexOf(entity) === -1) {
	                        eventList.push(entity);
	                      }
	                    }
	                  );
	                } else if (Array.isArray(event)) {
	                  let eventList = (this.queries[queryName][eventName] = []);
	                  query.eventDispatcher.addEventListener(
	                    Query.prototype.COMPONENT_CHANGED,
	                    (entity, changedComponent) => {
	                      // Avoid duplicates
	                      if (
	                        event.indexOf(changedComponent.constructor) !== -1 &&
	                        eventList.indexOf(entity) === -1
	                      ) {
	                        eventList.push(entity);
	                      }
	                    }
	                  );
	                } else ;
	              } else {
	                let eventList = (this.queries[queryName][eventName] = []);

	                query.eventDispatcher.addEventListener(
	                  eventMapping[eventName],
	                  (entity) => {
	                    // @fixme overhead?
	                    if (eventList.indexOf(entity) === -1)
	                      eventList.push(entity);
	                  }
	                );
	              }
	            }
	          });
	        }
	      }
	    }
	  }

	  stop() {
	    this.executeTime = 0;
	    this.enabled = false;
	  }

	  play() {
	    this.enabled = true;
	  }

	  // @question rename to clear queues?
	  clearEvents() {
	    for (let queryName in this.queries) {
	      var query = this.queries[queryName];
	      if (query.added) {
	        query.added.length = 0;
	      }
	      if (query.removed) {
	        query.removed.length = 0;
	      }
	      if (query.changed) {
	        if (Array.isArray(query.changed)) {
	          query.changed.length = 0;
	        } else {
	          for (let name in query.changed) {
	            query.changed[name].length = 0;
	          }
	        }
	      }
	    }
	  }

	  toJSON() {
	    var json = {
	      name: this.getName(),
	      enabled: this.enabled,
	      executeTime: this.executeTime,
	      priority: this.priority,
	      queries: {},
	    };

	    if (this.constructor.queries) {
	      var queries = this.constructor.queries;
	      for (let queryName in queries) {
	        let query = this.queries[queryName];
	        let queryDefinition = queries[queryName];
	        let jsonQuery = (json.queries[queryName] = {
	          key: this._queries[queryName].key,
	        });

	        jsonQuery.mandatory = queryDefinition.mandatory === true;
	        jsonQuery.reactive =
	          queryDefinition.listen &&
	          (queryDefinition.listen.added === true ||
	            queryDefinition.listen.removed === true ||
	            queryDefinition.listen.changed === true ||
	            Array.isArray(queryDefinition.listen.changed));

	        if (jsonQuery.reactive) {
	          jsonQuery.listen = {};

	          const methods = ["added", "removed", "changed"];
	          methods.forEach((method) => {
	            if (query[method]) {
	              jsonQuery.listen[method] = {
	                entities: query[method].length,
	              };
	            }
	          });
	        }
	      }
	    }

	    return json;
	  }
	}

	System.isSystem = true;
	System.getName = function () {
	  return this.displayName || this.name;
	};

	function Not(Component) {
	  return {
	    operator: "not",
	    Component: Component,
	  };
	}

	class TagComponent extends Component {
	  constructor() {
	    super(false);
	  }
	}

	TagComponent.isTagComponent = true;

	const copyValue = (src) => src;

	const cloneValue = (src) => src;

	const copyArray = (src, dest) => {
	  if (!src) {
	    return src;
	  }

	  if (!dest) {
	    return src.slice();
	  }

	  dest.length = 0;

	  for (let i = 0; i < src.length; i++) {
	    dest.push(src[i]);
	  }

	  return dest;
	};

	const cloneArray = (src) => src && src.slice();

	const copyJSON = (src) => JSON.parse(JSON.stringify(src));

	const cloneJSON = (src) => JSON.parse(JSON.stringify(src));

	function createType(typeDefinition) {
	  var mandatoryProperties = ["name", "default", "copy", "clone"];

	  var undefinedProperties = mandatoryProperties.filter((p) => {
	    return !typeDefinition.hasOwnProperty(p);
	  });

	  if (undefinedProperties.length > 0) {
	    throw new Error(
	      `createType expects a type definition with the following properties: ${undefinedProperties.join(
        ", "
      )}`
	    );
	  }

	  typeDefinition.isType = true;

	  return typeDefinition;
	}

	/**
	 * Standard types
	 */
	const Types = {
	  Number: createType({
	    name: "Number",
	    default: 0,
	    copy: copyValue,
	    clone: cloneValue,
	  }),

	  Boolean: createType({
	    name: "Boolean",
	    default: false,
	    copy: copyValue,
	    clone: cloneValue,
	  }),

	  String: createType({
	    name: "String",
	    default: "",
	    copy: copyValue,
	    clone: cloneValue,
	  }),

	  Array: createType({
	    name: "Array",
	    default: [],
	    copy: copyArray,
	    clone: cloneArray,
	  }),

	  Ref: createType({
	    name: "Ref",
	    default: undefined,
	    copy: copyValue,
	    clone: cloneValue,
	  }),

	  JSON: createType({
	    name: "JSON",
	    default: null,
	    copy: copyJSON,
	    clone: cloneJSON,
	  }),
	};

	function generateId(length) {
	  var result = "";
	  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	  var charactersLength = characters.length;
	  for (var i = 0; i < length; i++) {
	    result += characters.charAt(Math.floor(Math.random() * charactersLength));
	  }
	  return result;
	}

	function injectScript(src, onLoad) {
	  var script = document.createElement("script");
	  // @todo Use link to the ecsy-devtools repo?
	  script.src = src;
	  script.onload = onLoad;
	  (document.head || document.documentElement).appendChild(script);
	}

	/* global Peer */

	function hookConsoleAndErrors(connection) {
	  var wrapFunctions = ["error", "warning", "log"];
	  wrapFunctions.forEach((key) => {
	    if (typeof console[key] === "function") {
	      var fn = console[key].bind(console);
	      console[key] = (...args) => {
	        connection.send({
	          method: "console",
	          type: key,
	          args: JSON.stringify(args),
	        });
	        return fn.apply(null, args);
	      };
	    }
	  });

	  window.addEventListener("error", (error) => {
	    connection.send({
	      method: "error",
	      error: JSON.stringify({
	        message: error.error.message,
	        stack: error.error.stack,
	      }),
	    });
	  });
	}

	function includeRemoteIdHTML(remoteId) {
	  let infoDiv = document.createElement("div");
	  infoDiv.style.cssText = `
    align-items: center;
    background-color: #333;
    color: #aaa;
    display:flex;
    font-family: Arial;
    font-size: 1.1em;
    height: 40px;
    justify-content: center;
    left: 0;
    opacity: 0.9;
    position: absolute;
    right: 0;
    text-align: center;
    top: 0;
  `;

	  infoDiv.innerHTML = `Open ECSY devtools to connect to this page using the code:&nbsp;<b style="color: #fff">${remoteId}</b>&nbsp;<button onClick="generateNewCode()">Generate new code</button>`;
	  document.body.appendChild(infoDiv);

	  return infoDiv;
	}

	function enableRemoteDevtools(remoteId) {
	  if (!hasWindow) {
	    console.warn("Remote devtools not available outside the browser");
	    return;
	  }

	  window.generateNewCode = () => {
	    window.localStorage.clear();
	    remoteId = generateId(6);
	    window.localStorage.setItem("ecsyRemoteId", remoteId);
	    window.location.reload(false);
	  };

	  remoteId = remoteId || window.localStorage.getItem("ecsyRemoteId");
	  if (!remoteId) {
	    remoteId = generateId(6);
	    window.localStorage.setItem("ecsyRemoteId", remoteId);
	  }

	  let infoDiv = includeRemoteIdHTML(remoteId);

	  window.__ECSY_REMOTE_DEVTOOLS_INJECTED = true;
	  window.__ECSY_REMOTE_DEVTOOLS = {};

	  let Version = "";

	  // This is used to collect the worlds created before the communication is being established
	  let worldsBeforeLoading = [];
	  let onWorldCreated = (e) => {
	    var world = e.detail.world;
	    Version = e.detail.version;
	    worldsBeforeLoading.push(world);
	  };
	  window.addEventListener("ecsy-world-created", onWorldCreated);

	  let onLoaded = () => {
	    // var peer = new Peer(remoteId);
	    var peer = new Peer(remoteId, {
	      host: "peerjs.ecsy.io",
	      secure: true,
	      port: 443,
	      config: {
	        iceServers: [
	          { url: "stun:stun.l.google.com:19302" },
	          { url: "stun:stun1.l.google.com:19302" },
	          { url: "stun:stun2.l.google.com:19302" },
	          { url: "stun:stun3.l.google.com:19302" },
	          { url: "stun:stun4.l.google.com:19302" },
	        ],
	      },
	      debug: 3,
	    });

	    peer.on("open", (/* id */) => {
	      peer.on("connection", (connection) => {
	        window.__ECSY_REMOTE_DEVTOOLS.connection = connection;
	        connection.on("open", function () {
	          // infoDiv.style.visibility = "hidden";
	          infoDiv.innerHTML = "Connected";

	          // Receive messages
	          connection.on("data", function (data) {
	            if (data.type === "init") {
	              var script = document.createElement("script");
	              script.setAttribute("type", "text/javascript");
	              script.onload = () => {
	                script.parentNode.removeChild(script);

	                // Once the script is injected we don't need to listen
	                window.removeEventListener(
	                  "ecsy-world-created",
	                  onWorldCreated
	                );
	                worldsBeforeLoading.forEach((world) => {
	                  var event = new CustomEvent("ecsy-world-created", {
	                    detail: { world: world, version: Version },
	                  });
	                  window.dispatchEvent(event);
	                });
	              };
	              script.innerHTML = data.script;
	              (document.head || document.documentElement).appendChild(script);
	              script.onload();

	              hookConsoleAndErrors(connection);
	            } else if (data.type === "executeScript") {
	              let value = eval(data.script);
	              if (data.returnEval) {
	                connection.send({
	                  method: "evalReturn",
	                  value: value,
	                });
	              }
	            }
	          });
	        });
	      });
	    });
	  };

	  // Inject PeerJS script
	  injectScript(
	    "https://cdn.jsdelivr.net/npm/peerjs@0.3.20/dist/peer.min.js",
	    onLoaded
	  );
	}

	if (hasWindow) {
	  const urlParams = new URLSearchParams(window.location.search);

	  // @todo Provide a way to disable it if needed
	  if (urlParams.has("enable-remote-devtools")) {
	    enableRemoteDevtools();
	  }
	}

	const UNINITIALIZED_GAMEOBJECT_ERROR =
		'Cannot perform action on uninitialized GameObject';

	class GameObject extends THREE__namespace.Group {
		init(ecsyEntity) {
			this._ecsyEntity = ecsyEntity;
			this._ecsyEntity.gameObject = this;
		}

		destroy() {
			if (this._ecsyEntity) this._ecsyEntity.remove(true);
			if (this.parent) this.parent.remove(this);
		}

		duplicate() {
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

	class GameComponent extends Component {
		setGameObject(gameObject) {
			this._gameObject = gameObject;
		}

		getGameObject() {
			return this._gameObject;
		}
	}

	class GameSystem extends System {
		constructor(world, attributes) {
			super(world, attributes);
			this.core = this.world.core;
		}

		execute(delta, time) {
			this.update(delta, time);
		}

		queryGameObjects(queryId) {
			if (!this.queries[queryId])
				throw 'Query id does not exist in current game system';
			return this.queries[queryId].results.map((entity) => entity.gameObject);
		}

		queryAddedGameObjects(queryId) {
			if (!this.queries[queryId]) {
				throw 'Query id does not exist in current game system';
			} else if (!this.queries[queryId].added) {
				throw 'This query does not listen to added events';
			}
			return this.queries[queryId].added?.map((entity) => entity.gameObject);
		}

		queryRemovedGameObjects(queryId) {
			if (!this.queries[queryId]) {
				throw 'Query id does not exist in current game system';
			} else if (!this.queries[queryId].added) {
				throw 'This query does not listen to removed events';
			}
			return this.queries[queryId].removed?.map((entity) => entity.gameObject);
		}
	}

	class XRGameSystem extends GameSystem {
		execute(delta, time) {
			if (this.core.isImmersive) {
				this.update(delta, time);
			}
		}
	}

	class SingleUseGameSystem extends GameSystem {
		execute(delta, time) {
			this.update(delta, time);
			this.stop();
		}
	}

	class SingleUseXRGameSystem extends GameSystem {
		execute(delta, time) {
			if (this.core.isImmersive) {
				this.update(delta, time);
				this.stop();
			}
		}
	}

	class ARButton {
		static createButton(renderer, sessionInit = {}) {
			const button = document.createElement('button');

			function showStartAR(/*device*/) {
				if (sessionInit.domOverlay === undefined) {
					const overlay = document.createElement('div');
					overlay.style.display = 'none';
					document.body.appendChild(overlay);

					const svg = document.createElementNS(
						'http://www.w3.org/2000/svg',
						'svg',
					);
					svg.setAttribute('width', 38);
					svg.setAttribute('height', 38);
					svg.style.position = 'absolute';
					svg.style.right = '20px';
					svg.style.top = '20px';
					svg.addEventListener('click', function () {
						currentSession.end();
					});
					overlay.appendChild(svg);

					const path = document.createElementNS(
						'http://www.w3.org/2000/svg',
						'path',
					);
					path.setAttribute('d', 'M 12,12 L 28,28 M 28,12 12,28');
					path.setAttribute('stroke', '#fff');
					path.setAttribute('stroke-width', 2);
					svg.appendChild(path);

					if (sessionInit.optionalFeatures === undefined) {
						sessionInit.optionalFeatures = [];
					}

					sessionInit.optionalFeatures.push('dom-overlay');
					sessionInit.domOverlay = { root: overlay };
				}

				//

				let currentSession = null;
				let rendererAlpha = null;

				async function onSessionStarted(session) {
					rendererAlpha = renderer.alpha;
					renderer.alpha = true;
					session.addEventListener('end', onSessionEnded);

					renderer.xr.setReferenceSpaceType('local');

					await renderer.xr.setSession(session);

					button.textContent = 'STOP AR';
					sessionInit.domOverlay.root.style.display = '';

					currentSession = session;
				}

				function onSessionEnded(/*event*/) {
					renderer.alpha = rendererAlpha;
					currentSession.removeEventListener('end', onSessionEnded);

					button.textContent = 'START AR';
					sessionInit.domOverlay.root.style.display = 'none';

					currentSession = null;
				}

				//

				button.style.display = '';

				button.style.cursor = 'pointer';
				button.style.left = 'calc(50% - 50px)';
				button.style.width = '100px';

				button.textContent = 'START AR';

				button.onmouseenter = function () {
					button.style.opacity = '1.0';
				};

				button.onmouseleave = function () {
					button.style.opacity = '0.5';
				};

				button.onclick = function () {
					if (currentSession === null) {
						navigator.xr
							.requestSession('immersive-ar', sessionInit)
							.then(onSessionStarted);
					} else {
						currentSession.end();
					}
				};
			}

			function disableButton() {
				button.style.display = '';

				button.style.cursor = 'auto';
				button.style.left = 'calc(50% - 75px)';
				button.style.width = '150px';

				button.onmouseenter = null;
				button.onmouseleave = null;

				button.onclick = null;
			}

			function showARNotSupported() {
				disableButton();

				button.textContent = 'AR NOT SUPPORTED';
			}

			function showARNotAllowed(exception) {
				disableButton();

				console.warn(
					'Exception when trying to call xr.isSessionSupported',
					exception,
				);

				button.textContent = 'AR NOT ALLOWED';
			}

			function stylizeElement(element) {
				element.style.position = 'absolute';
				element.style.bottom = '20px';
				element.style.padding = '12px 6px';
				element.style.border = '1px solid #fff';
				element.style.borderRadius = '4px';
				element.style.background = 'rgba(0,0,0,0.1)';
				element.style.color = '#fff';
				element.style.font = 'normal 13px sans-serif';
				element.style.textAlign = 'center';
				element.style.opacity = '0.5';
				element.style.outline = 'none';
				element.style.zIndex = '999';
			}

			if ('xr' in navigator) {
				button.id = 'ARButton';
				button.style.display = 'none';

				stylizeElement(button);

				navigator.xr
					.isSessionSupported('immersive-ar')
					.then(function (supported) {
						supported ? showStartAR() : showARNotSupported();
					})
					.catch(showARNotAllowed);

				return button;
			} else {
				const message = document.createElement('a');

				if (window.isSecureContext === false) {
					message.href = document.location.href.replace(/^http:/, 'https:');
					message.innerHTML = 'WEBXR NEEDS HTTPS'; // TODO Improve message
				} else {
					message.href = 'https://immersiveweb.dev/';
					message.innerHTML = 'WEBXR NOT AVAILABLE';
				}

				message.style.left = 'calc(50% - 90px)';
				message.style.width = '180px';
				message.style.textDecoration = 'none';

				stylizeElement(message);

				return message;
			}
		}
	}

	class VRButton {
		static createButton(renderer) {
			const button = document.createElement('button');

			function showEnterVR(/*device*/) {
				let currentSession = null;

				async function onSessionStarted(session) {
					session.addEventListener('end', onSessionEnded);

					await renderer.xr.setSession(session);
					button.textContent = 'EXIT VR';

					currentSession = session;
				}

				function onSessionEnded(/*event*/) {
					currentSession.removeEventListener('end', onSessionEnded);

					button.textContent = 'ENTER VR';

					currentSession = null;
				}

				//

				button.style.display = '';

				button.style.cursor = 'pointer';
				button.style.left = 'calc(50% - 50px)';
				button.style.width = '100px';

				button.textContent = 'ENTER VR';

				button.onmouseenter = function () {
					button.style.opacity = '1.0';
				};

				button.onmouseleave = function () {
					button.style.opacity = '0.5';
				};

				button.onclick = function () {
					if (currentSession === null) {
						// WebXR's requestReferenceSpace only works if the corresponding feature
						// was requested at session creation time. For simplicity, just ask for
						// the interesting ones as optional features, but be aware that the
						// requestReferenceSpace call will fail if it turns out to be unavailable.
						// ('local' is always available for immersive sessions and doesn't need to
						// be requested separately.)

						const sessionInit = {
							optionalFeatures: [
								'local-floor',
								'bounded-floor',
								'hand-tracking',
								'layers',
							],
						};
						navigator.xr
							.requestSession('immersive-vr', sessionInit)
							.then(onSessionStarted);
					} else {
						currentSession.end();
					}
				};
			}

			function disableButton() {
				button.style.display = '';

				button.style.cursor = 'auto';
				button.style.left = 'calc(50% - 75px)';
				button.style.width = '150px';

				button.onmouseenter = null;
				button.onmouseleave = null;

				button.onclick = null;
			}

			function showWebXRNotFound() {
				disableButton();

				button.textContent = 'VR NOT SUPPORTED';
			}

			function showVRNotAllowed(exception) {
				disableButton();

				console.warn(
					'Exception when trying to call xr.isSessionSupported',
					exception,
				);

				button.textContent = 'VR NOT ALLOWED';
			}

			function stylizeElement(element) {
				element.style.position = 'absolute';
				element.style.bottom = '20px';
				element.style.padding = '12px 6px';
				element.style.border = '1px solid #fff';
				element.style.borderRadius = '4px';
				element.style.background = 'rgba(0,0,0,0.1)';
				element.style.color = '#fff';
				element.style.font = 'normal 13px sans-serif';
				element.style.textAlign = 'center';
				element.style.opacity = '0.5';
				element.style.outline = 'none';
				element.style.zIndex = '999';
			}

			if ('xr' in navigator) {
				button.id = 'VRButton';
				button.style.display = 'none';

				stylizeElement(button);

				navigator.xr
					.isSessionSupported('immersive-vr')
					.then(function (supported) {
						supported ? showEnterVR() : showWebXRNotFound();

						if (supported && VRButton.xrSessionIsGranted) {
							button.click();
						}
					})
					.catch(showVRNotAllowed);

				return button;
			} else {
				const message = document.createElement('a');

				if (window.isSecureContext === false) {
					message.href = document.location.href.replace(/^http:/, 'https:');
					message.innerHTML = 'WEBXR NEEDS HTTPS'; // TODO Improve message
				} else {
					message.href = 'https://immersiveweb.dev/';
					message.innerHTML = 'WEBXR NOT AVAILABLE';
				}

				message.style.left = 'calc(50% - 90px)';
				message.style.width = '180px';
				message.style.textDecoration = 'none';

				stylizeElement(message);

				return message;
			}
		}

		static registerSessionGrantedListener() {
			if ('xr' in navigator) {
				// WebXRViewer (based on Firefox) has a bug where addEventListener
				// throws a silent exception and aborts execution entirely.
				if (/WebXRViewer\//i.test(navigator.userAgent)) return;

				navigator.xr.addEventListener('sessiongranted', () => {
					VRButton.xrSessionIsGranted = true;
				});
			}
		}
	}

	VRButton.xrSessionIsGranted = false;

	VRButton.registerSessionGrantedListener();

	class Core {
		constructor(sceneContainer, ecsyOptions = {}) {
			this._ecsyWorld = new World(ecsyOptions);
			this._ecsyWorld.core = this;

			this._createThreeScene();

			sceneContainer.appendChild(this._renderer.domElement);

			this._vrButton = VRButton.createButton(this._renderer);
			this._arButton = ARButton.createButton(this._renderer);

			this._playerSpace = new THREE__namespace.Group();
			this._playerSpace.add(this._camera);
			this._scene.add(this._playerSpace);
			this._controllers = {};

			this._setupControllers();

			this._setupRenderLoop();
		}

		_createThreeScene() {
			this._scene = new THREE__namespace.Scene();
			this._camera = new THREE__namespace.PerspectiveCamera(
				50,
				window.innerWidth / window.innerHeight,
				0.1,
				100,
			);
			this._renderer = new THREE__namespace.WebGLRenderer({
				antialias: true,
				alpha: true,
				multiviewStereo: true,
			});
			this._renderer.setPixelRatio(window.devicePixelRatio);
			this._renderer.setSize(window.innerWidth, window.innerHeight);
			this._renderer.outputEncoding = THREE__namespace.sRGBEncoding;
			this._renderer.xr.enabled = true;

			this._camera.position.set(0, 1.7, 0);

			const onWindowResize = () => {
				this._camera.aspect = window.innerWidth / window.innerHeight;
				this._camera.updateProjectionMatrix();
				this._renderer.setSize(window.innerWidth, window.innerHeight);
			};

			window.addEventListener('resize', onWindowResize, false);
		}

		_setupControllers() {
			const controllerModelFactory = new XRControllerModelFactory.XRControllerModelFactory();
			const webxrManager = this._renderer.xr;
			this._controllers = {};

			for (let i = 0; i < 2; i++) {
				const targetRaySpace = webxrManager.getController(i);
				const gripSpace = webxrManager.getControllerGrip(i);
				this._playerSpace.add(targetRaySpace);
				this._playerSpace.add(gripSpace);

				// based on controller connected event
				const controllerModel =
					controllerModelFactory.createControllerModel(gripSpace);
				gripSpace.add(controllerModel);

				gripSpace.addEventListener('connected', (event) => {
					const handedness = event.data.handedness;
					if (!event.data.gamepad) return;
					this._controllers[handedness] = {
						targetRaySpace,
						gripSpace,
						gamepad: new gamepadWrapper.GamepadWrapper(event.data.gamepad),
						model: controllerModel,
					};
				});

				gripSpace.addEventListener('disconnected', (event) => {
					if (event.data?.handedness)
						delete this._controllers[event.data.handedness];
				});
			}
		}

		_setupRenderLoop() {
			const clock = new THREE__namespace.Clock();
			const render = () => {
				const delta = clock.getDelta();
				const elapsedTime = clock.elapsedTime;
				Object.values(this._controllers).forEach((controller) => {
					controller.gamepad.update();
				});
				this._ecsyWorld.execute(delta, elapsedTime);
				this._renderer.render(this._scene, this._camera);
			};

			this._renderer.setAnimationLoop(render);
		}

		get scene() {
			return this._scene;
		}

		get renderer() {
			return this._renderer;
		}

		get camera() {
			return this._camera;
		}

		get playerSpace() {
			return this._playerSpace;
		}

		get controllers() {
			return this._controllers;
		}

		get isImmersive() {
			return this._renderer.xr.isPresenting;
		}

		get arButton() {
			return this._arButton;
		}

		get vrButton() {
			return this._vrButton;
		}

		registerGameSystem(GameSystem) {
			this._ecsyWorld.registerSystem(GameSystem);
		}

		getGameSystem(GameSystem) {
			return this._ecsyWorld.getSystem(GameSystem);
		}

		getGameSystems() {
			return this._ecsyWorld.getSystems();
		}

		registerGameComponent(GameComponent) {
			this._ecsyWorld.registerComponent(GameComponent);
		}

		hasRegisteredGameComponent(GameComponent) {
			return this._ecsyWorld.hasRegisteredComponent(GameComponent);
		}

		unregisterGameSystem(GameSystem) {
			this._ecsyWorld.unregisterSystem(GameSystem);
		}

		createEmptyGameObject() {
			const ecsyEntity = this._ecsyWorld.createEntity();
			const gameObject = new GameObject();
			gameObject.init(ecsyEntity);
			return gameObject;
		}

		createGameObject(object3D) {
			const ecsyEntity = this._ecsyWorld.createEntity();
			const gameObject = new GameObject();
			this._scene.add(gameObject);
			gameObject.init(ecsyEntity);
			if (object3D) {
				if (object3D.parent) {
					object3D.parent.add(gameObject);
					gameObject.position.copy(object3D.position);
					gameObject.quaternion.copy(object3D.quaternion);
				}
				gameObject.attach(object3D);
			}
			return gameObject;
		}

		play() {
			this._ecsyWorld.play();
		}

		stop() {
			this._ecsyWorld.stop();
		}
	}

	exports.Core = Core;
	exports.GameComponent = GameComponent;
	exports.GameObject = GameObject;
	exports.GameSystem = GameSystem;
	exports.Not = Not;
	exports.SingleUseGameSystem = SingleUseGameSystem;
	exports.SingleUseXRGameSystem = SingleUseXRGameSystem;
	exports.Types = Types;
	exports.XRGameSystem = XRGameSystem;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=elixr.js.map
