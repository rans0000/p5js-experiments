import { GUI } from 'dat.gui';
import P5 from 'p5';
import QuadTree, { Quad } from 'src/libs/quad-tree';
import { MOUSE_BTN } from 'src/utils/utils';

/**--------------------------------- */
let qtree: QuadTree;
let selection: Quad;
const TOTAL = 1000;
/**--------------------------------- */
// sketch
const sketch = (p5: P5) => {
    const options = {
        clear: () => qtree.clear(),
        populate: () => {
            init(p5);
        },
        selectionSize: 100
    };

    const gui = new GUI({ autoPlace: false });
    gui.domElement.id = 'gui';
    document.getElementById('gui')?.appendChild(gui.domElement);
    gui.add(options, 'clear').name('Clear tree');
    gui.add(options, 'populate').name('Populte  tree');
    gui.add(options, 'selectionSize', 50, 200, 1)
        .name('Populte  tree')
        .onChange((val) => (selection.width = selection.height = val));

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
        QuadTree.count = 0;
        const points = qtree.query(selection);

        // draw stats
        p5.textSize(20);
        p5.noStroke();
        p5.fill(255);
        p5.textAlign(p5.RIGHT);
        p5.text(`Iterations/total: ${QuadTree.count}/${TOTAL}`, window.innerWidth - 20, 50);
        // console.log(QuadTree.count);

        for (const point of points) {
            p5.stroke(0, 255, 255);
            p5.circle(point.x, point.y, 2);
        }
    };

    p5.mouseReleased = (e: MouseEvent) => {
        if (e.button !== MOUSE_BTN.LEFT) return;
        qtree.insert({ x: e.clientX, y: e.clientY });
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
        for (let i = 0; i < TOTAL; i++) {
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
