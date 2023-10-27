import { Collider, PRIVATE } from '../Collider';

import { CapsuleGeometry } from 'three';
import { PhysicMaterial } from '../Material';
import { Physics } from '../Physics';

export class CapsuleCollider extends Collider {
	constructor(
		radius = 0.5,
		height = 1,
		trigger = false,
		material = new PhysicMaterial(),
	) {
		super(material);
		const RAPIER = Physics.getInstance().module;
		this[PRIVATE].colliderDesc = RAPIER.ColliderDesc.capsule(
			(height + radius * 2) / 2,
			radius,
		).setSensor(trigger);
		this.geometry = new CapsuleGeometry(radius, height, 4, 12);
	}
}
