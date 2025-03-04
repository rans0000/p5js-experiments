import P5 from 'p5';
import { TTileGrid, TTileGridConfig } from 'src/utils/types';
import Tile from './tile';

const TileGrid = function (this: TTileGrid, p5: P5, _config: TTileGridConfig) {
    this.p5 = p5;
    this.size = _config.size;
    this.width = _config.width;
    this.tiles = [];

    this.createTiles = () => {
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                this.tiles.push(new Tile(this.p5, { x, y, grid: this }));
            }
        }
    };

    this.update = (_deltatime: number) => {};
    this.draw = () => {
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                this.tiles[x + y * this.size].draw();
            }
        }
    };

    this.createTiles();
} as unknown as { new (p5: P5, config: TTileGridConfig): TTileGrid };

export default TileGrid;
