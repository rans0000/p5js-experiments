import P5 from 'p5';
import Entity from './entity';

class Particle extends Entity {
    constructor(
        readonly p5: P5,
        readonly collection: Entity[],
        x: number,
        y: number,
        r: number = 5
    ) {
        super(p5, collection, x, y, r);
    }

    process(deltaTime: number): void {
        this.x += this.p5.random(-2, 2);
        this.y += this.p5.random(-2, 2);
    }

    draw(deltaTime: number): void {
        this.process(deltaTime);
        this.p5.noStroke();
        this.p5.fill(this.p5.random(150, 200), this.p5.random(0, 140), this.p5.random(40, 80));
        this.p5.ellipse(this.x, this.y, this.r, this.r);
    }
}

export default Particle;
