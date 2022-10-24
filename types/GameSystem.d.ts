export class GameSystem extends System<import("ecsy")._Entity> {
    constructor(world: import("ecsy").World<import("ecsy")._Entity>, attributes?: import("ecsy").Attributes);
    /** @type {import('./Core').Core} */
    get core(): import("./Core").Core;
    execute(delta: any, time: any): void;
    /**
     * @param {string} queryId
     * @returns {import('./GameObject').GameObject[]}
     */
    queryGameObjects(queryId: string): import('./GameObject').GameObject[];
    /**
     * @param {string} queryId
     * @returns {import('./GameObject').GameObject[]}
     */
    queryAddedGameObjects(queryId: string): import('./GameObject').GameObject[];
    /**
     * @param {string} queryId
     * @returns {import('./GameObject').GameObject[]}
     */
    queryRemovedGameObjects(queryId: string): import('./GameObject').GameObject[];
    /**
     * @param {Number} _delta
     * @param {Number} _time
     */
    update(_delta: number, _time: number): void;
}
export class XRGameSystem extends GameSystem {
}
export class SingleUseGameSystem extends GameSystem {
}
export class SingleUseXRGameSystem extends GameSystem {
}
import { System } from "ecsy/src/System";
