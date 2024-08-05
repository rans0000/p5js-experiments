import { GUI } from 'dat.gui';
import P5 from 'p5';
import InteractivePath from '../libs/interactive-path';
import { TPoints } from 'src/utils/types';

/**--------------------------------- */
// variables & types
let path: InteractivePath;
let collection: InteractivePath[] = [];

/**--------------------------------- */
// sketch
const sketch = (p5: P5) => {
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
        window.addEventListener('resize', () => resizeDisplay(p5));
        init(p5);
    };

    /** draw */
    p5.draw = () => {
        collection.forEach((item) => {
            item.update(p5.deltaTime).draw();
        });
    };

    /**--------------------------------- */
    // functions

    function resizeDisplay(canvas: P5) {
        canvas.resizeCanvas(window.innerWidth, window.innerHeight);
    }

    function init(p5: P5) {
        p5.background(200, 60, 10);

        path = new InteractivePath(p5);
        const points: TPoints[] = [
            [p5.createVector(200, 300), p5.createVector(250, 150), p5.createVector(550, 250), p5.createVector(730, 100)]
        ];
        path.setPoints(points);
        collection.push(path);
    }

    /**--------------------------------- */
    // classes
};

new P5(sketch);
