import { Body, Composite } from 'matter-js';
import P5 from 'p5';
import { TPhysicsEntityConfig } from 'src/utils/types';

class PhysicsEntity {
    p5: P5;
    type: string;
    body: Body;
    parent: Composite;

    constructor(
        readonly _p5: P5,
        config: TPhysicsEntityConfig
    ) {
        this.p5 = _p5;
        this.parent = config.parent;
        this.type = config.type;
    }

    addToScene() {
        // console.log(this.parent, this.body);
        Composite.add(this.parent, this.body);
    }

    update(_deltaTime: number): this {
        throw new Error('Impliment `update` method manually for PhysicsEntity');
        return this;
    }

    draw(): this {
        throw new Error('Impliment `draw` method manually for PhysicsEntity');
        return this;
    }
}

export default PhysicsEntity;
