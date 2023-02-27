import { Quaternion, Vector3 } from 'three';

import { Core } from '../core/Core';
import { GameSystem } from '../core/GameSystem';
import { RigidBody } from './RigidBodyComponent';
import { RigidBodyType } from '@dimforge/rapier3d';
import { SystemConfig } from '../core/GameComponent';
import { Types } from 'ecsy';

class PhysicsComponent extends SystemConfig {}

PhysicsComponent.schema = {
	gravity: { type: Types.Ref },
	world: { type: Types.Ref },
};

export interface PhysicsConfig extends PhysicsComponent {
	gravity: THREE.Vector3;
	world: import('@dimforge/rapier3d/rapier').World;
}

export class PhysicsSystem extends GameSystem {
	private _config: PhysicsConfig;

	private _vec3 = new Vector3();
	private _quat = new Quaternion();

	init() {
		this._config = this.config as PhysicsConfig;
	}

	update(_delta: number, _time: number): void {
		if (!this._config.world) return;
		// let world = new this.RAPIER.World(gravity);
		setRapierVector3(this._config.gravity, this._config.world.gravity);
		this._preStep();
		this._config.world.step();
		this._postStep();
	}

	_preStep() {
		this.queryGameObjects('rigidBodies').forEach((gameObject) => {
			const rigidBody = gameObject.getMutableComponent(RigidBody) as RigidBody;
			if (rigidBody.bodyType == RigidBodyType.KinematicPositionBased) {
				gameObject.getWorldPosition(this._vec3);
				gameObject.getWorldQuaternion(this._quat);
				rigidBody.body.setTranslation(this._vec3, true);
				rigidBody.body.setRotation(this._quat, true);
			}
		});
	}

	_postStep() {
		this.queryGameObjects('rigidBodies').forEach((gameObject) => {
			const rigidBody = gameObject.getMutableComponent(RigidBody) as RigidBody;
			const parent = gameObject.parent;
			Core.getInstance().scene.attach(gameObject);
			gameObject.position.copy(rigidBody.position);
			gameObject.quaternion.copy(rigidBody.quaternion);
			parent.attach(gameObject);
		});
	}
}

PhysicsSystem.queries = {
	rigidBodies: {
		components: [RigidBody],
	},
};

PhysicsSystem.systemConfig = PhysicsComponent;

const setRapierVector3 = (
	vec3: THREE.Vector3,
	rapierVec3: import('@dimforge/rapier3d/rapier').Vector,
) => {
	rapierVec3.x = vec3.x;
	rapierVec3.y = vec3.y;
	rapierVec3.z = vec3.z;
};
