import { Collider, PRIVATE } from '../Collider';

import { PhysicMaterial } from '../Material';
import { Physics } from '../Physics';
import { SphereGeometry } from 'three';

export class SphereCollider extends Collider {
	constructor(radius = 0.5, trigger = false, material = new PhysicMaterial()) {
		super(material);
		const RAPIER = Physics.getInstance().module;
		this[PRIVATE].colliderDesc =
			RAPIER.ColliderDesc.ball(radius).setSensor(trigger);
		this.geometry = new SphereGeometry(radius, 12, 6);
	}
}
