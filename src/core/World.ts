import { World as EcsyWorld, WorldOptions } from 'ecsy';
import { PhysicsConfig, PhysicsSystem } from '../physics/PhysicsSystem';

import { ColliderSet } from '../physics/ColliderSetComponent';
import { GameObject } from './GameObject';
import { RigidBody } from '../physics/RigidBodyComponent';
import { THREE } from '../graphics/CustomTHREE';

export class World extends EcsyWorld {
	threeScene: THREE.Scene;
	rapierWorld: import('@dimforge/rapier3d/rapier').World;
	game: GameObject;
	core: import('./Core').Core;

	constructor(
		options: WorldOptions = {},
		RAPIER: typeof import('@dimforge/rapier3d/rapier'),
	) {
		super(options);
		this.threeScene = new THREE.Scene();
		this.game = new GameObject(this);

		this.registerComponent(RigidBody);
		this.registerComponent(ColliderSet);
		this.registerComponent(PhysicsSystem.systemConfig);
		this.game.addComponent(PhysicsSystem.systemConfig);
		const physicsConfig = this.game.getMutableComponent(
			PhysicsSystem.systemConfig,
		) as PhysicsConfig;
		this.registerSystem(PhysicsSystem, {
			priority: Infinity,
			config: physicsConfig,
		});
		physicsConfig.gravity = new THREE.Vector3(0, 0, 0);
		physicsConfig.world = new RAPIER.World(physicsConfig.gravity);
		this.rapierWorld = physicsConfig.world;
	}
}
