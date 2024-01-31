import P5 from 'p5';
import { GUI } from 'dat.gui';

const options = {};

const sketch = (p5: P5) => {
    const gui = new GUI({ autoPlace: false });
    gui.domElement.id = 'gui';
    document.getElementById('gui')?.appendChild(gui.domElement);

    const radius = 5;
    let pos = p5.createVector(0, 0);
    let prev = p5.createVector(0.0);

    //setup
    p5.setup = () => {
        const canvas = p5.createCanvas(window.innerWidth, window.innerHeight);
        canvas.parent('app');
        p5.background('white');
        p5.pixelDensity(1);
        p5.colorMode(p5.HSB);

        window.addEventListener('resize', () => resizeDisplay(p5));
    };

    //draw
    p5.draw = () => {
        p5.translate(innerWidth / 2, innerHeight / 2);
        prev = pos.copy();
        pos.add(p5.createVector(p5.random(-5, 5), p5.random(-5, 5)).setMag(p5.random(5)));
        p5.noStroke();
        p5.fill(p5.random(200, 255), p5.random(128, 180), p5.random(100, 110));
        p5.ellipse(pos.x, pos.y, radius, radius);
    };
};

function resizeDisplay(canvas: P5) {
    canvas.resizeCanvas(window.innerWidth, window.innerHeight);
}

new P5(sketch);
