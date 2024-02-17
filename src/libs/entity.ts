import P5 from 'p5';
import { TEntity } from '../utils/types';
import { defaultConfig } from '../utils/utils';

class Entity {
    pos: P5.Vector;
    r: number;

    constructor(
        readonly p5: P5,
        readonly collection: Entity[],
        _config: TEntity = {}
    ) {
        this.p5 = p5;
        this.collection = collection;
        const config = { pos: p5.createVector(0, 0), ...defaultConfig, ..._config };
        this.pos = config.pos;
        this.r = config.r;
        collection.push(this);
    }

    update(deltaTime: number): this {
        return this;
    }

    draw(deltaTime: number): this {
        return this;
    }
}

export default Entity;
