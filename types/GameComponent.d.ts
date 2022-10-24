export class GameComponent extends Component<any> {
    constructor(props?: false | Partial<Omit<any, keyof Component<any>>>);
    /** @param {import('./GameObject').GameObject} gameObject */
    setGameObject(gameObject: import('./GameObject').GameObject): void;
    _gameObject: import("./GameObject").GameObject;
    /** @returns {import('./GameObject').GameObject} */
    getGameObject(): import('./GameObject').GameObject;
    onRemove(): void;
}
import { Component } from "ecsy/src/Component";
