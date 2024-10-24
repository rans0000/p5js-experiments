import P5, { Vector } from 'p5';

type TCAConfig = {
    horizontalTiles: number;
    verticalTiles: number;
    size: number;
    noiseScale: number;
    survivalThresold: number;
    deathThreshold: number;
    maxHealth: number;
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
    tiles: Tile[][] = [];
    noiseScale: number;
    survivalThresold: number;
    deathThreshold: number;
    maxHealth: number;

    constructor(p5: P5, _config?: Partial<TCAConfig>) {
        const config: TCAConfig = {
            horizontalTiles: 10,
            verticalTiles: 10,
            size: 50,
            noiseScale: 0,
            survivalThresold: 4,
            deathThreshold: 5,
            maxHealth: 1,
            ..._config
        };
        this.p5 = p5;
        this.horizontalTiles = config.horizontalTiles;
        this.verticalTiles = config.verticalTiles;
        this.size = config.size;
        this.survivalThresold = config.survivalThresold;
        this.deathThreshold = config.deathThreshold;
        this.maxHealth = config.maxHealth;

        this.tiles = [];

        for (let i = 0; i < this.horizontalTiles * this.verticalTiles; i++) {
            this.tiles.push([]);
            for (let j = 0; j < this.verticalTiles; j++) {
                this.tiles[i].push(
                    new Tile(p5, {
                        index: j * this.horizontalTiles + i,
                        maxHealth: this.maxHealth,
                        prevState:
                            config.noiseScale && Math.floor(p5.noise(i * config.noiseScale, j * config.noiseScale) * 2),
                        pos: p5.createVector(i * this.size + this.size / 2, j * this.size + this.size / 2),
                        size: this.size
                    })
                );
            }
        }
    }

    updateTile(x: number, y: number, health: number = Tile.maxHealth) {
        this.tiles[x][y].cacheState(health);
    }

    calculateState() {
        for (let x = 0; x < this.horizontalTiles; x++) {
            for (let y = 0; y < this.verticalTiles; y++) {
                let filled = 0;
                let empty = 0;
                let neighbours = 0;
                for (let i = -1; i < 2; i++) {
                    for (let j = -1; j < 2; j++) {
                        const x1 = x + i;
                        const y1 = y + j;
                        if (i == 0 && j == 0) continue;
                        if (x1 < 0 || x1 >= this.horizontalTiles) continue;
                        if (y1 < 0 || y1 >= this.verticalTiles) continue;

                        ++neighbours;
                        this.tiles[x1][y1].health ? ++filled : ++empty;
                    }
                }
                if (filled === this.survivalThresold) {
                    this.tiles[x][y].cacheState(this.maxHealth);
                } else if (filled >= this.deathThreshold) {
                    this.tiles[x][y].cacheState(0);
                }
            }
        }
    }

    update(deltaTime: number): this {
        for (let i = 0; i < this.horizontalTiles; i++) {
            for (let j = 0; j < this.verticalTiles; j++) {
                this.tiles[i][j].update(deltaTime);
            }
        }
        return this;
    }
    draw(): this {
        for (let i = 0; i < this.horizontalTiles; i++) {
            for (let j = 0; j < this.verticalTiles; j++) {
                this.tiles[i][j].draw();
            }
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

    constructor(p5: P5, config: Omit<TCell, 'health'>) {
        this.p5 = p5;
        this.index = config.index;
        Tile.maxHealth = config.maxHealth;
        this.pos = config.pos;
        this.size = config.size;
        this.prevState = config.prevState;
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
        this.p5.pop();

        return this;
    }
}

export default CA;
