import { TMaze, TMazeStrategy, TMazeStrategyConstructor, TTile } from 'src/utils/types';

const DFSNonRecursive: TMazeStrategyConstructor = function (this: TMazeStrategy, grid: TMaze) {
    const _grid = grid;
    let _current: TTile;
    let _next: TTile;
    let _stack: TTile[] = [_grid.getTiles()[0]];

    this.solve = () => {
        if (_stack.length <= 0) return true;

        _current = _stack.pop() as TTile;
        _current.setter({ type: 'VISITED', payload: true });
        _current.setter({ type: 'CURRENT', payload: false });

        const neighbours = _grid.getNeighbours(_current);

        if (neighbours.length > 0) {
            // 2.1
            _stack.push(_current);
            // 2.2
            const pick = Math.floor(Math.random() * neighbours.length);
            _next = neighbours[pick];
            // 2.3
            _grid.removeWalls(_current, _next);

            _next.setter({ type: 'CURRENT', payload: true });

            // 2.4
            _stack.push(_next);
        }

        return false;
    };

    const init = () => {};
    init();
} as any;

// const Kruskal: TMazeStrategyConstructor = function (this: TMazeStrategy, grid: TMaze) {
//     const _grid = grid;
//     this.solve = () => {
//     };

//     const init = () => {};
//     init();
// } as any;

export { DFSNonRecursive };
