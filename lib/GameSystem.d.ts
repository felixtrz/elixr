import { Attributes, System, SystemQueries, World } from 'ecsy';
import { Core } from './Core';
export declare class GameSystem extends System {
    core: Core;
    constructor(world: World, attributes?: Attributes);
    execute(delta: number, time: number): void;
    queryGameObjects(queryId: string): import("./GameObject").GameObject[];
    queryAddedGameObjects(queryId: string): import("./GameObject").GameObject[];
    queryRemovedGameObjects(queryId: string): import("./GameObject").GameObject[];
    update(_delta: number, _time: number): void;
}
export declare class XRGameSystem extends GameSystem {
    execute(delta: number, time: number): void;
}
export declare class SingleUseGameSystem extends GameSystem {
    execute(delta: number, time: number): void;
}
export declare class SingleUseXRGameSystem extends GameSystem {
    execute(delta: number, time: number): void;
}
export interface GameSystemConstructor<T extends GameSystem> {
    isSystem: true;
    queries: SystemQueries;
    new (...args: any): T;
}
//# sourceMappingURL=GameSystem.d.ts.map