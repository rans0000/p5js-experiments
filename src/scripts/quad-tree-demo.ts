import { GUI } from 'dat.gui';
import P5 from 'p5';
import QuadTree, { Quad } from 'src/libs/quad-tree';
import { MOUSE_BTN } from 'src/utils/utils';

/**--------------------------------- */
let qtree: QuadTree;
let selection: Quad;

/**--------------------------------- */
// sketch
const sketch = (p5: P5) => {
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
        qtree.draw();

        selection.pos = { x: p5.mouseX, y: p5.mouseY };
        p5.rectMode(p5.CENTER);
        p5.stroke(128, 255, 255);
        p5.rect(selection.pos.x, selection.pos.y, selection.width, selection.height);
    };

    p5.mouseReleased = (e: MouseEvent) => {
        if (e.button !== MOUSE_BTN.LEFT) return;
        qtree.insert({ x: e.clientX, y: e.clientY });
        console.log(qtree);
    };

    /**--------------------------------- */
    // functions

    function resizeDisplay(canvas: P5) {
        canvas.resizeCanvas(window.innerWidth, window.innerHeight);
    }

    function init(p5: P5) {
        const size = 500;
        const { innerWidth, innerHeight } = window;
        p5.background(200, 60, 10);
        const pos = p5.createVector(innerWidth / 2, innerHeight / 2);
        qtree = new QuadTree(p5, { pos, capacity: 4, width: size, height: size });

        selection = new Quad(p5, { x: 0, y: 0 }, 100, 100);

        // draw points
        for (let i = 0; i < 500; i++) {
            const pos = {
                x: p5.randomGaussian(innerWidth / 2, 100),
                y: p5.randomGaussian(innerHeight / 2, 100)
            };
            qtree.insert(pos);
        }
    }

    /**--------------------------------- */
    // classes
};

new P5(sketch);
