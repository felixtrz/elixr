import { Component, ComponentSchema } from 'ecsy';
import { GameObject } from './GameObject';
export declare class GameComponent<C> extends Component<C> {
    gameObject: GameObject;
    onRemove(): void;
}
export interface GameComponentConstructor<C extends GameComponent<any>> {
    schema: ComponentSchema;
    isComponent: true;
    new (props?: Partial<Omit<C, keyof GameComponent<any>>> | false): C;
}
//# sourceMappingURL=GameComponent.d.ts.map