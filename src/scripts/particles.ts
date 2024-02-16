import P5 from 'p5';
import { GUI } from 'dat.gui';

const options = {};
const collection: Entity[] = [];

class Entity {
    constructor(
        readonly p5: P5,
        readonly x: number,
        readonly y: number,
        readonly r: number = 5
    ) {
        this.p5 = p5;
        this.x = x;
        this.y = y;
        this.r = r;
        collection.push(this);
    }

    draw(): void {
        this.p5.stroke(255);
        this.p5.fill(255);
        this.p5.ellipse(this.x, this.y, this.r, this.r);
    }
}
class Particle extends Entity {
    constructor(
        p5: P5,
        readonly x: number,
        readonly y: number,
        readonly r: number = 5
    ) {
        super(p5, x, y, r);
    }
}

const sketch = (p5: P5) => {
    const gui = new GUI({ autoPlace: false });
    gui.domElement.id = 'gui';
    document.getElementById('gui')?.appendChild(gui.domElement);

    const radius = 5;
    let pos = p5.createVector(0, 0);
    let prev = p5.createVector(0.0);

    //setup
    p5.setup = () => {
        const { innerWidth, innerHeight } = window;
        const canvas = p5.createCanvas(window.innerWidth, window.innerHeight);
        canvas.parent('app');
        p5.background('white');
        p5.pixelDensity(1);

        window.addEventListener('resize', () => resizeDisplay(p5));
        for (let i = 0; i < 100; i++) {
            collection.push(new Particle(p5, p5.random(innerWidth), p5.random(innerHeight), p5.random(20)));
        }
    };

    //draw
    p5.draw = () => {
        collection.forEach((item) => item.draw());
    };
};

function resizeDisplay(canvas: P5) {
    canvas.resizeCanvas(window.innerWidth, window.innerHeight);
}

new P5(sketch);
