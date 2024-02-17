import P5 from 'p5';
import { TEntity } from '../utils/types';

const defaultConfig = { x: 0, y: 0, r: 5 };

class Entity {
    x: number;
    y: number;
    r: number;

    constructor(
        readonly p5: P5,
        readonly collection: Entity[],
        _config: TEntity = {}
    ) {
        this.p5 = p5;
        this.collection = collection;
        const config = { ...defaultConfig, ..._config };
        this.x = config.x;
        this.y = config.y;
        this.r = config.r;
        collection.push(this);
    }

    process(deltaTime: number): void {}

    draw(deltaTime: number): void {
        this.process(deltaTime);
    }
}

export default Entity;
