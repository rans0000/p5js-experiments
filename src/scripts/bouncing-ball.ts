import { GUI } from 'dat.gui';
import P5 from 'p5';
import Entity from '../libs/entity';
import Particle from '../libs/particle';
import { TEntity } from '../utils/types';

/* ********************************************* */
class BouncingBall extends Particle {
    constructor(
        readonly p5: P5,
        readonly collection: Entity[],
        _config: TEntity = {}
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
    let forces = [gravity];

    //setup
    p5.setup = () => {
        const { innerWidth, innerHeight } = window;
        const canvas = p5.createCanvas(window.innerWidth, window.innerHeight);
        canvas.parent('app');
        p5.background('white');
        p5.pixelDensity(1);
        p5.colorMode(p5.HSB);

        window.addEventListener('resize', () => resizeDisplay(p5));
        for (let i = 0; i < 1; i++) {
            collection.push(
                new BouncingBall(p5, collection, {
                    pos: p5.createVector(innerWidth / 2, innerHeight / 2),
                    r: 30
                })
            );
        }
    };

    //draw
    p5.draw = () => {
        p5.background('#4f4f95');
        forces = p5.mouseIsPressed ? [gravity, wind] : [gravity];

        collection.forEach((item) =>
            item.applyForces(p5.deltaTime, forces).update(p5.deltaTime).draw(p5.deltaTime).applyEdgeWrap(p5.deltaTime)
        );
    };
};

function resizeDisplay(canvas: P5) {
    canvas.resizeCanvas(window.innerWidth, window.innerHeight);
}

new P5(sketch);
