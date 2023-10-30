import { AssetDescriptor } from '../constants';
import { Howl } from 'howler';

export const PRIVATE = Symbol('@elixr/audio/audio-manager');

export class AudioManager {
	private static instance: AudioManager;

	/** @ignore */
	[PRIVATE]: {
		soundPool: Map<string, Howl>;
	} = {
		soundPool: new Map(),
	};

	private constructor(initialAssets: Record<string, AssetDescriptor>) {
		for (const [id, descriptor] of Object.entries(initialAssets)) {
			const sound = new Howl({
				src: [descriptor.url],
			});
			this[PRIVATE].soundPool.set(id, sound);
		}
	}

	public static init(initialAssets: Record<string, AssetDescriptor>) {
		if (this.instance === null) {
			this.instance = new AudioManager(initialAssets);
		}
		return this.instance;
	}

	public static getInstance(): AudioManager {
		if (this.instance === null) {
			throw new Error('AudioManager not initialized');
		}
		return this.instance;
	}

	public getSound(id: string): Howl | undefined {
		return this[PRIVATE].soundPool.get(id);
	}

	public loadSound(id: string, descriptor: AssetDescriptor): void {
		const sound = new Howl({
			src: [descriptor.url],
		});
		this[PRIVATE].soundPool.set(id, sound);
	}
}
