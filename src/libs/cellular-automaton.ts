import P5, { Vector } from 'p5';

type TCAConfig = {
    horizontalTiles: number;
    verticalTiles: number;
    size: number;
    rule: string;
};
type TCell = {
    index: number;
    pos: Vector;
    size: number;
    health: number;
    maxHealth: number;
};
class CA {
    p5: P5;
    horizontalTiles: number;
    verticalTiles: number;
    size: number;
    rule: string;
    tiles: Tile[] = [];

    constructor(p5: P5, _config?: Partial<TCAConfig>) {
        const config: TCAConfig = {
            horizontalTiles: 10,
            verticalTiles: 10,
            size: 50,
            rule: '3/4/1/1',
            ..._config
        };
        this.p5 = p5;
        this.horizontalTiles = config.horizontalTiles;
        this.verticalTiles = config.verticalTiles;
        this.size = config.size;
        this.rule = config.rule;

        const ruleset = this.rule.split('/').map((e) => parseInt(e, 10));
        for (let i = 0; i < this.horizontalTiles * this.verticalTiles; i++) {
            this.tiles.push(
                new Tile(p5, {
                    index: i,
                    maxHealth: ruleset[2],
                    pos: p5.createVector(
                        (i % this.horizontalTiles) * this.size + this.size / 2,
                        Math.floor(i / this.horizontalTiles) * this.size + this.size / 2
                    ),
                    size: this.size
                })
            );
        }
    }

    updateTile(index: number, health?: number) {
        this.tiles[index].setHealth(health);
    }

    update(deltaTime: number): this {
        return this;
    }
    draw(): this {
        for (let i = 0; i < this.horizontalTiles * this.verticalTiles; i++) {
            this.tiles[i].draw();
            console.log(i);
        }
        return this;
    }
}

class Tile {
    p5: P5;
    index: number;
    pos: Vector;
    size: number;
    health: number = 0;
    static maxHealth: number;

    constructor(p5: P5, config: Omit<TCell, 'health'>) {
        this.p5 = p5;
        this.index = config.index;
        Tile.maxHealth = config.maxHealth;
        this.pos = config.pos;
        this.size = config.size;
    }

    setHealth(health = Tile.maxHealth) {
        this.health = health;
    }

    update(deltaTime: number): this {
        return this;
    }

    draw(): this {
        this.p5.rectMode(this.p5.CENTER);
        this.p5.push();
        this.p5.translate(this.pos.x, this.pos.y);
        this.p5.stroke(255, 0.1);
        this.p5.fill(255, this.health ? 1 : 0);
        this.p5.rect(0, 0, this.size);
        this.p5.pop();

        return this;
    }
}

export default CA;
