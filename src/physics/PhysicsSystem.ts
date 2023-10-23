import { RigidBody, RigidBodyType } from '@dimforge/rapier3d';

import { Collider } from './ColliderComponent';
import { Core } from '../ecs/Core';
import { GameSystem } from '../ecs/GameSystem';
import { PrimitiveShape } from './ColliderShapes';
import { RigidBody as RigidBodyComponent } from './RigidBodyComponent';
import { SystemConfig } from '../ecs/GameComponent';
import { THREE } from '../graphics/Three';
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

	private _vec3 = new THREE.Vector3();

	private _quat = new THREE.Quaternion();

	init() {
		this._config = this.config as PhysicsConfig;
	}

	update(delta: number, _time: number): void {
		if (!this._config.world) return;
		// let world = new this.RAPIER.World(gravity);
		setRapierVector3(this._config.gravity, this._config.world.gravity);

		this.queryAddedGameObjects('rigidBodies').forEach((gameObject) => {
			const rigidBody = gameObject.getMutableComponent(
				RigidBodyComponent,
			) as RigidBodyComponent;
			gameObject.getWorldPosition(this._vec3);
			gameObject.getWorldQuaternion(this._quat);
			rigidBody.body.setTranslation(this._vec3, true);
			rigidBody.body.setRotation(this._quat, true);
		});

		this._preStep();
		this._config.world.timestep = delta;
		this._config.world.step();
		this._postStep();
	}

	_preStep() {
		const activeBodies: RigidBody[] = [];
		this.queryGameObjects('rigidBodies').forEach((gameObject) => {
			const rigidBody = gameObject.getMutableComponent(
				RigidBodyComponent,
			) as RigidBodyComponent;
			if (rigidBody.bodyType == RigidBodyType.KinematicPositionBased) {
				gameObject.getWorldPosition(this._vec3);
				gameObject.getWorldQuaternion(this._quat);
				rigidBody.body.setTranslation(this._vec3, true);
				rigidBody.body.setRotation(this._quat, true);
			}

			const collider = gameObject.getMutableComponent(Collider) as Collider;
			if ((collider.shape as PrimitiveShape).isPrimitiveShape) {
				if (!collider.scale.equals(gameObject.scale)) {
					collider.setScale(gameObject.scale);
				}
			}

			activeBodies.push(rigidBody.body);
		});

		this._config.world.bodies
			.getAll()
			.filter((body) => {
				return !activeBodies.includes(body);
			})
			.forEach((body) => {
				this._config.world.removeRigidBody(body);
			});
	}

	_postStep() {
		this.queryGameObjects('rigidBodies').forEach((gameObject) => {
			const rigidBody = gameObject.getMutableComponent(
				RigidBodyComponent,
			) as RigidBodyComponent;
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
		components: [RigidBodyComponent],
		listen: {
			added: true,
		},
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
