import { GUI } from 'dat.gui';
import { Bodies, Composite, Engine } from 'matter-js';
import P5 from 'p5';
import CarromBoard from 'src/libs/carrom-board';

/**--------------------------------- */
let engine: Engine;
let carromBoard: CarromBoard;
let entities: any = [];
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
        for (const entity of entities) {
            p5.push();
            p5.rectMode(p5.CENTER);
            p5.stroke(255);
            p5.rect(entity.position.x, entity.position.y, 50, 50);
            p5.pop();
        }
    };

    /**--------------------------------- */
    // functions

    function resizeDisplay(canvas: P5) {
        canvas.resizeCanvas(window.innerWidth, window.innerHeight);
    }

    function init(p5: P5) {
        p5.background(200, 60, 10);
        const box = Bodies.rectangle(100, 100, 50, 50);
        const ground = Bodies.rectangle(200, 300, 400, 10, { isStatic: true });
        entities = [box, ground];
        Composite.add(engine.world, entities);
    }

    /**--------------------------------- */
    // classes
};

new P5(sketch);
