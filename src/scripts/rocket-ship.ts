import { GUI } from 'dat.gui';
import P5 from 'p5';

/**--------------------------------- */
// variables
const MIN_DISTANCE = 80;
const SPEED = 1;
const MAX_SPEED = 10;

enum FLIGHT_MODE {
    RANDOM,
    CONTROLLED
}
let rockets: Rocket[] = [];

/**--------------------------------- */
// sketch
const sketch = (p5: P5) => {
    const options = {
        pause: () => {
            p5.isLooping() ? p5.noLoop() : p5.loop();
        },
        rocketCount: 1
    };
    const gui = new GUI({ autoPlace: false });
    gui.domElement.id = 'gui';
    document.getElementById('gui')?.appendChild(gui.domElement);
    gui.add(options, 'pause').name('Pause/Unpause');
    gui.add(options, 'rocketCount', 1, 30, 1)
        .name('Rocket count')
        .onChange(() => {
            init(p5);
        });

    /** setup */
    p5.setup = () => {
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
        p5.background(200, 60, 10, 0.3);

        for (let i = 0; i < rockets.length; i++) {
            rockets[i].update(p5.deltaTime / 60);
            rockets[i].draw();
        }
    };

    /**--------------------------------- */
    // functions

    function resizeDisplay(canvas: P5) {
        canvas.resizeCanvas(window.innerWidth, window.innerHeight);
    }

    function init(p5: P5) {
        p5.background(200, 60, 10);
        rockets = [];
        const { innerWidth, innerHeight } = window;
        for (let i = 0; i < options.rocketCount; i++) {
            rockets.push(new Rocket(p5, p5.createVector(innerWidth / 2, innerHeight / 2)));
        }
    }
};

/**--------------------------------- */
// classes

class Rocket {
    p5: P5;
    pos: P5.Vector;
    velocity: P5.Vector;
    size: number;
    target: P5.Vector;
    flightMode: FLIGHT_MODE;

    constructor(p5: P5, pos: P5.Vector, size: number = 20, flightMode: FLIGHT_MODE = FLIGHT_MODE.RANDOM) {
        this.p5 = p5;
        this.size = size;
        this.pos = pos;
        this.flightMode = flightMode;
        this.velocity = P5.Vector.random2D();

        if (this.flightMode === FLIGHT_MODE.RANDOM) {
            this.pickTarget();
        }
    }

    update(deltaTime: number) {
        if (this.flightMode === FLIGHT_MODE.RANDOM) {
            this.randomWalk(deltaTime);
            return;
        }
    }

    draw() {
        this.pos.add(this.velocity);
        const angle = this.velocity.heading();
        this.p5.strokeWeight(1);
        this.p5.stroke(255, 200);
        this.p5.fill(25);
        this.p5.push();
        this.p5.translate(this.pos.x, this.pos.y);
        this.p5.rotate(angle);
        this.p5.triangle(-this.size, -this.size / 2, -this.size, this.size / 2, this.size, 0);
        this.p5.pop();
    }

    pickTarget() {
        this.target = this.p5.createVector(this.p5.random(window.innerWidth), this.p5.random(window.innerHeight));
    }
    randomWalk(deltaTime: number) {
        let targetVector = P5.Vector.sub(this.target, this.pos);
        const distanceToTarget = targetVector.mag();

        if (distanceToTarget <= MIN_DISTANCE) {
            this.pickTarget();
            return;
        }
        targetVector.setMag(SPEED * deltaTime);
        this.velocity.add(targetVector).limit(MAX_SPEED);
    }
}

new P5(sketch);
