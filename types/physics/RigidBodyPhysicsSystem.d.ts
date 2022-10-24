export class RigidBodyPhysicsSystem extends GameSystem {
    init(): void;
    physicsWorld: CANNON.World;
    update(delta: any, _time: any): void;
    _preStep(delta: any): void;
    _postStep(): void;
}
export namespace RigidBodyPhysicsSystem {
    namespace queries {
        namespace rigidBodies {
            const components: (typeof RigidBodyComponent)[];
            namespace listen {
                const added: boolean;
            }
        }
    }
}
import { GameSystem } from "../GameSystem";
import * as CANNON from "cannon-es";
import { RigidBodyComponent } from "./PhysicsComponents";
