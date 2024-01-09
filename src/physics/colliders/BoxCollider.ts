import { Collider, PRIVATE } from '../Collider';

import { BoxGeometry } from 'three';
import { Physics } from '../Physics';
import { PhysicsMaterial } from '../Material';

export class BoxCollider extends Collider {
	constructor(
		physics: Physics,
		width: number,
		height: number,
		depth: number,
		trigger = false,
		material = new PhysicsMaterial(),
	) {
		super(physics, material);
		const RAPIER = Physics.module;
		this[PRIVATE].colliderDesc = RAPIER.ColliderDesc.cuboid(
			width / 2,
			height / 2,
			depth / 2,
		).setSensor(trigger);
		this.syncProperties();
		this.geometry = new BoxGeometry(width, height, depth);
	}
}
