import { Body, Composite } from 'matter-js';
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
    coins: CaromCoin[];
    walls: CaromWall[];
    size: number;
    borderWidth: number;

    constructor(p5: P5, config: TCarromBoardConfig) {
        this.p5 = p5;
        this.parent = config.parent;
        this.coins = [];
        this.walls = [];
        this.size = config.size;
        this.borderWidth = config.borderWidth;

        this.setup();
    }

    setup() {
        this.buildWalls();
        this.buildCoins();
        this.initiateGame();
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
        this.walls.push(tWall);
        tWall.addToScene();

        const eWall = new CaromWall(this.p5, {
            type: 'carrom/all',
            parent: this.parent,
            width: this.borderWidth,
            height: this.size,
            x: this.size + this.borderWidth / 2,
            y: this.size / 2
        });
        this.walls.push(eWall);
        eWall.addToScene();

        const sWall = new CaromWall(this.p5, {
            type: 'carrom/all',
            parent: this.parent,
            width: this.size,
            height: this.borderWidth,
            x: this.size / 2,
            y: this.size - this.borderWidth / 2
        });
        this.walls.push(sWall);
        sWall.addToScene();

        const wWall = new CaromWall(this.p5, {
            type: 'carrom/all',
            parent: this.parent,
            width: this.borderWidth,
            height: this.size - this.borderWidth * 2,
            x: this.borderWidth / 2,
            y: this.size / 2
        });
        this.walls.push(wWall);
        wWall.addToScene();
    }

    buildCoins() {
        // create coins
        for (let i = 0; i < 1; i++) {
            const coin = new CaromCoin(this.p5, { x: (i + 1) * 100, y: 100, type: '', parent: this.parent });
            coin.addToScene();
            this.coins.push(coin);
        }
    }

    initiateGame() {
        for (const coin of this.coins) {
            Body.applyForce(coin.body, coin.body.position, { x: 0, y: 0.2 });
        }
    }

    update(_deltaTime: number): this {
        return this;
    }
    draw(): this {
        for (const elem of this.walls) elem.draw();
        for (const elem of this.coins) elem.draw();

        return this;
    }
}

export default CarromBoard;
