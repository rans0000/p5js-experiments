import { GUI } from 'dat.gui';
import P5 from 'p5';
import { UIMachine } from './path-finding-states';
// import { MOUSE_BTN } from 'src/utils/utils';

/**--------------------------------- */
type TMode = 'view' | 'draw';
type TAlgo = 'dfs' | 'bfs' | 'dijkstra' | 'astar';

/**--------------------------------- */
// sketch
const sketch = (p5: P5) => {
    let uiMachine = UIMachine(p5);

    const options = {
        mode: 'view' as TMode,
        populate: () => {
            init(p5);
        },
        selectionSize: 100,
        algo: 'dfs' as TAlgo
    };

    const gui = new GUI({ autoPlace: false });
    gui.domElement.id = 'gui';
    document.getElementById('gui')?.appendChild(gui.domElement);
    gui.add(options, 'mode', ['view', 'draw']).onChange((val: TMode) => toggleDrawMode(val, false));
    toggleDrawMode('view', true);

    function toggleDrawMode(val: TMode, force: boolean) {
        let folder;
        switch (val) {
            case 'view':
                folder = gui.addFolder('Search Algos');
                folder.open();
                folder.add(options, 'algo', ['dfs', 'bfs']);
                uiMachine.dispatch('changeToStart');
                uiMachine.createGraph(force);
                break;
            case 'draw':
                folder = gui.__folders['Search Algos'];
                gui.removeFolder(folder);
                uiMachine.dispatch('changeToDraw');
                break;
            default:
                break;
        }
    }
    /** setup */
    p5.setup = () => {
        const canvas = p5.createCanvas(window.innerWidth, window.innerHeight);
        canvas.parent('app');
        p5.background('white');
        p5.pixelDensity(1);
        p5.colorMode(p5.HSB);
        // p5.noLoop();
        window.addEventListener('resize', () => resizeDisplay(p5));

        //
        init(p5);
    };

    /** draw */
    p5.draw = () => {
        p5.background(200, 60, 10);
        uiMachine.dispatch('draw');
    };

    p5.mouseClicked = (e: MouseEvent) => {
        uiMachine.dispatch('toggleWalls', [e.clientX, e.clientY]);
    };

    /**--------------------------------- */
    // functions

    function resizeDisplay(canvas: P5) {
        canvas.resizeCanvas(window.innerWidth, window.innerHeight);
    }

    function init(p5: P5) {
        p5.background(200, 60, 10);
    }

    /**--------------------------------- */
    // classes
};

new P5(sketch);
