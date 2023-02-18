import { GameComponent } from '../../core/GameComponent';
import { Types } from 'ecsy';

class MeshRenderer extends GameComponent<any> {
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
}

MeshRenderer.schema = {
	meshRef: { type: Types.Ref },
};
