import P5 from 'p5';

type TQuadTreeConfig = {
    maxItems: number;
    width: number;
    height: number;
};

class QuadTree {
    p5: P5;
    quads: Quad[];
    maxItems: number;

    constructor(p5: P5, _config: TQuadTreeConfig) {
        const config: TQuadTreeConfig = {
            ..._config
        };

        this.p5 = p5;
        this.quads = [];
        this.maxItems = config.maxItems;
    }

    update(_deltaTime: number): this {
        return this;
    }

    draw(): this {
        return this;
    }
}

class Quad {
    pos: P5.Vector;
    width: number;
    height: number;

    constructor(pos: P5.Vector, width: number, height: number) {
        this.pos = pos;
        this.width = width;
        this.height = height;
    }
}

/**--------------------------------- */
// functions

export default QuadTree;
