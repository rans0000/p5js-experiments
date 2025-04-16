import p5 from 'p5';
import { TEdgeData, TVertexData } from 'src/utils/types';
import { PathFindingManager } from './path-finding-manager';

type TState = 'START' | 'DRAWGRID';
type TActionName = 'draw' | 'changeToDraw' | 'toggleWalls' | 'changeToStart';
type TActionFunctions = {
    draw: () => void;
    changeToDraw: () => void;
    toggleWalls: (pos: [number, number]) => void;
    changeToStart: () => void;
};
type TTransitionTable = {
    [K in TState]: Partial<Record<TActionName, (payload?: unknown) => void>>;
};
type TDispatch = <T extends keyof TActionFunctions>(
    actionName: T,
    ...args: Parameters<TActionFunctions[T]>
) => ReturnType<TActionFunctions[T]>;
type TUiMachine = {
    state: TState;
    actions: TActionFunctions;
    transition: TTransitionTable;
    dispatch: TDispatch;
    changeState: (newState: TState) => void;
};

export function UIMachine(p5: p5) {
    let graph: PathFindingManager<TVertexData, TEdgeData>;

    const uiMachine: TUiMachine = {
        state: 'START',
        actions: {
            draw: function () {
                if (!graph) return;
                graph.draw();
            },
            changeToDraw: function () {
                console.log('start - changing to draw...');
                uiMachine.changeState('DRAWGRID');
            },
            toggleWalls: function (pos: [number, number]) {
                if (!graph) return;
                graph.toggleVertexActiveStatus(pos);
            },
            changeToStart: function () {
                console.log('start - changing to start...');
                uiMachine.changeState('START');
            }
        },
        transition: {} as TTransitionTable,
        dispatch: function (actionName, ...args) {
            const state = this.transition[this.state];
            const action = state[actionName];

            if (action) {
                return action.call(this, ...args);
            } else {
                console.log(`no method ${actionName}() in ${this.state}`);
            }
        },
        changeState: function (newState: TState) {
            if (this.transition.hasOwnProperty(newState)) {
                this.state = newState;
            }
        }
    };
    uiMachine.transition = {
        START: {
            draw: uiMachine.actions.draw.bind(uiMachine),
            changeToDraw: uiMachine.actions.changeToDraw.bind(uiMachine)
        },
        DRAWGRID: {
            draw: uiMachine.actions.draw.bind(uiMachine),
            toggleWalls: uiMachine.actions.toggleWalls.bind(uiMachine),
            changeToStart: uiMachine.actions.changeToStart.bind(uiMachine)
        }
    };

    function createGraph(force: boolean = true) {
        console.log(`creating graph... ${force}`);
        if (graph && !force) return;

        const size = 50;
        const rows = 10;
        // const columns = 3;
        graph = new PathFindingManager<TVertexData, TEdgeData>(p5);
        graph.buildGrid(
            rows,
            rows,
            (x, y) => {
                return {
                    num: y * rows + x,
                    x,
                    y,
                    pos: [x * size, y * size],
                    isWall: false
                };
            },
            (start, end) => {
                return {
                    start: [start.data!.pos[0], start.data!.pos[1]],
                    end: [end.data!.pos[0], end.data!.pos[1]]
                };
            }
        );
    }

    function dispatch<T extends keyof TActionFunctions>(
        actionName: T,
        ...arg: Parameters<TActionFunctions[T]>
    ): ReturnType<TActionFunctions[T]> {
        return uiMachine.dispatch.call(uiMachine, actionName, ...arg);
    }

    return {
        createGraph,
        dispatch,
        get state() {
            return uiMachine.state;
        }
    };
}
