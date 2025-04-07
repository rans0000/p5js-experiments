import { GUI } from 'dat.gui';
import P5 from 'p5';
import { MOUSE_BTN } from 'src/utils/utils';

/**--------------------------------- */
const TOTAL = 1000;
/**--------------------------------- */
// sketch
const sketch = (p5: P5) => {
    const options = {
        // clear: () => qtree.clear(),
        populate: () => {
            init(p5);
        },
        selectionSize: 100
    };

    const gui = new GUI({ autoPlace: false });
    gui.domElement.id = 'gui';
    document.getElementById('gui')?.appendChild(gui.domElement);
    // gui.add(options, 'clear').name('Clear tree');

    /** setup */
    p5.setup = () => {
        const canvas = p5.createCanvas(window.innerWidth, window.innerHeight);
        canvas.parent('app');
        p5.background('white');
        p5.pixelDensity(1);
        p5.colorMode(p5.HSB);
        window.addEventListener('resize', () => resizeDisplay(p5));

        //
        init(p5);
    };

    /** draw */
    p5.draw = () => {
        p5.background(200, 60, 10);
    };

    // p5.mouseReleased = (e: MouseEvent) => {
    //     if (e.button !== MOUSE_BTN.LEFT) return;
    // };

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
