import { Bodies, Composite } from 'matter-js';
import P5 from 'p5';
import { TPhysicsEntityConfig } from 'src/utils/types';
import PhysicsEntity from './physics-entity';

type TCarromBoardConfig = {
    size: number;
} & TPhysicsEntityConfig;
class CarromBoard {
    p5: P5;
    parent: Composite;
    coins: CaromCoin[];

    constructor(p5: P5, config: Omit<TCarromBoardConfig, 'body'>) {
        this.p5 = p5;
        this.parent = config.parent;
        this.coins = [];

        this.setup();
    }

    setup() {
        // create walls

        // create coins
        for (let i = 0; i < 1; i++) {
            const coin = new CaromCoin(this.p5, { x: (i + 1) * 100, y: 100, type: '', parent: this.parent });
            coin.addToScene();
            this.coins.push(coin);
        }
    }

    update(_deltaTime: number): this {
        return this;
    }
    draw(): this {
        for (const coin of this.coins) {
            coin.draw();
        }
        return this;
    }
}

class CaromCoin extends PhysicsEntity {
    radius: number;

    constructor(p5: P5, config: { x: number; y: number } & TPhysicsEntityConfig) {
        super(p5, config);
        this.radius = 10;
        this.body = Bodies.circle(config.x, config.y, this.radius);
    }

    addToScene() {
        super.addToScene();
    }

    update(_deltaTime: number): this {
        return this;
    }

    draw(): this {
        this.p5.push();
        this.p5.stroke(255);
        this.p5.translate(this.body.position.x, this.body.position.y);
        this.p5.circle(0, 0, this.radius);
        this.p5.rotate(this.body.angle);
        this.p5.pop();
        return this;
    }
}

export default CarromBoard;
