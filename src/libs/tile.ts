import P5 from 'p5';
import { TTile, TTileConfig } from 'src/utils/types';

const Tile = function (this: TTile, p5: P5, config: TTileConfig) {
    this.p5 = p5;
    this.x = config.x;
    this.y = config.y;
    this.gird = config.grid;

    this.update = (_deltatime: number) => {};
    this.draw = () => {
        this.p5.rect(this.x * this.gird.size, this.y * this.gird.size, this.gird.size, this.gird.size);
    };
} as unknown as { new (p5: P5, config: TTileConfig): TTile };
export default Tile;
