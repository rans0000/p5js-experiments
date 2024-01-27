import P5 from 'p5';
import { GUI } from 'dat.gui';

const options = {
    xOffset: 0,
    xIncrement: 0.007,
    yOffset: 0,
    yIncrement: 0.01,
    height: 400,
    width: 500
};

const gui = new GUI();
gui.add(options, 'xIncrement', 0, 0.04, 0.001);
gui.add(options, 'yIncrement', 0, 1, 0.001).name('Speed');
gui.add(options, 'height', 50, 500, 1);
gui.add(options, 'width', 200, 800, 1);

const sketch = (p5: P5) => {
    //setup
    p5.setup = () => {
        const canvas = p5.createCanvas(window.innerWidth, window.innerHeight);
        canvas.parent('app');
        p5.background('white');

        window.addEventListener('resize', () => {
            p5.resizeCanvas(window.innerWidth, window.innerHeight);
        });
    };

    //draw
    p5.draw = () => {
        const { innerWidth, innerHeight } = window;

        p5.background('#3c233f');
        p5.stroke('#8c81c1');
        p5.noFill();
        p5.beginShape();

        options.xOffset = options.yOffset;

        for (let i = 0; i < options.width; i++) {
            const x = i + innerWidth / 2 - options.width / 2;
            const y =
                p5.noise(options.xOffset) * options.height + innerHeight / 2 - options.height / 2;

            p5.vertex(x, y);
            options.xOffset += options.xIncrement;
        }
        p5.endShape();
        options.yOffset += options.yIncrement;
    };
};

new P5(sketch);
