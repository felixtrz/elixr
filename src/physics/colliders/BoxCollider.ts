import { Collider, PRIVATE } from '../Collider';

import { BoxGeometry } from 'three';
import { PhysicMaterial } from '../Material';
import { Physics } from '../Physics';

export class BoxCollider extends Collider {
	constructor(
		width: number,
		height: number,
		depth: number,
		trigger = false,
		material = new PhysicMaterial(),
	) {
		super(material);
		const RAPIER = Physics.getInstance().module;
		this[PRIVATE].colliderDesc = RAPIER.ColliderDesc.cuboid(
			width / 2,
			height / 2,
			depth / 2,
		).setSensor(trigger);
		this.geometry = new BoxGeometry(width, height, depth);
	}
}
