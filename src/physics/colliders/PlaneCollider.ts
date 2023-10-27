import { Collider, PRIVATE } from '../Collider';

import { PhysicMaterial } from '../Material';
import { Physics } from '../Physics';
import { PlaneGeometry } from 'three';

export class PlaneCollider extends Collider {
	constructor(
		width: number,
		height: number,
		trigger = false,
		material = new PhysicMaterial(),
	) {
		super(material);
		const RAPIER = Physics.getInstance().module;
		this[PRIVATE].colliderDesc = RAPIER.ColliderDesc.cuboid(
			width / 2,
			height / 2,
			0,
		).setSensor(trigger);
		this.geometry = new PlaneGeometry(width, height);
	}
}
