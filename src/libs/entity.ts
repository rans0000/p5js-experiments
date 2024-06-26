import P5 from 'p5';
import { TApplicableForces, TEdges, TEntity, TEntityType } from '../utils/types';
import { defaultEntityConfig } from '../utils/utils';

class Entity {
    type: TEntityType;
    pos: P5.Vector;
    r: number;

    constructor(
        readonly p5: P5,
        readonly collection: Entity[],
        _config: TEntity = {}
    ) {
        this.p5 = p5;
        this.collection = collection;
        const config = { pos: p5.createVector(0, 0), ...defaultEntityConfig, ..._config };
        this.type = TEntityType.ENTITY;
        this.pos = config.pos;
        this.r = config.r;
        collection.push(this);
    }

    update(deltaTime: number, options?: any): this {
        return this;
    }

    draw(deltaTime: number): this {
        return this;
    }
}

export default Entity;
