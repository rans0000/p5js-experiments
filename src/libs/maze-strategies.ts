import { TMazeStrategy, TMazeStrategyConstructor, TTile, TTileGrid } from 'src/utils/types';

const DFSNonRecursive: TMazeStrategyConstructor = function (this: TMazeStrategy, grid: TTileGrid) {
    const _grid = grid;
    let current: TTile = _grid.getTiles()[0];
    let next: TTile;

    this.solve = () => {
        current.setter({ type: 'VISITED', payload: true });
        current.setter({ type: 'CURRENT', payload: true });
        const neighbours = _grid.getNeighbours(current);

        if (neighbours.length > 0) {
            const pick = Math.floor(Math.random() * neighbours.length);
            const next = neighbours[pick];
            // console.log(
            //     current.id,
            //     neighbours.map((i) => i.id),
            //     pick,
            //     next.id
            // );
            if (next) {
                next.setter({ type: 'VISITED', payload: true });
                current.setter({ type: 'CURRENT', payload: false });
                current = next;
            }
        }
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
