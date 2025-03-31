import { TMaze, TMazeConfig, TMazeSolvers, TMazeStrategy, TTile } from 'src/utils/types';
import { DFSNonRecursive } from './maze-strategies';
import Tile from './tile';

const Maze = function (this: TMaze, config: TMazeConfig) {
    this.p5 = config.p5;
    const _size = config.size;
    const _width = config.width;
    const _tiles: TTile[] = [];
    let _strategy: TMazeStrategy;

    this.update = (_deltatime: number) => {
        _strategy.solve();
        return this;
    };

    this.draw = () => {
        for (let y = 0; y < _size; y++) {
            for (let x = 0; x < _size; x++) {
                _tiles[x + y * _size].draw();
            }
        }
        return this;
    };

    this.getWidth = () => {
        return _width;
    };

    this.getSize = () => {
        return _size;
    };

    this.getTiles = () => {
        return _tiles;
    };

    const createTiles = () => {
        for (let y = 0; y < _size; y++) {
            for (let x = 0; x < _size; x++) {
                _tiles.push(new Tile({ p5: this.p5, id: y * _size + x, x, y, grid: this }));
            }
        }
    };

    this.setStrategy = (solver: TMazeSolvers) => {
        switch (solver) {
            // case 'Kruskal':
            //     _strategy = new Kruskal(this);
            //     break;
            case 'DFS_Recursive':
            default:
                _strategy = new DFSNonRecursive(this);
                break;
        }
    };

    this.getIndex = (i: number, j: number): number => {
        if (i < 0 || j < 0 || i > _size - 1 || j > _size - 1) {
            return -1;
        }
        return j * _size + i;
    };

    this.getNeighbours = (tile: TTile): TTile[] => {
        let neighbours: TTile[] = [];
        const { _x: x, _y: y } = tile.getPosition();

        // top
        const top = this.getTiles()[this.getIndex(x, y - 1)];
        top && !top.getter('VISITED') && neighbours.push(top);
        const right = this.getTiles()[this.getIndex(x + 1, y)];
        right && !right.getter('VISITED') && neighbours.push(right);
        const bottom = this.getTiles()[this.getIndex(x, y + 1)];
        bottom && !bottom.getter('VISITED') && neighbours.push(bottom);
        const left = this.getTiles()[this.getIndex(x - 1, y)];
        left && !left.getter('VISITED') && neighbours.push(left);

        return neighbours;
    };

    this.removeWalls = (current, next) => {
        const posA = current.getPosition();
        const posB = next.getPosition();

        const i = posA._x - posB._x;
        const j = posA._y - posB._y;

        if (i === 1) {
            current.setWallStaus([3], [false]);
            next.setWallStaus([1], [false]);
        } else if (i === -1) {
            current.setWallStaus([1], [false]);
            next.setWallStaus([3], [false]);
        }
        if (j === 1) {
            current.setWallStaus([0], [false]);
            next.setWallStaus([2], [false]);
        } else if (j === -1) {
            current.setWallStaus([2], [false]);
            next.setWallStaus([0], [false]);
        }
        console.log([current.id, next.id], i, j);
        console.log(current.getter('WALLS'));
    };

    const init = (config: TMazeConfig) => {
        createTiles();
        this.setStrategy(config.solver);
    };

    init(config);
} as unknown as { new (config: TMazeConfig): TMaze };

export default Maze;
