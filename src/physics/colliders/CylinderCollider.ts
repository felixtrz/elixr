import { Collider, PRIVATE } from '../Collider';

import { CylinderGeometry } from 'three';
import { PhysicMaterial } from '../Material';
import { Physics } from '../Physics';

export class CylinderCollider extends Collider {
	constructor(
		radius = 0.5,
		height = 1,
		trigger = false,
		material = new PhysicMaterial(),
	) {
		super(material);
		const RAPIER = Physics.getInstance().module;
		this[PRIVATE].colliderDesc = RAPIER.ColliderDesc.cylinder(
			height / 2,
			radius,
		).setSensor(trigger);
		this.geometry = new CylinderGeometry(radius, radius, height, 12, 1, true);
	}
}
