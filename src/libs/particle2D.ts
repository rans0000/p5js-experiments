import P5 from 'p5';
import { TApplicableForces, TEdges, TEntityType, TParticle } from '../utils/types';
import { defaultEdgeConfig } from '../utils/utils';
import Entity from './entity';

const defaultApplicableForces: TApplicableForces = {
    gravity: true,
    wind: true,
    friction: true
};

class Particle2D extends Entity {
    mass: number;
    velocity: P5.Vector;
    accelaration: P5.Vector;
    mu: number;

    constructor(
        readonly p5: P5,
        readonly collection: Entity[],
        _config: TParticle = {}
    ) {
        const config = {
            mass: 1,
            accelaration: p5.createVector(0, 0),
            velocity: p5.createVector(0, 0),
            mu: 0.01,
            ..._config
        };
        super(p5, collection, config);
        this.type = TEntityType.PARTICLES;
        this.mass = config.mass;
        this.velocity = config.velocity;
        this.accelaration = config.accelaration;
        this.mu = config.mu;
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

    applyForces(deltaTime, _forceConfig: Partial<TApplicableForces>): this {
        const forceConfig: TApplicableForces = { ...defaultApplicableForces, ..._forceConfig };
        for (const key in forceConfig) {
            if (Object.prototype.hasOwnProperty.call(forceConfig, key)) {
                switch (key) {
                    case 'gravity':
                        if (forceConfig.gravity) {
                            const gravity = this.p5.createVector(0, 0.02);
                            this.velocity.add(gravity);
                        }
                        break;
                    case 'wind':
                        if (forceConfig.wind) {
                            let f = this.p5.createVector();
                            const wind = this.p5.createVector(0.01, 0);
                            P5.Vector.div(wind, this.mass, f);
                            this.velocity.add(f);
                        }
                        break;
                    case 'friction':
                        const { innerHeight } = window;
                        const diff = innerHeight - (this.pos.y + this.r);
                        if (diff > 1) break;

                        let friction = this.velocity.copy();
                        friction.normalize();
                        friction.mult(-1);
                        const normal = this.mass;
                        friction.setMag(this.mu * normal);
                        this.velocity.add(friction);
                        break;
                    default:
                        break;
                }
            }
        }

        return this;
    }

    update(deltaTime: number, forceConfig: Partial<TApplicableForces>): this {
        this.applyForces(deltaTime, forceConfig);

        this.accelaration = this.velocity;
        this.pos.add(this.accelaration);

        this.applyEdgeBounce(deltaTime);
        return this;
    }

    draw(deltaTime: number): this {
        this.p5.ellipse(this.pos.x, this.pos.y, this.r, this.r);
        return this;
    }
}

export default Particle2D;
