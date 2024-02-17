import P5 from 'p5';
import Entity from './entity';
import { TEntity } from '../utils/types';

const defaultConfig = { x: 0, y: 0, r: 5 };

class Particle extends Entity {
    delta: number;
    constructor(
        readonly p5: P5,
        readonly collection: Entity[],
        _config: TEntity = {}
    ) {
        const config = { ...defaultConfig, ..._config };
        super(p5, collection, { x: config.x, y: config.y, r: config.r });
        this.delta = p5.random(255);
    }

    process(deltaTime: number): void {
        this.x += this.p5.random(-2, 2);
        this.y += this.p5.random(-2, 2);
        this.delta = (this.delta + deltaTime / 100) % 255;
    }

    draw(deltaTime: number): void {
        this.process(deltaTime);
        this.p5.noStroke();
        const h = this.p5.noise(this.delta) * 255;
        const s = this.p5.noise(this.delta + 10) * 255;
        const v = this.p5.noise(this.delta + 100) * 255;

        this.p5.fill(h, s, v, this.p5.random(0.1));
        this.p5.ellipse(this.x, this.y, this.r, this.r);
    }
}

export default Particle;
