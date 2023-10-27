import { Collider, PRIVATE } from '../Collider';

import { Physics } from '../Physics';
import { PhysicsMaterial } from '../Material';
import { SphereGeometry } from 'three';

export class SphereCollider extends Collider {
	constructor(radius = 0.5, trigger = false, material = new PhysicsMaterial()) {
		super(material);
		const RAPIER = Physics.getInstance().module;
		this[PRIVATE].colliderDesc =
			RAPIER.ColliderDesc.ball(radius).setSensor(trigger);
		this.syncProperties();
		this.geometry = new SphereGeometry(radius, 12, 6);
	}
}
