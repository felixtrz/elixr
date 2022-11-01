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
	private _colliderVisible: boolean = false;
	private _modelURL: string = '';
	private _onLoad?: (model: THREE.Object3D) => void;
	private _generateBody: boolean;

	constructor(
		modelURL: string = '',
		physicsOptions: PhysicsOptions = {},
		generateBody = true,
	) {
		super(physicsOptions);
		this._modelURL = modelURL;
		this._generateBody = generateBody;
		const placeHolderObject = new THREE.Object3D();
		this.add(placeHolderObject);
		if (!this._modelURL) {
			return;
		}
		const loader = GLTFModelLoader.getInstance();
		loader.load(this._modelURL, (gltf) => {
			const model = gltf.scene;
			if (this._onLoad) {
				this._onLoad(model);
			}
			model.position.copy(placeHolderObject.position);
			model.quaternion.copy(placeHolderObject.quaternion);
			model.visible = placeHolderObject.visible;
			this.add(model);
			this.remove(placeHolderObject);
			if (this._generateBody) {
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

	copy(source: this, recursive?: boolean): this {
		super.copy(source, recursive);
		this._modelURL = source._modelURL;
		this._onLoad = source._onLoad;
		this._colliderVisible = source._colliderVisible;
		return this;
	}

	clone(recursive?: boolean): this {
		return new GLTFObject(this._modelURL, {}, this._generateBody).copy(
			this,
			recursive,
		) as this;
	}
}
