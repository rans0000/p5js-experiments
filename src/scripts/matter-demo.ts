import { GUI } from 'dat.gui';
import { Engine, Render, Runner, Bodies, Composite } from 'matter-js';
import P5 from 'p5';

/**--------------------------------- */
var engine = Engine.create();
/**--------------------------------- */
// sketch
const sketch = (p5: P5) => {
    Engine;
    const options = {};

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

        //
        init(p5);
    };

    /** draw */
    p5.draw = () => {
        p5.background(200, 60, 10);
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
