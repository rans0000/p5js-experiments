import P5 from 'p5';
import { GUI } from 'dat.gui';

const options = {
    xOffset: 0,
    yOffset: 0,
    phase: 0,
    phaseIncrement: 0.1,
    isAnimated: true,
    increment: 0.07,
    height: 200,
    width: 200,
    isFullscreen: false,
    dimensions: 200
};

const sketch = (p5: P5) => {
    const gui = new GUI({ autoPlace: false });
    gui.domElement.id = 'gui';
    document.getElementById('gui')?.appendChild(gui.domElement);

    gui.add(options, 'phase', 0, 200, 0.01);
    gui.add(options, 'increment', 0, 0.1, 0.001).name('scale');
    gui.add(options, 'dimensions', 50, 800, 1).onChange((size: number) => {
        (options.width = size), (options.height = size);
    });
    gui.add(options, 'isAnimated');
    gui.add(options, 'isFullscreen')
        .name('fullscreen')
        .onChange(() => resizeDisplay(p5));

    //setup
    p5.setup = () => {
        const canvas = p5.createCanvas(window.innerWidth, window.innerHeight);
        canvas.parent('app');
        p5.background('white');
        p5.pixelDensity(1);

        window.addEventListener('resize', () => resizeDisplay(p5));
    };

    //draw
    p5.draw = () => {
        p5.background('#3c233f');
        p5.loadPixels();

        options.yOffset = 0;
        const { innerWidth, innerHeight } = window;

        const X = innerWidth / 2 - options.width / 2;
        const Y = innerHeight / 2 - options.height / 2;

        for (let row = 0; row < options.height; row++) {
            options.xOffset = options.phase;

            for (let col = 0; col < options.width; col++) {
                // const index = (row * options.width + col) * 4;

                const T = innerWidth * (Y + row);
                const L = X + col;
                const index = (T + L) * 4;

                const value = p5.noise(options.xOffset, options.yOffset);

                p5.pixels[index + 0] = value * 255;
                p5.pixels[index + 1] = value * 255;
                p5.pixels[index + 2] = value * 255;
                p5.pixels[index + 3] = 255;

                options.xOffset += options.increment;
            }
            options.yOffset += options.increment;
        }

        options.phase += options.phaseIncrement * ~~options.isAnimated;

        p5.updatePixels();
    };
};

function resizeDisplay(canvas: P5) {
    options.width = options.isFullscreen ? window.innerWidth : options.dimensions;
    options.height = options.isFullscreen ? window.innerHeight : options.dimensions;
    canvas.resizeCanvas(window.innerWidth, window.innerHeight);
}

new P5(sketch);
