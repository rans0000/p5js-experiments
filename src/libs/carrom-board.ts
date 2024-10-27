import { Bodies, Composite, IBodyDefinition } from 'matter-js';
import P5 from 'p5';
import { TPhysicsEntityConfig } from 'src/utils/types';
import PhysicsEntity from './physics-entity';

type TCarromBoardConfig = {
    size: number;
    borderWidth: number;
} & Omit<TPhysicsEntityConfig, 'body'>;

const COIN_CONFIG: IBodyDefinition = {
    friction: 0.1,
    restitution: 1
};

const WAL_CONFIG: IBodyDefinition = {
    friction: 0.1,
    restitution: 1,
    isStatic: true
};

class CarromBoard {
    p5: P5;
    parent: Composite;
    elements: (CaromCoin | CaromWall)[];
    size: number;
    borderWidth: number;

    constructor(p5: P5, config: TCarromBoardConfig) {
        this.p5 = p5;
        this.parent = config.parent;
        this.elements = [];
        this.size = config.size;
        this.borderWidth = config.borderWidth;

        this.setup();
    }

    setup() {
        this.buildWalls();
        this.buildCoins();
    }

    buildWalls() {
        // create walls

        const tWall = new CaromWall(this.p5, {
            type: 'carrom/all',
            parent: this.parent,
            width: this.size,
            height: this.borderWidth,
            x: this.size / 2,
            y: this.borderWidth / 2
        });
        this.elements.push(tWall);
        tWall.addToScene();

        const sWall = new CaromWall(this.p5, {
            type: 'carrom/all',
            parent: this.parent,
            width: this.size,
            height: this.borderWidth,
            x: this.size / 2,
            y: this.size - this.borderWidth
        });
        this.elements.push(sWall);
        sWall.addToScene();

        const wWall = new CaromWall(this.p5, {
            type: 'carrom/all',
            parent: this.parent,
            width: this.borderWidth,
            height: this.size,
            x: this.borderWidth / 2,
            y: this.size / 2 + this.borderWidth
        });
        this.elements.push(wWall);
        wWall.addToScene();

        const ZWall = new CaromWall(this.p5, {
            type: 'carrom/all',
            parent: this.parent,
            width: this.borderWidth,
            height: this.size,
            x: this.size + this.borderWidth / 2,
            y: this.size / 2 - this.borderWidth / 2
        });
        this.elements.push(ZWall);
        ZWall.addToScene();
    }

    buildCoins() {
        // create coins
        for (let i = 0; i < 1; i++) {
            const coin = new CaromCoin(this.p5, { x: (i + 1) * 100, y: 100, type: '', parent: this.parent });
            coin.addToScene();
            this.elements.push(coin);
        }
    }

    update(_deltaTime: number): this {
        return this;
    }
    draw(): this {
        for (const elem of this.elements) {
            elem.draw();
        }
        return this;
    }
}

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
        this.p5.stroke(128);
        this.p5.translate(this.body.position.x, this.body.position.y);
        this.p5.rectMode(this.p5.CENTER);
        this.p5.rect(0, 0, this.width, this.height);
        this.p5.rotate(this.body.angle);
        this.p5.pop();
        return this;
    }
}

export default CarromBoard;
