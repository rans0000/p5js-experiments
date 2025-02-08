import { Bodies, IBodyDefinition } from 'matter-js';
import P5 from 'p5';
import { TPhysicsEntityConfig } from 'src/utils/types';
import PhysicsEntity from './physics-entity';

class CaromCoin extends PhysicsEntity {
    radius: number;

    constructor(p5: P5, config: { x: number; y: number } & TPhysicsEntityConfig) {
        super(p5, config);
        this.radius = 15;
        this.body = Bodies.circle(config.x, config.y, this.radius, COIN_CONFIG);
    }

    draw(): this {
        this.p5.push();
        this.p5.noStroke();
        this.p5.fill(255);
        this.p5.translate(this.body.position.x, this.body.position.y);
        this.p5.circle(0, 0, this.radius * 2);
        this.p5.rotate(this.body.angle);
        this.p5.pop();
        return this;
    }
}

const COIN_CONFIG: IBodyDefinition = {
    friction: 0.0,
    restitution: 1
};

export default CaromCoin;
