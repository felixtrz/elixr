import { Collider, PRIVATE } from '../Collider';

import { Physics } from '../Physics';
import { PhysicsMaterial } from '../Material';
import { PlaneGeometry } from 'three';

export class PlaneCollider extends Collider {
	constructor(
		physics: Physics,
		width: number,
		height: number,
		trigger = false,
		material = new PhysicsMaterial(),
	) {
		super(physics, material);
		const RAPIER = Physics.module;
		this[PRIVATE].colliderDesc = RAPIER.ColliderDesc.cuboid(
			width / 2,
			height / 2,
			0,
		).setSensor(trigger);
		this.syncProperties();
		this.geometry = new PlaneGeometry(width, height);
	}
}
