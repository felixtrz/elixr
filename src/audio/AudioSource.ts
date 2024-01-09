import { Object3D, Object3DEventMap, Vector3 } from 'three';

import { Howl } from 'howler';

export const PRIVATE = Symbol('@elixr/audio/audio-source');

export type AudioOptions = {
	loop?: boolean;
	autoPlay?: boolean;
	positional?: boolean;
	volume?: number;
	rate?: number;
	autoPositionUpdate?: boolean;
};

export class AudioSource<
	TEventMap extends Object3DEventMap = Object3DEventMap,
> extends Object3D<TEventMap> {
	/** @ignore */
	[PRIVATE]: {
		sound: Howl;
		soundInstance: number | undefined;
		positional: boolean;
		loop: boolean;
		volume: number;
		rate: number;
		vec3: Vector3;
		autoPositionUpdate: boolean;
		pendingDestroy: boolean;
	};

	constructor(
		howl: Howl,
		options: AudioOptions = {
			positional: false,
			loop: false,
			autoPlay: false,
			volume: 1,
			rate: 1,
			autoPositionUpdate: false,
		},
	) {
		super();

		this[PRIVATE] = {
			sound: howl,
			soundInstance: undefined,
			positional: options.positional,
			loop: options.loop,
			volume: options.volume,
			rate: options.rate,
			vec3: new Vector3(),
			autoPositionUpdate: options.autoPositionUpdate,
			pendingDestroy: false,
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

	updatePosition(playerHead: Object3D): void {
		const worldPosition = this.getWorldPosition(this[PRIVATE].vec3);
		const localPosition = playerHead.worldToLocal(worldPosition);
		this[PRIVATE].sound.pos(
			localPosition.x,
			localPosition.y,
			localPosition.z,
			this[PRIVATE].soundInstance,
		);
	}

	updateMatrixWorld(force?: boolean): void {
		super.updateMatrixWorld(force);
	}

	destroy(): void {
		this.stop();
		this.removeFromParent();
		this[PRIVATE].pendingDestroy = true;
	}
}
