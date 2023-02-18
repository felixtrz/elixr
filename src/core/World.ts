import * as Physics from 'cannon-es';

import { World as EcsyWorld, WorldOptions } from 'ecsy';
import {
	PhysicsConfig,
	RigidBodyPhysicsSystem,
} from '../physics/RigidBodyPhysicsSystem';

import { GameObject } from './GameObject';
import { RigidBodyComponent } from '../physics/PhysicsComponents';
import { THREE } from '../graphics/CustomTHREE';

export class World extends EcsyWorld {
	threeScene: THREE.Scene;
	game: GameObject;

	constructor(options: WorldOptions = {}) {
		super(options);
		this.game = new GameObject();
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
