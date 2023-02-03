import * as Physics from 'cannon-es';

import { World as EcsyWorld, WorldOptions } from 'ecsy';
import { ExtendedEntity, GameObject } from './GameObject';
import {
	PhysicsConfig,
	RigidBodyPhysicsSystem,
} from './physics/RigidBodyPhysicsSystem';

import { Core } from './Core';
import { RigidBodyComponent } from './physics/PhysicsComponents';
import { THREE } from './three/CustomTHREE';

export class World extends EcsyWorld {
	threeScene: THREE.Scene;
	core: Core;
	game: GameObject;

	constructor(options: WorldOptions = {}, core: Core) {
		super(options);
		this.core = core;
		this.game = new GameObject();
		this.game._init(this.createEntity() as ExtendedEntity);
		this.threeScene = new THREE.Scene();

		this.registerComponent(RigidBodyComponent);
		this.registerComponent(RigidBodyPhysicsSystem.systemConfig);
		this.game.addComponent(RigidBodyPhysicsSystem.systemConfig);
		const physicsConfig = this.game.getMutableComponent(
			RigidBodyPhysicsSystem.systemConfig,
		) as PhysicsConfig;
		this.registerSystem(RigidBodyPhysicsSystem, {
			priority: Infinity,
			config: physicsConfig,
		});
		physicsConfig.gravity = new THREE.Vector3(0, 0, 0);
		physicsConfig.world = new Physics.World();
		physicsConfig.world.broadphase = new Physics.NaiveBroadphase();
	}
}
