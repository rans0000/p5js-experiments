import { GUI } from 'dat.gui';
import P5 from 'p5';
import { MOUSE_BTN } from '../utils/utils';

let movers: Mover[] = [];
let attractors: Attractor[] = [];

const sketch = (p5: P5) => {
    const options = {
        moverCount: 10,
        clear: () => {
            init(p5);
            const { innerWidth, innerHeight } = window;
            attractors.push(new Attractor(p5, innerWidth / 2, innerHeight / 2, 20));
        }
    };
    const gui = new GUI({ autoPlace: false });
    gui.domElement.id = 'gui';
    document.getElementById('gui')?.appendChild(gui.domElement);
    gui.add(options, 'clear').name('Clear Attractors');
    gui.add(options, 'moverCount', 1, 30, 1)
        .name('Mover Count')
        .onChange(() => {
            init(p5);
        });

    /** setup */
    p5.setup = () => {
        const canvas = p5.createCanvas(window.innerWidth, window.innerHeight);
        document.oncontextmenu = function () {
            return false; // remove context menu
        };
        canvas.parent('app');
        p5.background('white');
        p5.pixelDensity(1);
        p5.colorMode(p5.HSB);

        window.addEventListener('resize', () => resizeDisplay(p5));
        init(p5);
    };

    /** draw */
    p5.draw = () => {
        p5.background(200, 60, 10, 0.2);
        for (let i = 0; i < movers.length; i++) {
            movers[i].update();
            movers[i].show();
        }
        for (let i = 0; i < attractors.length; i++) {
            for (let j = 0; j < movers.length; j++) {
                attractors[i].attract(movers[j]);
                attractors[i].show();
            }
        }
    };

    p5.mouseReleased = (event: MouseEvent) => {
        const { clientX, clientY, button } = event;
        attractors.push(new Attractor(p5, clientX, clientY, 20, button === MOUSE_BTN.LEFT));
        return false;
    };

    /**--------------------------------- */
    // functions

    function resizeDisplay(canvas: P5) {
        canvas.resizeCanvas(window.innerWidth, window.innerHeight);
    }

    function init(p5: P5) {
        p5.background(200, 60, 10);
        const { innerWidth, innerHeight } = window;
        movers = [];
        attractors = [];
        for (let i = 0; i < options.moverCount; i++) {
            const mover = new Mover(p5, p5.random(innerWidth), p5.random(innerHeight), 20);
            movers.push(mover);
        }
        attractors.push(new Attractor(p5, innerWidth / 2, innerHeight / 2, 10));
    }
};

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
    isAttractor: boolean;

    constructor(p5, x, y, m, isAttractor = true) {
        this.p5 = p5;
        this.pos = this.p5.createVector(x, y);
        this.mass = m;
        this.isAttractor = isAttractor;
    }

    show() {
        this.p5.noStroke();
        this.p5.fill(this.isAttractor ? '#00ff00' : '#ff0000');
        this.p5.ellipse(this.pos.x, this.pos.y, this.p5.sqrt(this.mass) * 5);
    }
    attract(mover: Mover) {
        let force = P5.Vector.sub(this.pos, mover.pos);
        let distanceSq = this.p5.constrain(force.magSq(), 25, 2500);
        const G = 0.5;
        const magnitude = G * ((this.mass * mover.mass) / distanceSq) * (this.isAttractor ? 1 : -1);
        force.setMag(magnitude);
        mover.applyForces(force);
    }
}

new P5(sketch);
