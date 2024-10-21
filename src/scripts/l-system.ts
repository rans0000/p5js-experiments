import { GUI } from 'dat.gui';
import P5 from 'p5';
import FractalTree from 'src/libs/fractal-tree';

/**--------------------------------- */
let tree: FractalTree;

/**--------------------------------- */
// sketch
const sketch = (p5: P5) => {
    const options = {
        showHelpers: false,
        size: 400
    };

    const gui = new GUI({ autoPlace: false });
    gui.domElement.id = 'gui';
    document.getElementById('gui')?.appendChild(gui.domElement);

    /** setup */
    p5.setup = () => {
        const canvas = p5.createCanvas(window.innerWidth, window.innerHeight);
        canvas.parent('app');
        p5.background('white');
        p5.pixelDensity(1);
        p5.colorMode(p5.HSB);
        p5.noLoop();
        window.addEventListener('resize', () => resizeDisplay(p5));

        //
        init(p5);
    };

    /** draw */
    p5.draw = () => {
        p5.background(200, 60, 10);
        p5.translate(window.innerWidth / 2, window.innerHeight - 100);
        tree.update(p5.deltaTime).draw();
    };

    /**--------------------------------- */
    // functions

    function resizeDisplay(canvas: P5) {
        canvas.resizeCanvas(window.innerWidth, window.innerHeight);
    }

    function init(p5: P5) {
        p5.background(200, 60, 10);
        tree = new FractalTree(p5, {
            branchLength: 3
        });
        tree.generateVocab(7);
    }

    /**--------------------------------- */
    // classes
};

new P5(sketch);
