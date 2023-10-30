import { AudioManager } from './AudioManager';
import { GameObject } from '../ecs/GameObject';
import { Howl } from 'howler';

export const PRIVATE = Symbol('@elixr/audio/audio-source');

export type AudioOptions = {
	loop?: boolean;
	autoPlay?: boolean;
	positional?: boolean;
	volume?: number;
	rate?: number;
};

export class AudioSource extends GameObject {
	/** @ignore */
	[PRIVATE]: {
		sound: Howl;
		soundInstance: number | undefined;
		positional: boolean;
		loop: boolean;
		volume: number;
		rate: number;
	};

	constructor(
		soundId: string,
		options: AudioOptions = {
			positional: false,
			loop: false,
			autoPlay: false,
			volume: 1,
			rate: 1,
		},
	) {
		super();
		const audioManager = AudioManager.getInstance();
		const howl = audioManager.getSound(soundId);
		if (!howl) {
			throw new Error(`Sound with ID ${soundId} not found.`);
		}

		this[PRIVATE] = {
			sound: howl,
			soundInstance: undefined,
			positional: options.positional,
			loop: options.loop,
			volume: options.volume,
			rate: options.rate,
		};

		if (options.autoPlay) {
			this.play();
		}
	}

	play(stopCurrent: boolean = false): void {
		// If the flag is set and a sound instance is currently playing, stop it.
		if (
			stopCurrent &&
			this[PRIVATE].soundInstance !== undefined &&
			this[PRIVATE].sound.playing(this[PRIVATE].soundInstance)
		) {
			this[PRIVATE].sound.stop(this[PRIVATE].soundInstance);
		}
		// Play a new sound instance.
		this[PRIVATE].soundInstance = this[PRIVATE].sound.play();
		this[PRIVATE].sound.loop(this[PRIVATE].loop, this[PRIVATE].soundInstance);
		this[PRIVATE].sound.volume(
			this[PRIVATE].volume,
			this[PRIVATE].soundInstance,
		);
		this[PRIVATE].sound.rate(this[PRIVATE].rate, this[PRIVATE].soundInstance);
	}

	stop(): void {
		if (this[PRIVATE].soundInstance !== undefined) {
			this[PRIVATE].sound.stop(this[PRIVATE].soundInstance);
		}
	}

	pause(): void {
		if (this[PRIVATE].soundInstance !== undefined) {
			this[PRIVATE].sound.pause(this[PRIVATE].soundInstance);
		}
	}

	resume(): void {
		if (this[PRIVATE].soundInstance !== undefined) {
			this[PRIVATE].sound.play(this[PRIVATE].soundInstance);
		}
	}

	set volume(value: number) {
		this[PRIVATE].volume = value;
		if (this[PRIVATE].soundInstance !== undefined) {
			this[PRIVATE].sound.volume(value, this[PRIVATE].soundInstance);
		}
	}

	get volume(): number {
		return this[PRIVATE].volume;
	}

	set rate(value: number) {
		this[PRIVATE].rate = value;
		if (this[PRIVATE].soundInstance !== undefined) {
			this[PRIVATE].sound.rate(value, this[PRIVATE].soundInstance);
		}
	}

	get rate(): number {
		return this[PRIVATE].rate;
	}

	set loop(value: boolean) {
		this[PRIVATE].loop = value;
		if (this[PRIVATE].soundInstance !== undefined) {
			this[PRIVATE].sound.loop(value, this[PRIVATE].soundInstance);
		}
	}

	get loop(): boolean {
		return this[PRIVATE].loop;
	}

	updateMatrixWorld(force?: boolean): void {
		super.updateMatrixWorld(force);
		if (
			this[PRIVATE].soundInstance !== undefined &&
			this[PRIVATE].positional &&
			this[PRIVATE].sound.playing(this[PRIVATE].soundInstance)
		) {
			const position = this.position;
			this[PRIVATE].sound.pos(
				position.x,
				position.y,
				position.z,
				this[PRIVATE].soundInstance,
			);
		}
	}
}
