import { TMazeStrategy, TMazeStrategyConstructor, TTile, TTileGrid } from 'src/utils/types';

const DFSNonRecursive: TMazeStrategyConstructor = function (this: TMazeStrategy, grid: TTileGrid) {
    const _grid = grid;
    let current: TTile = _grid.getTiles()[0];

    this.solve = () => {
        // console.log('solver dfs');
        current.setter({ type: 'VISITED', payload: true });
    };

    const init = () => {};
    init();
} as any;

// const Kruskal: TMazeStrategyConstructor = function (this: TMazeStrategy, grid: TTileGrid) {
//     const _grid = grid;
//     this.solve = () => {
//         console.log('solver kurskal');
//     };

//     const init = () => {};
//     init();
// } as any;

export { DFSNonRecursive };
