import { GUI } from 'dat.gui';
import P5 from 'p5';
import FractalTree from 'src/libs/fractal-tree';

/**--------------------------------- */
let tree: FractalTree;

/**--------------------------------- */
// sketch
const sketch = (p5: P5) => {
    const options = {
        generate: () => init(p5),
        animate: true,
        iterations: 7,
        leafRadius: 5,
        branchLength: 15,
        branchLengthDelta: 5,
        branchAngle: Math.PI / 12,
        branchAngleDelta: Math.PI / 6
    };

    const gui = new GUI({ autoPlace: false });
    gui.domElement.id = 'gui';
    document.getElementById('gui')?.appendChild(gui.domElement);
    gui.add(options, 'generate')
        .name('Generate tree')
        .onChange(() => {});
    gui.add(options, 'animate')
        .name('Animate')
        .onChange((val) => (val ? p5.loop() : p5.noLoop()));
    gui.add(options, 'iterations', 1, 12, 1).onChange(() => init(p5));
    gui.add(options, 'leafRadius', 1, 8, 1).onChange(() => init(p5));
    gui.add(options, 'branchLength', 1, 20, 1).onChange(() => init(p5));
    gui.add(options, 'branchLengthDelta', 0, 10, 0.1).onChange(() => init(p5));
    gui.add(options, 'branchAngle', 0, Math.PI / 4, 0.01).onChange(() => init(p5));
    gui.add(options, 'branchAngleDelta', 0, Math.PI / 12, 0.01).onChange(() => init(p5));

    /** setup */
    p5.setup = () => {
        const canvas = p5.createCanvas(window.innerWidth, window.innerHeight);
        canvas.parent('app');
        p5.background('white');
        p5.pixelDensity(1);
        p5.colorMode(p5.HSB);
        p5.frameRate(1);
        window.addEventListener('resize', () => resizeDisplay(p5));

        //
        init(p5);
    };

    /** draw */
    p5.draw = () => {
        p5.background(200, 60, 10);
        p5.translate(window.innerWidth / 2, window.innerHeight - 100);
        tree.generateVocab();
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
            iterations: options.iterations,
            leafRadius: options.leafRadius,
            branchLength: options.branchLength,
            branchLengthDelta: options.branchLengthDelta,
            branchAngle: options.branchAngle,
            branchAngleDelta: options.branchAngleDelta
        });
        p5.redraw();
    }

    /**--------------------------------- */
    // classes
};

new P5(sketch);
