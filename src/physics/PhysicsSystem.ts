import { GameSystem } from '../core/GameSystem';
import { MeshRenderer } from '../graphics/meshes/MeshRendererComponent';
import { RigidBody } from './RigidBodyComponent';
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

	init() {
		this._config = this.config as PhysicsConfig;
	}

	update(_delta: number, _time: number): void {
		if (!this._config.world) return;
		// let world = new this.RAPIER.World(gravity);
		setRapierVector3(this._config.gravity, this._config.world.gravity);
		this._config.world.step();
	}

	_postStep() {
		this.queryGameObjects('rigidBodies').forEach((gameObject) => {
			const rigidBody = gameObject.getMutableComponent(RigidBody) as RigidBody;
			const meshRenderer = gameObject.getMutableComponent(
				MeshRenderer,
			) as MeshRenderer;
			if (rigidBody.body && meshRenderer) {
				meshRenderer.mesh.position.copy(rigidBody.position);
				meshRenderer.mesh.quaternion.copy(rigidBody.rotation);
			}
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
