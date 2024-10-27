import { GUI } from 'dat.gui';
import { Engine } from 'matter-js';
import P5 from 'p5';
import CarromBoard from 'src/libs/carrom-board';

/**--------------------------------- */
let engine: Engine;
let carromBoard: CarromBoard;
const borderWidth = 50;
/**--------------------------------- */
// sketch
const sketch = (p5: P5) => {
    /** setup */
    p5.setup = () => {
        const canvas = p5.createCanvas(window.innerWidth, window.innerHeight);
        engine = Engine.create();
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
        Engine.update(engine);
        carromBoard.draw();
    };

    /**--------------------------------- */
    // functions

    function resizeDisplay(canvas: P5) {
        canvas.resizeCanvas(window.innerWidth, window.innerHeight);
    }

    function init(p5: P5) {
        p5.background(200, 60, 10);

        const size = Math.min(window.innerWidth - borderWidth, window.innerHeight - borderWidth);
        carromBoard = new CarromBoard(p5, { size, borderWidth, parent: engine.world, type: 'carrorm' });
    }

    /**--------------------------------- */
    // classes
};

new P5(sketch);
