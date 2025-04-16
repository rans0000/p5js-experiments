import p5 from 'p5';
import { TEdgeData, TVertexData } from 'src/utils/types';
import { PathFindingManager } from './path-finding-manager';

type TState = 'START' | 'DRAWGRID';
type TActionName = 'draw' | 'changeToDraw' | 'changeToStart' | 'toggleWalls';

export function UIMachine(p5: p5) {
    let graph: PathFindingManager<TVertexData, TEdgeData>;

    const uiMachine = {
        state: 'START' as TState,
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
                graph.selectVertex(pos);
            },
            changeToStart: function () {
                console.log('start - changing to start...');
                uiMachine.changeState('START');
            }
        },
        transition: {} as Record<string, Record<string, Function>>,
        dispatch: function (actionName: TActionName, payload?: unknown) {
            const state = this.transition[this.state];
            const action = state[actionName];

            if (action) {
                action.call(this, payload);
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

    function dispatch(actionName: TActionName, payload?: unknown) {
        return uiMachine.dispatch.call(uiMachine, actionName, payload);
    }

    return {
        createGraph,
        dispatch,
        get state() {
            return uiMachine.state;
        }
    };
}
