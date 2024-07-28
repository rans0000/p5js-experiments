import { GUI } from 'dat.gui';
import P5 from 'p5';
import InteractivePath from '../libs/interactive-path';
import { MOUSE_BTN } from '../utils/utils';
import { TPoints } from 'src/utils/types';

/* ********************************************* */

const collection: InteractivePath[] = [];

const sketch = (p5: P5) => {
    const gui = new GUI({ autoPlace: false });
    gui.domElement.id = 'gui';
    document.getElementById('gui')?.appendChild(gui.domElement);

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
        const points: TPoints[] = [[p5.createVector(20, 200), p5.createVector(200, 400), p5.createVector(400, 50)]];
        path.setPoints(points);
        collection.push(path);
    };

    p5.mouseReleased = (event: MouseEvent) => {
        switch (event.button) {
            case MOUSE_BTN.MIDDLE:
                path.togglePainting();
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
