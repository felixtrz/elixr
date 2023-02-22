import { GameComponent } from '../../core/GameComponent';
import { Types } from 'ecsy';

export class MeshRenderer extends GameComponent<any> {
	get mesh() {
		// @ts-ignore
		return this.meshRef;
	}

	get geometry() {
		return this.mesh.geometry;
	}

	get material() {
		return this.mesh.material;
	}

	onAdd(): void {
		this.gameObject.addThreeObjects(this.mesh);
	}

	onRemove(): void {
		this.gameObject.remove(this.mesh);
	}
}

MeshRenderer.schema = {
	meshRef: { type: Types.Ref },
};
