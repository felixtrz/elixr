export enum JOYSTICK_STATES {
	DISENGAGED = 0,
	LEFT = 1,
	RIGHT = 2,
	FORWARD = 3,
	BACK = 4,
}

export enum ASSET_TYPE {
	GLTF = 'GLTF',
	OBJ = 'OBJ',
	TEXTURE = 'TEXTURE',
	IMAGE = 'IMAGE',
	RGBE = 'RGBE',
	KTX2 = 'KTX2',
	AUDIO = 'AUDIO',
}

export interface AssetDescriptor {
	url: string;
	type: ASSET_TYPE;
	callback: (asset: any) => void;
}
