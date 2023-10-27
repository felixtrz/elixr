import { Collider, PRIVATE } from '../Collider';

import { CapsuleGeometry } from 'three';
import { Physics } from '../Physics';
import { PhysicsMaterial } from '../Material';

export class CapsuleCollider extends Collider {
	constructor(
		radius = 0.5,
		height = 1,
		trigger = false,
		material = new PhysicsMaterial(),
	) {
		super(material);
		const RAPIER = Physics.getInstance().module;
		this[PRIVATE].colliderDesc = RAPIER.ColliderDesc.capsule(
			(height + radius * 2) / 2,
			radius,
		).setSensor(trigger);
		this.syncProperties();
		this.geometry = new CapsuleGeometry(radius, height, 4, 12);
	}
}
