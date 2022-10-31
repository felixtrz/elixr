import { ComplexObject } from './ComplexObject';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { PhysicsOptions } from './PhysicsObject';
import { THREE } from '../index';

export class GLTFModelLoader {
	private static _instance: GLTFLoader;

	public static init(renderer: THREE.WebGLRenderer) {
		const MANAGER = new THREE.LoadingManager();
		const THREE_PATH = `https://unpkg.com/three@0.${THREE.REVISION}.x`;
		const DRACO_LOADER = new DRACOLoader(MANAGER).setDecoderPath(
			`${THREE_PATH}/examples/js/libs/draco/gltf/`,
		);
		const KTX2_LOADER = new KTX2Loader(MANAGER).setTranscoderPath(
			`${THREE_PATH}/examples/js/libs/basis/`,
		);
		this._instance = new GLTFLoader(MANAGER)
			.setCrossOrigin('anonymous')
			.setDRACOLoader(DRACO_LOADER)
			.setKTX2Loader(KTX2_LOADER.detectSupport(renderer));
	}

	public static getInstance() {
		if (!this._instance) {
			throw 'GLTFModelLoader not initialized';
		}
		return this._instance;
	}
}

export class GLTFObject extends ComplexObject {
	private _placeHolderObject: THREE.Object3D;
	private _colliderVisible: boolean = false;
	private _onLoad?: (model: THREE.Object3D) => void;

	constructor(
		modelURL: string,
		physicsOptions: PhysicsOptions = {},
		generateBody = true,
	) {
		super(physicsOptions);
		this._placeHolderObject = new THREE.Object3D();
		this.add(this._placeHolderObject);
		const loader = GLTFModelLoader.getInstance();
		loader.load(modelURL, (gltf) => {
			const model = gltf.scene;
			if (this._onLoad) {
				this._onLoad(model);
			}
			model.position.copy(this._placeHolderObject.position);
			model.quaternion.copy(this._placeHolderObject.quaternion);
			model.visible = this._placeHolderObject.visible;
			this.add(model);
			this.remove(this._placeHolderObject);
			this._placeHolderObject = model;
			if (generateBody) {
				this.generateConvexBody();
				this._convexHull.visible = this._colliderVisible;
			}
		});
	}

	onLoad(callback: (model: THREE.Object3D) => void) {
		this._onLoad = callback;
	}

	set colliderVisible(visible: boolean) {
		this._colliderVisible = visible;
	}
}
