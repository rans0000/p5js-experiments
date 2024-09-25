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
    prevState: number;
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

    updateTile(index: number, health: number = Tile.maxHealth) {
        this.tiles[index].cacheState(health);
    }

    calculateState() {
        const [survivalThresold, deathThreshold, maxLife, isMoore] = this.rule.split('/').map((e) => parseInt(e, 10));
        for (let x = 0; x < this.horizontalTiles; x++) {
            for (let y = 0; y < this.verticalTiles; y++) {
                let filled = 0;
                let empty = 0;
                for (let i = x - 1; i < x + 2; i++) {
                    for (let j = y - 1; j < y + 2; j++) {
                        if (i === x && j === y) continue;
                        if (i === -1 || j === -1) continue;
                        if (i > this.horizontalTiles - 1 || j > this.verticalTiles - 1) continue;
                        const index = i * this.horizontalTiles + j;
                        i * this.horizontalTiles + j;
                        this.tiles[index].health ? ++filled : ++empty;
                    }
                }
                const index = x * this.horizontalTiles + y;
                if (filled === survivalThresold) {
                    this.tiles[index].cacheState(maxLife);
                } else if (filled >= deathThreshold || filled === 8) {
                    this.tiles[index].cacheState(0);
                }
                // console.log(`(${x}, ${y})`, filled, empty);
            }
        }
    }

    update(deltaTime: number): this {
        for (const tile of this.tiles) {
            tile.update(deltaTime);
        }
        return this;
    }
    draw(): this {
        for (let i = 0; i < this.horizontalTiles * this.verticalTiles; i++) {
            this.tiles[i].draw();
        }
        return this;
    }
}

class Tile {
    p5: P5;
    index: number;
    pos: Vector;
    size: number;
    health: number;
    prevState: number;
    static maxHealth: number;

    constructor(p5: P5, config: Omit<TCell, 'health' | 'prevState'>) {
        this.p5 = p5;
        this.index = config.index;
        Tile.maxHealth = config.maxHealth;
        this.pos = config.pos;
        this.size = config.size;
        this.prevState = p5.random([0, 1]);
    }

    setHealth(health = Tile.maxHealth) {
        this.health = health;
    }

    cacheState(health: number) {
        this.prevState = health;
    }

    update(_deltaTime: number): this {
        this.health = this.prevState;
        return this;
    }

    draw(): this {
        this.p5.rectMode(this.p5.CENTER);
        this.p5.push();
        this.p5.translate(this.pos.x, this.pos.y);
        this.p5.stroke(255, 0.1);
        this.p5.fill(255, this.health ? 1 : 0);
        this.p5.rect(0, 0, this.size);
        // this.p5.text(this.health, 0, 0);
        this.p5.pop();

        return this;
    }
}

export default CA;
