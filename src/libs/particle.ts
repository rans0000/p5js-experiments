import P5 from 'p5';
import { TEdges, TParticle } from '../utils/types';
import { defaultEdgeConfig } from '../utils/utils';
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

    applyEdgeBounce(deltaTime: number, _config?: TEdges): this {
        const config = { ...defaultEdgeConfig, ..._config };
        const { innerWidth, innerHeight } = window;

        if (config.bottom && this.pos.y >= innerHeight - this.r) {
            this.pos.y = innerHeight - this.r;
            this.velocity.y *= -1;
        }
        if (config.top && this.pos.y < this.r) {
            this.pos.y = this.r;
            this.velocity.y *= -1;
        }
        if (config.right && this.pos.x >= innerWidth - this.r) {
            this.pos.x = innerWidth - this.r;
            this.velocity.x *= -1;
        }
        if (config.left && this.pos.x <= this.r) {
            this.pos.x = this.r;
            this.velocity.x *= -1;
        }
        return this;
    }

    applyForces(deltaTime, forces: P5.Vector[], gravity = this.p5.createVector()): this {
        this.velocity.add(gravity);
        forces.forEach((force) => {
            let f = this.p5.createVector();
            P5.Vector.div(force, this.mass, f);
            this.velocity.add(f);
        });
        return this;
    }

    update(deltaTime: number): this {
        this.accelaration = this.velocity;
        this.pos.add(this.accelaration);
        return this;
    }

    draw(deltaTime: number): this {
        this.p5.ellipse(this.pos.x, this.pos.y, this.r, this.r);
        return this;
    }
}

export default Particle;
