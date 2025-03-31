import { TTile, TTileConfig, TTileGetter, TTileSetter } from 'src/utils/types';

const Tile = function (this: TTile, config: TTileConfig) {
    this.p5 = config.p5;
    this.id = config.id;
    const _x = config.x;
    const _y = config.y;
    const _gird = config.grid;
    let _isVisited: boolean = false;
    let _isCurrent: boolean = false;
    let _walls: [boolean, boolean, boolean, boolean] = [true, true, true, true];

    this.update = () => {
        return this;
    };

    this.draw = () => {
        const dim = _gird.getWidth() / _gird.getSize();
        // this.p5.rect(_x * dim, _y * dim, dim, dim);
        drawWalls();
        return this;
    };

    this.getPosition = (): { _x: number; _y: number } => {
        return { _x, _y };
    };

    this.setWallStaus = (walls = [], stats = []) => {
        if (walls.length !== stats.length) throw 'Error!! wall and stats parameters should have the same length';
        for (let i = 0; i < walls.length; i++) {
            _walls[i] = stats[i];
        }
    };

    this.getter = ((prop) => {
        switch (prop) {
            case 'CURRENT':
                return _isCurrent;
            case 'VISITED':
                return _isVisited;
            case 'WALLS':
                return _walls;
            default:
                break;
        }
        throw new Error(`Unknown getter key: ${prop}`);
    }) as TTileGetter;

    this.setter = (action: TTileSetter) => {
        switch (action.type) {
            case 'VISITED':
                _isVisited = action.payload;
                break;
            case 'CURRENT':
                _isCurrent = action.payload;
                break;
            default:
                break;
        }
    };

    const drawWalls = () => {
        const dim = _gird.getWidth() / _gird.getSize();

        this.p5.push();
        this.p5.translate(_x * dim, _y * dim);

        //
        if (_isVisited) {
            this.p5.fill(255, 255, 255);
            this.p5.noStroke();
            this.p5.rect(0, 0, dim, dim);
        }

        if (_isCurrent) {
            this.p5.fill(128, 255, 255);
            this.p5.noStroke();
            this.p5.rect(0, 0, dim, dim);
        }

        this.p5.noFill();
        this.p5.stroke(255);
        // top wall
        _walls[0] && this.p5.line(0, 0, dim, 0);
        // right wall
        _walls[1] && this.p5.line(dim, 0, dim, dim);
        // bottom wall
        _walls[2] && this.p5.line(0, dim, dim, dim);
        // left wall
        _walls[3] && this.p5.line(0, 0, 0, dim);

        // label
        // this.p5.stroke(0);
        this.p5.fill(128);
        this.p5.text(this.id, dim / 2, dim / 2);
        //

        this.p5.pop();

        // console.log(this.id, _walls);
    };
} as unknown as { new (config: TTileConfig): TTile };
export default Tile;
