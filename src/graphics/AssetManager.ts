import {
	CompressedTexture,
	DataTexture,
	EventDispatcher,
	Group,
	ImageLoader,
	LoadingManager,
	REVISION,
	Texture,
	TextureLoader,
	WebGLRenderer,
} from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

export enum ASSET_TYPE {
	GLTF = 'GLTF',
	OBJ = 'OBJ',
	TEXTURE = 'TEXTURE',
	IMAGE = 'IMAGE',
	RGBE = 'RGBE',
	EXR = 'EXR',
	KTX2 = 'KTX2',
	AUDIO = 'AUDIO',
}

export interface AssetDescriptor {
	url: string;
	type: ASSET_TYPE;
	callback: (asset: any) => void;
}

interface LoadEventData {
	type: 'load';
}

interface ProgressEventData {
	type: 'progress';
	url: string;
	loaded: number;
	total: number;
}

interface ErrorEventData {
	type: 'error';
	url: string;
}

type AssetManagerEventMap = {
	load: LoadEventData;
	progress: ProgressEventData;
	error: ErrorEventData;
};

const THREE_PATH = `https://unpkg.com/three@0.${REVISION}.x`;

export const PRIVATE = Symbol('@elixr/graphics/asset-manager');

export class AssetManager extends EventDispatcher<AssetManagerEventMap> {
	/** @ignore */
	[PRIVATE]: {
		loadingManager: LoadingManager;
		dracoLoader: DRACOLoader;
		ktx2Loader: KTX2Loader;
		rgbEloader: RGBELoader;
		exrLoader: EXRLoader;
		gtlfLoader: GLTFLoader;
		objLoader: OBJLoader;
		textureLoader: TextureLoader;
		imageLoader: ImageLoader;
		initialAssetIds: string[];
		assetMap: Map<string, any>;
	} = {
		loadingManager: new LoadingManager(),
		dracoLoader: null,
		ktx2Loader: null,
		gtlfLoader: null,
		objLoader: null,
		textureLoader: null,
		imageLoader: null,
		rgbEloader: null,
		exrLoader: null,
		initialAssetIds: null,
		assetMap: new Map(),
	};

	constructor(
		renderer: WebGLRenderer,
		initialAssets: Record<string, AssetDescriptor>,
	) {
		super();
		this[PRIVATE].dracoLoader = new DRACOLoader(
			this[PRIVATE].loadingManager,
		).setDecoderPath(`${THREE_PATH}/examples/jsm/libs/draco/gltf/`);
		this[PRIVATE].ktx2Loader = new KTX2Loader(
			this[PRIVATE].loadingManager,
		).setTranscoderPath(`${THREE_PATH}/examples/jsm/libs/basis/`);
		this[PRIVATE].gtlfLoader = new GLTFLoader(this[PRIVATE].loadingManager)
			.setCrossOrigin('anonymous')
			.setDRACOLoader(this[PRIVATE].dracoLoader)
			.setKTX2Loader(this[PRIVATE].ktx2Loader.detectSupport(renderer));
		this[PRIVATE].objLoader = new OBJLoader(this[PRIVATE].loadingManager);
		this[PRIVATE].textureLoader = new TextureLoader(
			this[PRIVATE].loadingManager,
		);
		this[PRIVATE].imageLoader = new ImageLoader(this[PRIVATE].loadingManager);
		this[PRIVATE].rgbEloader = new RGBELoader(this[PRIVATE].loadingManager);
		this[PRIVATE].exrLoader = new EXRLoader(this[PRIVATE].loadingManager);

		this[PRIVATE].initialAssetIds = Object.keys(initialAssets);
		for (const [id, descriptor] of Object.entries(initialAssets)) {
			this.loadAsset(id, descriptor);
		}

		this[PRIVATE].loadingManager.onProgress = (
			url: string,
			loaded: number,
			total: number,
		) => {
			const event: ProgressEventData = {
				type: 'progress',
				url,
				loaded,
				total,
			};
			this.dispatchEvent(event);
		};

		this[PRIVATE].loadingManager.onError = (url: string) => {
			const event: ErrorEventData = {
				type: 'error',
				url,
			};
			this.dispatchEvent(event);
		};
	}

	public loadAsset(id: string, descriptor: AssetDescriptor): any {
		switch (descriptor.type) {
			case ASSET_TYPE.GLTF:
				this.loadGLTF(id, descriptor.url, descriptor.callback);
				break;
			case ASSET_TYPE.OBJ:
				this.loadOBJ(id, descriptor.url, descriptor.callback);
				break;
			case ASSET_TYPE.TEXTURE:
				this.loadTexture(id, descriptor.url, descriptor.callback);
				break;
			case ASSET_TYPE.IMAGE:
				this.loadImage(id, descriptor.url, descriptor.callback);
				break;
			case ASSET_TYPE.RGBE:
				this.loadRGBE(id, descriptor.url, descriptor.callback);
				break;
			case ASSET_TYPE.EXR:
				this.loadEXR(id, descriptor.url, descriptor.callback);
				break;
			case ASSET_TYPE.KTX2:
				this.loadKTX2(id, descriptor.url, descriptor.callback);
				break;
			default:
				throw new Error(`Asset type ${descriptor.type} not supported`);
		}
	}

	public getAsset(id: string): any {
		return this[PRIVATE].assetMap.get(id);
	}

	public get initialAssetsLoaded() {
		let loaded = true;
		for (const id of this[PRIVATE].initialAssetIds) {
			loaded = loaded && this[PRIVATE].assetMap.has(id);
		}
		return loaded;
	}

	private setAsset(id: string, asset: any) {
		this[PRIVATE].assetMap.set(id, asset);
		if (
			this[PRIVATE].initialAssetIds.includes(id) &&
			this.initialAssetsLoaded
		) {
			this.dispatchEvent({ type: 'load' });
		}
	}

	private async loadGLTF(
		id: string,
		url: string,
		callback: (gltf: GLTF) => void = () => {},
	) {
		const gltf = await this[PRIVATE].gtlfLoader.loadAsync(url);
		callback(gltf);
		this.setAsset(id, gltf);
	}

	private async loadOBJ(
		id: string,
		url: string,
		callback: (obj: Group) => void = () => {},
	) {
		const obj = await this[PRIVATE].objLoader.loadAsync(url);
		callback(obj);
		this.setAsset(id, obj);
	}

	private async loadTexture(
		id: string,
		url: string,
		callback: (texture: Texture) => void = () => {},
	) {
		const texture = await this[PRIVATE].textureLoader.loadAsync(url);
		callback(texture);
		this.setAsset(id, texture);
	}

	private async loadImage(
		id: string,
		url: string,
		callback: (image: HTMLImageElement) => void = () => {},
	) {
		const image = await this[PRIVATE].imageLoader.loadAsync(url);
		callback(image);
		this.setAsset(id, image);
	}

	private async loadRGBE(
		id: string,
		url: string,
		callback: (rgbe: DataTexture) => void = () => {},
	) {
		const rgbe = await this[PRIVATE].rgbEloader.loadAsync(url);
		callback(rgbe);
		this.setAsset(id, rgbe);
	}

	private async loadEXR(
		id: string,
		url: string,
		callback: (exr: DataTexture) => void = () => {},
	) {
		const exr = await this[PRIVATE].exrLoader.loadAsync(url);
		callback(exr);
		this.setAsset(id, exr);
	}

	private async loadKTX2(
		id: string,
		url: string,
		callback: (ktx2: CompressedTexture) => void = () => {},
	) {
		const ktx2 = await this[PRIVATE].ktx2Loader.loadAsync(url);
		callback(ktx2);
		this.setAsset(id, ktx2);
	}
}
