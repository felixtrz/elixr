import { Component } from 'ecsy';

export class GameComponent extends Component {
	/** @param {import('./GameObject').GameObject} gameObject */
	setGameObject(gameObject) {
		this._gameObject = gameObject;
	}

	/** @returns {import('./GameObject').GameObject} */
	getGameObject() {
		return this._gameObject;
	}

	onRemove() {}
}
