import {
	PRIVATE as AUDIO_SOURCE_PRIVATE,
	AudioOptions,
	AudioSource,
} from './AudioSource';

import { AssetDescriptor } from '../graphics/AssetManager';
import { Howl } from 'howler';
import { Player } from '../xr/Player';
import { Vector3 } from 'three';

export const PRIVATE = Symbol('@elixr/audio/audio-manager');

export class AudioManager {
	/** @ignore */
	[PRIVATE]: {
		soundPool: Map<string, Howl>;
		audioSources: Set<AudioSource>;
		player: Player;
		vec3: Vector3;
	} = {
		soundPool: new Map(),
		audioSources: new Set(),
		player: null as any,
		vec3: new Vector3(),
	};

	constructor(player: Player, initialAssets: Record<string, AssetDescriptor>) {
		this[PRIVATE].player = player;
		for (const [id, descriptor] of Object.entries(initialAssets)) {
			const sound = new Howl({
				src: [descriptor.url],
			});
			this[PRIVATE].soundPool.set(id, sound);
		}
	}

	public createAudioSource(
		id: string,
		options: AudioOptions = {
			positional: false,
			loop: false,
			autoPlay: false,
			volume: 1,
			rate: 1,
			autoPositionUpdate: false,
		},
	): AudioSource {
		const howl = this[PRIVATE].soundPool.get(id);
		if (!howl) {
			throw new Error(`Sound with ID ${id} not found.`);
		}
		const audioSource = new AudioSource(howl, options);
		this[PRIVATE].audioSources.add(audioSource);
		if (options.positional) {
			audioSource.updatePosition(this[PRIVATE].player.head);
		}
		return audioSource;
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

	update() {
		for (const audioSource of this[PRIVATE].audioSources) {
			if (audioSource[AUDIO_SOURCE_PRIVATE].pendingDestroy) {
				this[PRIVATE].audioSources.delete(audioSource);
			} else if (
				audioSource[AUDIO_SOURCE_PRIVATE].soundInstance !== undefined &&
				audioSource[AUDIO_SOURCE_PRIVATE].positional &&
				audioSource[AUDIO_SOURCE_PRIVATE].autoPositionUpdate &&
				audioSource[AUDIO_SOURCE_PRIVATE].sound.playing(
					audioSource[AUDIO_SOURCE_PRIVATE].soundInstance,
				)
			) {
				audioSource.updatePosition(this[PRIVATE].player.head);
			}
		}
	}
}
