import * as CANNON from 'cannon-es';

import { World as EcsyWorld, WorldOptions } from 'ecsy';
import {
	GameObject,
	PhysicsConfig,
	RigidBodyComponent,
	RigidBodyPhysicsSystem,
	THREE,
} from './index';

import { Core } from './Core';
import { ExtendedEntity } from './GameObject';

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
		physicsConfig.world = new CANNON.World();
		physicsConfig.world.broadphase = new CANNON.NaiveBroadphase();
	}
}
