import { GUI } from 'dat.gui';
import P5 from 'p5';

let movers: Mover[] = [];
let attractors: Attractor[] = [];
const moverCount = 10;

const sketch = (p5: P5) => {
    const gui = new GUI({ autoPlace: false });
    gui.domElement.id = 'gui';
    document.getElementById('gui')?.appendChild(gui.domElement);

    /** setup */
    p5.setup = () => {
        const { innerWidth, innerHeight } = window;
        const canvas = p5.createCanvas(window.innerWidth, window.innerHeight);
        canvas.parent('app');
        p5.background('white');
        p5.pixelDensity(1);
        p5.colorMode(p5.HSB);

        window.addEventListener('resize', () => resizeDisplay(p5));
        init(p5);
    };

    /** draw */
    p5.draw = () => {
        p5.background(0, 0.1);
        for (let i = 0; i < moverCount; i++) {
            movers[i].update();
            movers[i].show();

            attractors[0].attract(movers[i]);
            attractors[0].show();
        }
    };
};

/**--------------------------------- */
// functions

function resizeDisplay(canvas: P5) {
    canvas.resizeCanvas(window.innerWidth, window.innerHeight);
}

function init(p5: P5) {
    const { innerWidth, innerHeight } = window;
    for (let i = 0; i < 10; i++) {
        const mover = new Mover(p5, p5.random(innerWidth), p5.random(innerHeight), 10);
        movers.push(mover);
    }
    attractors.push(new Attractor(p5, innerWidth / 2, innerHeight / 2, 10));
}

/**--------------------------------- */
// classes

class Mover {
    p5: P5;
    pos: P5.Vector;
    mass: number;
    velocity: P5.Vector;
    accelaration: P5.Vector;
    r: number;

    constructor(p5, x, y, m, velocity = P5.Vector.random2D()) {
        this.p5 = p5;
        this.pos = this.p5.createVector(x, y);
        this.velocity = velocity;
        this.mass = m;
        this.accelaration = this.p5.createVector(0, 0);
        this.r = this.p5.sqrt(this.mass) * 2;
    }

    show() {
        this.p5.stroke(255);
        this.p5.strokeWeight(2);
        this.p5.fill(255, 100);
        this.p5.ellipse(this.pos.x, this.pos.y, this.r * 2);
    }

    applyForces(force: P5.Vector) {
        const f = P5.Vector.div(force, this.mass);
        this.accelaration.add(force);
    }

    update() {
        this.velocity.add(this.accelaration);
        this.pos.add(this.velocity);
        this.accelaration.set(0, 0);
    }
}

class Attractor {
    p5: P5;
    pos: P5.Vector;
    mass: number;

    constructor(p5, x, y, m) {
        this.p5 = p5;
        this.pos = this.p5.createVector(x, y);
        this.mass = m;
    }

    show() {
        this.p5.stroke(0);
        this.p5.fill('#ff0000');
        this.p5.ellipse(this.pos.x, this.pos.y, this.p5.sqrt(this.mass) * 2);
    }
    attract(mover: Mover) {
        let force = P5.Vector.sub(this.pos, mover.pos);
        let distanceSq = this.p5.constrain(force.magSq(), 25, 2500);
        const G = 0.5;
        const magnitude = G * ((this.mass * mover.mass) / distanceSq);
        force.setMag(magnitude);
        mover.applyForces(force);
    }
}

new P5(sketch);
