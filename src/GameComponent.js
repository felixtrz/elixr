import { Component } from 'ecsy';

export class GameComponent extends Component {
	setGameObject(gameObject) {
		this._gameObject = gameObject;
	}

	getGameObject() {
		return this._gameObject;
	}
}
