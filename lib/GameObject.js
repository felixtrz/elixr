"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameObject = void 0;
const THREE = __importStar(require("three"));
const UNINITIALIZED_GAMEOBJECT_ERROR = 'Cannot perform action on uninitialized GameObject';
class GameObject extends THREE.Group {
    ecsyEntity;
    _init(ecsyEntity) {
        this.ecsyEntity = ecsyEntity;
        this.ecsyEntity.gameObject = this;
    }
    duplicate() {
        if (!this.ecsyEntity)
            throw UNINITIALIZED_GAMEOBJECT_ERROR;
        const newGameObject = super.clone(true);
        const newEntity = this.ecsyEntity.clone();
        newGameObject._init(newEntity);
        return newGameObject;
    }
    addComponent(GameComponent, values) {
        if (!this.ecsyEntity)
            throw UNINITIALIZED_GAMEOBJECT_ERROR;
        this.ecsyEntity.addComponent(GameComponent, values);
        const newComponent = this.getMutableComponent(GameComponent);
        newComponent.gameObject = this;
        return newComponent;
    }
    getComponent(GameComponent, includeRemoved) {
        if (!this.ecsyEntity)
            throw UNINITIALIZED_GAMEOBJECT_ERROR;
        return this.ecsyEntity.getComponent(GameComponent, includeRemoved);
    }
    getMutableComponent(GameComponent) {
        if (!this.ecsyEntity)
            throw UNINITIALIZED_GAMEOBJECT_ERROR;
        return this.ecsyEntity.getMutableComponent(GameComponent);
    }
    getComponentTypes() {
        if (!this.ecsyEntity)
            throw UNINITIALIZED_GAMEOBJECT_ERROR;
        return this.ecsyEntity.getComponentTypes();
    }
    getComponents() {
        if (!this.ecsyEntity)
            throw UNINITIALIZED_GAMEOBJECT_ERROR;
        return this.ecsyEntity.getComponents();
    }
    getComponentsToRemove() {
        if (!this.ecsyEntity)
            throw UNINITIALIZED_GAMEOBJECT_ERROR;
        return this.ecsyEntity.getComponentsToRemove();
    }
    getRemovedComponent(GameComponent) {
        if (!this.ecsyEntity)
            throw UNINITIALIZED_GAMEOBJECT_ERROR;
        return this.ecsyEntity.getRemovedComponent(GameComponent);
    }
    hasAllComponents(GameComponents) {
        if (!this.ecsyEntity)
            throw UNINITIALIZED_GAMEOBJECT_ERROR;
        return this.ecsyEntity.hasAllComponents(GameComponents);
    }
    hasAnyComponents(GameComponents) {
        if (!this.ecsyEntity)
            throw UNINITIALIZED_GAMEOBJECT_ERROR;
        return this.ecsyEntity.hasAnyComponents(GameComponents);
    }
    hasComponent(GameComponent) {
        if (!this.ecsyEntity)
            throw UNINITIALIZED_GAMEOBJECT_ERROR;
        return this.ecsyEntity.hasComponent(GameComponent);
    }
    removeAllComponents(forceImmediate) {
        if (!this.ecsyEntity)
            throw UNINITIALIZED_GAMEOBJECT_ERROR;
        this.ecsyEntity.removeAllComponents(forceImmediate);
    }
    removeComponent(GameComponent, forceImmediate) {
        if (!this.ecsyEntity)
            throw UNINITIALIZED_GAMEOBJECT_ERROR;
        const component = this.ecsyEntity.getMutableComponent(GameComponent);
        if (component.onRemove)
            component.onRemove();
        this.ecsyEntity.removeComponent(GameComponent, forceImmediate);
    }
}
exports.GameObject = GameObject;
//# sourceMappingURL=GameObject.js.map