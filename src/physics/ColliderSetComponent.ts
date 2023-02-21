import { Core } from '../core/Core';
import { GameComponent } from '../core/GameComponent';
import { RigidBody } from './RigidBodyComponent';

class ColliderSetComponent extends GameComponent<any> {}

export class ColliderSet extends ColliderSetComponent {
	colliders: import('@dimforge/rapier3d/rapier').Collider[] = [];

	addCollider(desc: import('@dimforge/rapier3d/rapier').ColliderDesc) {
		const rapierWorld = Core.getInstance().physicsWorld;
		if (this.gameObject.hasComponent(RigidBody)) {
			const rigidBody = (this.gameObject.getComponent(RigidBody) as RigidBody)
				.body;
			const collider = rapierWorld.createCollider(desc, rigidBody);
			this.colliders.push(collider);
		} else {
			const collider = rapierWorld.createCollider(desc);
			this.colliders.push(collider);
		}
	}

	onRemove(): void {
		const rapierWorld = Core.getInstance().physicsWorld;
		this.colliders.forEach((collider) => {
			rapierWorld.removeCollider(collider, true);
		});
	}
}
