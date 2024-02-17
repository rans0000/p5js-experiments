import P5 from 'p5';
import { TParticle } from '../utils/types';
import Entity from './entity';

class Particle extends Entity {
    mass: number;
    velocity: P5.Vector;
    accelaration: P5.Vector;
    forces: P5.Vector[];

    constructor(
        readonly p5: P5,
        readonly collection: Entity[],
        _config: TParticle = {}
    ) {
        const config = {
            mass: 1,
            accelaration: p5.createVector(0, 0),
            velocity: p5.createVector(0, 0),
            forces: [],
            ..._config
        };
        super(p5, collection, config);
        this.mass = config.mass;
        this.velocity = config.velocity;
        this.accelaration = config.accelaration;
        this.forces = config.forces;
    }

    update(deltaTime: number): this {
        this.accelaration = this.p5.createVector(0, 0);
        return this;
    }

    draw(deltaTime: number): this {
        this.p5.ellipse(this.pos.x, this.pos.y, this.r, this.r);
        return this;
    }
}

export default Particle;
