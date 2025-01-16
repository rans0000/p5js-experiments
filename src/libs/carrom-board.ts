import { Composite } from 'matter-js';
import P5 from 'p5';
import { TPhysicsEntityConfig } from 'src/utils/types';
import CaromCoin from './carrom-coin';
import CaromWall from './carrom-wall';

type TCarromBoardConfig = {
    size: number;
    borderWidth: number;
} & Omit<TPhysicsEntityConfig, 'body'>;

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

export default CarromBoard;
