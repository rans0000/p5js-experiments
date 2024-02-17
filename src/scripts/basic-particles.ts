import { GUI } from 'dat.gui';
import P5 from 'p5';
import Entity from '../libs/entity';
import Particle from '../libs/particle';

const options = {};
const collection: Entity[] = [];

const sketch = (p5: P5) => {
    const gui = new GUI({ autoPlace: false });
    gui.domElement.id = 'gui';
    document.getElementById('gui')?.appendChild(gui.domElement);

    //setup
    p5.setup = () => {
        const { innerWidth, innerHeight } = window;
        const canvas = p5.createCanvas(window.innerWidth, window.innerHeight);
        canvas.parent('app');
        p5.background('white');
        p5.pixelDensity(1);
        p5.colorMode(p5.HSB);

        window.addEventListener('resize', () => resizeDisplay(p5));
        for (let i = 0; i < 100; i++) {
            collection.push(
                new Particle(p5, collection, { x: p5.random(innerWidth), y: p5.random(innerHeight), r: p5.random(5, 25) })
            );
        }
    };

    //draw
    p5.draw = () => {
        collection.forEach((item) => item.draw(p5.deltaTime));
    };
};

function resizeDisplay(canvas: P5) {
    canvas.resizeCanvas(window.innerWidth, window.innerHeight);
}

new P5(sketch);
