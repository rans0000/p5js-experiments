import { GUI } from 'dat.gui';
import P5 from 'p5';
import Entity from '../libs/entity';
import Particle2D from '../libs/particle2D';
import { TApplicableForces, TParticle } from '../utils/types';

/* ********************************************* */
class BouncingBall extends Particle2D {
    constructor(
        readonly p5: P5,
        readonly collection: Entity[],
        _config: TParticle = {}
    ) {
        super(p5, collection, _config);
    }

    update(deltaTime: number, forceConfig: TApplicableForces): this {
        super.update(deltaTime, forceConfig);
        return this;
    }

    draw(deltaTime: number): this {
        this.p5.stroke(255);
        this.p5.fill(128, 5);
        super.draw(deltaTime);
        return this;
    }
}

/* ********************************************* */

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
        for (let i = 0; i < 2; i++) {
            collection.push(
                new BouncingBall(p5, collection, {
                    pos: p5.createVector(innerWidth / 2 + i * 150, innerHeight / 2),
                    r: Math.sqrt((i + 1) * 2) * 15,
                    mass: (i + 1) * 2,
                    mu: 0.1
                })
            );
        }
    };

    //draw
    p5.draw = () => {
        p5.background('#4f4f95');
        const isWindActive = p5.mouseIsPressed;

        collection.forEach((item) => item.update(p5.deltaTime, { wind: isWindActive }).draw(p5.deltaTime));
    };
};

function resizeDisplay(canvas: P5) {
    canvas.resizeCanvas(window.innerWidth, window.innerHeight);
}

new P5(sketch);
