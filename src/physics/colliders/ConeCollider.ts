import { Collider, PRIVATE } from '../Collider';

import { ConeGeometry } from 'three';
import { Physics } from '../Physics';
import { PhysicsMaterial } from '../Material';

export class ConeCollider extends Collider {
	constructor(
		radius = 0.5,
		height = 1,
		trigger = false,
		material = new PhysicsMaterial(),
	) {
		super(material);
		const RAPIER = Physics.module;
		this[PRIVATE].colliderDesc = RAPIER.ColliderDesc.cone(
			height / 2,
			radius,
		).setSensor(trigger);
		this.syncProperties();
		this.geometry = new ConeGeometry(radius, height, 12);
	}
}
