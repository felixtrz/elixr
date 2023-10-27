import { Collider, PRIVATE } from '../Collider';

import { ConeGeometry } from 'three';
import { PhysicMaterial } from '../Material';
import { Physics } from '../Physics';

export class ConeCollider extends Collider {
	constructor(
		radius = 0.5,
		height = 1,
		trigger = false,
		material = new PhysicMaterial(),
	) {
		super(material);
		const RAPIER = Physics.getInstance().module;
		this[PRIVATE].colliderDesc = RAPIER.ColliderDesc.cone(
			height / 2,
			radius,
		).setSensor(trigger);
		this.geometry = new ConeGeometry(radius, height, 12);
	}
}
