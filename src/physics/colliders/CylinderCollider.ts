import { Collider, PRIVATE } from '../Collider';

import { CylinderGeometry } from 'three';
import { Physics } from '../Physics';
import { PhysicsMaterial } from '../Material';

export class CylinderCollider extends Collider {
	constructor(
		physics: Physics,
		radius = 0.5,
		height = 1,
		trigger = false,
		material = new PhysicsMaterial(),
	) {
		super(physics, material);
		const RAPIER = Physics.module;
		this[PRIVATE].colliderDesc = RAPIER.ColliderDesc.cylinder(
			height / 2,
			radius,
		).setSensor(trigger);
		this.syncProperties();
		this.geometry = new CylinderGeometry(radius, radius, height, 12, 1, true);
	}
}
