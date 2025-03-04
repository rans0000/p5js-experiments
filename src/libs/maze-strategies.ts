import { TMazeStrategy, TMazeStrategyConstructor, TTileGrid } from 'src/utils/types';

const DFSNonRecursive: TMazeStrategyConstructor = function (this: TMazeStrategy, grid: TTileGrid) {
    this.grid = grid;
    this.solve = () => {
        console.log('solver dfs');
    };
} as any;

const Kruskal: TMazeStrategyConstructor = function (this: TMazeStrategy, grid: TTileGrid) {
    this.grid = grid;
    this.solve = () => {
        console.log('solver kurskal');
    };
} as any;

export { DFSNonRecursive, Kruskal };
