import { GUI } from 'dat.gui';
import P5 from 'p5';
import InteractivePath from '../libs/interactive-path';
import { MOUSE_BTN } from '../utils/utils';

/* ********************************************* */
type TMode = 'view' | 'draw';
let collection: InteractivePath[] = [];
const sketch = (p5: P5) => {
    let options = {
        mode: 'view' as TMode,
        clear: clear
    };

    function clear() {
        path.setPoints([]);
    }

    function toggleDrawMode(mode: TMode) {
        console.log(mode);
        switch (mode) {
            case 'view':
                path?.stopPainting();
                break;
            case 'draw':
                path?.startPainting();
                break;
            default:
                break;
        }
    }

    const gui = new GUI({ autoPlace: false });
    gui.domElement.id = 'gui';
    document.getElementById('gui')?.appendChild(gui.domElement);
    gui.add(options, 'mode', ['view', 'draw']).onChange(toggleDrawMode);
    gui.add(options, 'clear').name('Clear');

    let path: InteractivePath;

    //setup
    p5.setup = () => {
        const canvas = p5.createCanvas(window.innerWidth, window.innerHeight);
        canvas.parent('app');
        p5.background('white');
        p5.pixelDensity(1);
        p5.colorMode(p5.HSB);

        window.addEventListener('resize', () => resizeDisplay(p5));
        document.oncontextmenu = function () {
            return false;
        };

        path = new InteractivePath(p5);
        collection.push(path);
    };

    p5.mouseReleased = (event: MouseEvent) => {
        switch (event.button) {
            case MOUSE_BTN.LEFT:
                if (options.mode === 'draw') {
                    path?.startPainting();
                }
                break;
            case MOUSE_BTN.RIGHT:
                if (options.mode === 'draw') {
                    path?.stopPainting();
                }
                break;
            default:
                break;
        }
    };

    //draw
    p5.draw = () => {
        p5.clear();
        collection.forEach((item) => item.update(p5.deltaTime).draw());
    };
};

function resizeDisplay(canvas: P5) {
    canvas.resizeCanvas(window.innerWidth, window.innerHeight);
}

new P5(sketch);
