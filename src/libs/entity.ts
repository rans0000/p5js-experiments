import P5 from 'p5';

class Entity {
    x: number;
    y: number;
    r: number;

    constructor(
        readonly p5: P5,
        readonly collection: Entity[],
        x: number,
        y: number,
        r: number = 5
    ) {
        this.p5 = p5;
        this.collection = collection;
        this.x = x;
        this.y = y;
        this.r = r;
        collection.push(this);
    }

    process(deltaTime: number): void {}

    draw(deltaTime: number): void {
        this.process(deltaTime);
    }
}

export default Entity;
