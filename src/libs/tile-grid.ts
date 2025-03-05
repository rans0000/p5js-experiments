import { TMazeSolvers, TMazeStrategy, TTile, TTileGrid, TTileGridConfig } from 'src/utils/types';
import { DFSNonRecursive } from './maze-strategies';
import Tile from './tile';

const TileGrid = function (this: TTileGrid, config: TTileGridConfig) {
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
                _tiles.push(new Tile({ p5: this.p5, x, y, grid: this }));
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

    const init = (config: TTileGridConfig) => {
        createTiles();
        this.setStrategy(config.solver);
    };

    init(config);
} as unknown as { new (config: TTileGridConfig): TTileGrid };

export default TileGrid;
