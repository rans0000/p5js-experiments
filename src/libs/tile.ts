import { TTile, TTileConfig, TTileSetter } from 'src/utils/types';

const Tile = function (this: TTile, config: TTileConfig) {
    this.p5 = config.p5;
    const _x = config.x;
    const _y = config.y;
    const _gird = config.grid;
    let _isVisited: boolean = false;
    let _current: boolean = false;
    const _walls: [boolean, boolean, boolean, boolean] = [true, true, true, true];

    this.update = () => {
        return this;
    };

    this.draw = () => {
        const dim = _gird.getWidth() / _gird.getSize();
        // this.p5.rect(_x * dim, _y * dim, dim, dim);
        drawWalls();
        return this;
    };

    this.setter = (action: TTileSetter) => {
        switch (action.type) {
            case 'VISITED':
                _isVisited = action.payload;
                break;
            case 'CURRENT':
                _current = action.payload;
                break;
            default:
                break;
        }
    };

    const drawWalls = () => {
        const dim = _gird.getWidth() / _gird.getSize();

        this.p5.noFill();
        this.p5.stroke(255);
        this.p5.push();
        this.p5.translate(_x * dim, _y * dim);

        //
        if (_isVisited) {
            this.p5.fill(255, 0, 255);
            this.p5.noStroke();
            this.p5.rect(0, 0, dim, dim);
        }

        // top wall
        _walls[0] && this.p5.line(0, 0, dim, 0);
        // right wall
        _walls[1] && this.p5.line(dim, 0, dim, dim);
        // bottom wall
        _walls[2] && this.p5.line(0, dim, dim, dim);
        // left wall
        _walls[3] && this.p5.line(0, 0, 0, dim);
        //

        this.p5.pop();
    };
} as unknown as { new (config: TTileConfig): TTile };
export default Tile;
