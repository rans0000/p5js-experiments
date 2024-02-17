import { GUI } from 'dat.gui';
import P5 from 'p5';
import Entity from '../libs/entity';
import Particle from '../libs/particle';
import { TParticle } from '../utils/types';

/* ********************************************* */
class BouncingBall extends Particle {
    constructor(
        readonly p5: P5,
        readonly collection: Entity[],
        _config: TParticle = {}
    ) {
        super(p5, collection, _config);
    }

    update(deltaTime: number): this {
        super.update(deltaTime);
        return this;
    }

    draw(deltaTime: number): this {
        this.update(deltaTime);
        this.p5.stroke(255);
        this.p5.fill(128, 5);
        super.draw(deltaTime);
        return this;
    }
}

export default Particle;

/* ********************************************* */

const options = {};
const collection: Entity[] = [];

const sketch = (p5: P5) => {
    const gui = new GUI({ autoPlace: false });
    gui.domElement.id = 'gui';
    document.getElementById('gui')?.appendChild(gui.domElement);

    const gravity = p5.createVector(0, 0.02);
    const wind = p5.createVector(0.01, 0);
    let forces: P5.Vector[] = [];

    //setup
    p5.setup = () => {
        const { innerWidth, innerHeight } = window;
        const canvas = p5.createCanvas(window.innerWidth, window.innerHeight);
        canvas.parent('app');
        p5.background('white');
        p5.pixelDensity(1);
        p5.colorMode(p5.HSB);

        window.addEventListener('resize', () => resizeDisplay(p5));
        for (let i = 0; i < 2; i++) {
            collection.push(
                new BouncingBall(p5, collection, {
                    pos: p5.createVector(innerWidth / 2 + i * 150, innerHeight / 2),
                    r: Math.sqrt((i + 1) * 2) * 15,
                    mass: (i + 1) * 2
                })
            );
        }
    };

    //draw
    p5.draw = () => {
        p5.background('#4f4f95');
        forces = p5.mouseIsPressed ? [wind] : [];

        collection.forEach((item) =>
            item
                .applyForces(p5.deltaTime, forces, gravity)
                .update(p5.deltaTime)
                .draw(p5.deltaTime)
                .applyEdgeBounce(p5.deltaTime)
        );
    };
};

function resizeDisplay(canvas: P5) {
    canvas.resizeCanvas(window.innerWidth, window.innerHeight);
}

new P5(sketch);
