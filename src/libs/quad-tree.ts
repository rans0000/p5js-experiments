import P5 from 'p5';

interface TPoint {
    x: number;
    y: number;
}

type TQuadTreeConfig = {
    capacity: number;
    width: number;
    height: number;
    pos: TPoint;
};

class QuadTree {
    p5: P5;
    quad: Quad;
    subdivisions: QuadTree[];
    capacity: number;
    items: TPoint[];

    constructor(p5: P5, config: TQuadTreeConfig) {
        this.p5 = p5;
        this.items = [];
        this.quad = this.generateQuad(config.pos, config.width, config.height);
        this.subdivisions = [];
        this.capacity = config.capacity;
    }

    generateQuad(pos: TPoint, width: number, height: number) {
        const quad = new Quad(this.p5, pos, width, height);
        return quad;
    }

    subdivide() {
        const quad = this.quad;
        const w = quad.width / 4;
        const h = quad.height / 4;

        const ne = new QuadTree(this.p5, {
            capacity: this.capacity,
            height: h * 2,
            width: w * 2,
            pos: { x: quad.pos.x + w, y: quad.pos.y + h }
        });
        const nw = new QuadTree(this.p5, {
            capacity: this.capacity,
            height: h * 2,
            width: w * 2,
            pos: { x: quad.pos.x - w, y: quad.pos.y + h }
        });
        const se = new QuadTree(this.p5, {
            capacity: this.capacity,
            height: h * 2,
            width: w * 2,
            pos: { x: quad.pos.x + w, y: quad.pos.y - h }
        });
        const sw = new QuadTree(this.p5, {
            capacity: this.capacity,
            height: h * 2,
            width: w * 2,
            pos: { x: quad.pos.x - w, y: quad.pos.y - h }
        });
        this.subdivisions = [ne, nw, se, sw];
    }

    insert(item: TPoint): boolean {
        if (!this.quad.isWithinBounds(item)) return false;

        if (this.items.length < this.capacity) {
            this.items.push(item);
            return true;
        }
        if (!this.subdivisions.length) {
            this.subdivide();
        }
        for (let i = 0; i < this.subdivisions.length; i++) {
            const isDivided = this.subdivisions[i].insert(item);
            if (isDivided) return true;
        }
        return false;
    }

    query(range: Quad, found: TPoint[] = []): TPoint[] {
        if (!this.quad.isIntersects(range)) return [];

        for (const point of this.items) {
            if (range.isWithinBounds(point)) {
                found.push(point);
            }
        }

        for (const quad of this.subdivisions) {
            quad.query(range, found);
        }

        return found;
    }

    draw(): this {
        this.quad.draw();
        for (const quad of this.subdivisions) {
            quad.draw();
        }
        for (const item of this.items) {
            this.p5.stroke(255, 1);
            this.p5.circle(item.x, item.y, 2);
        }
        return this;
    }
}

export class Quad {
    p5: P5;
    pos: TPoint;
    width: number;
    height: number;

    constructor(p5: P5, pos: TPoint, width: number, height: number) {
        this.p5 = p5;
        this.pos = pos;
        this.width = width;
        this.height = height;
    }

    isWithinBounds(point: TPoint): boolean {
        const { x, y } = this.pos;
        const w = this.width / 2;
        const h = this.height / 2;
        return point.y <= y + h && point.x <= x + w && point.y > y - h && point.x > x - w;
    }

    isIntersects(range: Quad): boolean {
        const { x, y } = this.pos;
        const w = this.width / 2;
        const h = this.height / 2;
        return !(
            range.pos.y - range.height / 2 > y + h ||
            range.pos.x - range.width / 2 > x + w ||
            range.pos.y + range.height / 2 < y - h ||
            range.pos.x + range.width / 2 < x - w
        );
    }

    draw(): this {
        this.p5.rectMode(this.p5.CENTER);
        this.p5.stroke(255);
        this.p5.noFill();
        this.p5.rect(this.pos.x, this.pos.y, this.width, this.height);
        return this;
    }
}

/**--------------------------------- */
// functions

export default QuadTree;
