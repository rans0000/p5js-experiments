import { Bodies, IBodyDefinition } from 'matter-js';
import P5 from 'p5';
import { TPhysicsEntityConfig } from 'src/utils/types';
import PhysicsEntity from './physics-entity';

class CaromWall extends PhysicsEntity {
    width: number;
    height: number;

    constructor(p5: P5, config: { x: number; y: number; width: number; height: number } & TPhysicsEntityConfig) {
        super(p5, config);
        this.width = config.width;
        this.height = config.height;
        this.body = Bodies.rectangle(config.x, config.y, this.width, this.height, WAL_CONFIG);
    }

    draw(): this {
        this.p5.push();
        this.p5.noStroke();
        this.p5.fill(80);
        this.p5.translate(this.body.position.x, this.body.position.y);
        this.p5.rectMode(this.p5.CENTER);
        this.p5.rect(0, 0, this.width, this.height);
        this.p5.rotate(this.body.angle);
        this.p5.pop();
        return this;
    }
}

const WAL_CONFIG: IBodyDefinition = {
    friction: 0.1,
    restitution: 1,
    isStatic: true
};

export default CaromWall;
