import P5 from 'p5';
import { GUI } from 'dat.gui';

const options = {
    xOffset: 0,
    yOffset: 0,
    phase: 0,
    phaseIncrement: 0.1,
    isAnimated: true,
    increment: 0.07,
    height: 400,
    width: 400
};

const gui = new GUI();
gui.add(options, 'phase', 0, 200, 0.01);
gui.add(options, 'increment', 0, 0.1, 0.001);
gui.add(options, 'height', 200, 800, 1);
gui.add(options, 'width', 200, 800, 1);
gui.add(options, 'isAnimated');

const sketch = (p5: P5) => {
    //setup
    p5.setup = () => {
        const canvas = p5.createCanvas(options.width, options.height);
        canvas.parent('app');
        p5.background('white');
        p5.pixelDensity(1);

        // window.addEventListener('resize', () => {
        //     p5.resizeCanvas(window.innerWidth, window.innerHeight);
        // });
    };

    //draw
    p5.draw = () => {
        const { innerWidth, innerHeight } = window;
        p5.background('#3c233f');
        p5.loadPixels();

        options.yOffset = 0;

        for (let row = 0; row < options.height; row++) {
            options.xOffset = options.phase;

            for (let col = 0; col < options.width; col++) {
                const index = (row * options.width + col) * 4;

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

    // p5.noLoop();
};

new P5(sketch);
