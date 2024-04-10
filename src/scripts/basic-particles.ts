import { GUI } from 'dat.gui';
import P5 from 'p5';
import Entity from '../libs/entity';
import Particle2D from '../libs/particle2D';
import { TEntity } from '../utils/types';

/* ********************************************* */
class BasicParticle extends Particle2D {
    delta: number;

    constructor(
        readonly p5: P5,
        readonly collection: Entity[],
        _config: TEntity = {}
    ) {
        super(p5, collection, _config);
        this.delta = p5.random(255);
    }

    update(deltaTime: number): this {
        this.pos.x += this.p5.random(-2, 2);
        this.pos.y += this.p5.random(-2, 2);
        this.delta = (this.delta + deltaTime / 1000) % 255;
        return this;
    }

    draw(deltaTime: number): this {
        this.update(deltaTime);
        this.p5.noStroke();
        const h = this.p5.noise(this.delta) * 255;
        const s = this.p5.noise(this.delta + 10) * 255;
        const v = this.p5.noise(this.delta + 100) * 255;
        this.p5.fill(h, s, v, this.p5.random(0.1));
        super.draw(deltaTime);
        return this;
    }
}

export default BasicParticle;

/* ********************************************* */

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
                new BasicParticle(p5, collection, {
                    pos: p5.createVector(p5.random(innerWidth), p5.random(innerHeight)),
                    r: p5.random(5, 25)
                })
            );
        }
    };

    //draw
    p5.draw = () => {
        collection.forEach((item) => item.update(p5.deltaTime).draw(p5.deltaTime));
    };
};

function resizeDisplay(canvas: P5) {
    canvas.resizeCanvas(window.innerWidth, window.innerHeight);
}

new P5(sketch);
