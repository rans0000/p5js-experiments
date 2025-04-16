import { TEdgeData, TVertexData } from 'src/utils/types';
import { PathFindingManager } from './path-finding-manager';
import p5 from 'p5';

type TState = 'START' | 'DRAWGRID';
type TActionName = 'draw' | 'changeToDraw' | 'changeToStart';

export function UIMachine(p5: p5) {
    let graph: PathFindingManager<TVertexData, TEdgeData>;

    const uiMachine = {
        state: 'START' as TState,
        transition: {
            START: {
                draw: function () {
                    if (!graph) return;
                    graph.draw();
                },

                changeToDraw: function () {
                    console.log('start - changing to draw...');
                    this.changeState('DRAWGRID');
                }
            },
            DRAWGRID: {
                draw: function () {
                    console.log('drawgrid draw...');
                },
                changeToStart: function () {
                    console.log('start - changing to start...');
                    this.changeState('START');
                }
            }
        },
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

    function createGraph() {
        console.log('creating graph...');

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
                    pos: [x * size, y * size]
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

// let uiMachine = UIMachine();
// console.log(uiMachine.state);
// uiMachine.dispatch('draw');
// uiMachine.dispatch('search', 'dfs');
// uiMachine.dispatch('drawGrid');
// uiMachine.dispatch('changeToDraw');
// console.log(uiMachine.state);
// uiMachine.dispatch('draw');
// uiMachine.dispatch('drawGrid');
