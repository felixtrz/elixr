import * as CANNON from 'cannon-es';
import { GameSystem } from '../GameSystem';
export declare type ExtendedBody = CANNON.Body & {
    removalFlag: boolean;
};
export declare class RigidBodyPhysicsSystem extends GameSystem {
    init(): void;
    update(delta: number, _time: number): void;
    _preStep(delta: number): void;
    _postStep(): void;
}
//# sourceMappingURL=RigidBodyPhysicsSystem.d.ts.map