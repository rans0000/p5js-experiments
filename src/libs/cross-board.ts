import P5 from 'p5';

type TCrossBoard = {
    size: number;
};
type TCell = {
    pos: P5.Vector;
    neighbourIndex: number[];
    owner: 1 | 2 | undefined;
};

class CrossBoard {
    p5: P5;
    size: number;
    points: TCell[];

    constructor(p5: P5, _config?: Partial<TCrossBoard>) {
        const config: TCrossBoard = {
            size: 400,

            ..._config
        };
        this.p5 = p5;
        this.size = config.size;
        this.points = buildBoard(this.p5);
    }

    update(deltaTime: number): this {
        return this;
    }

    draw(): this {
        const dimension = this.size / 5;
        console.log(this.points.length);
        for (let i = 0; i < this.points.length; i++) {
            this.p5.circle(this.points[i].pos.x * dimension, this.points[i].pos.y * dimension, 10);
            console.log(this.points[i].neighbourIndex.length);

            this.points[i].neighbourIndex.forEach((index) => {
                this.p5.stroke(255);
                this.p5.line(
                    this.points[i].pos.x * dimension,
                    this.points[i].pos.y * dimension,
                    this.points[index].pos.x * dimension,
                    this.points[index].pos.y * dimension
                );
            });
        }
        return this;
    }
}

/**--------------------------------- */
// functions

function buildBoard(p5: P5) {
    const cells: TCell[] = [
        { pos: p5.createVector(0, 0), neighbourIndex: [1, 3, 5], owner: undefined },
        { pos: p5.createVector(2, 0), neighbourIndex: [0, 2, 3, 4], owner: undefined },
        { pos: p5.createVector(4, 0), neighbourIndex: [1, 4, 7], owner: undefined },

        { pos: p5.createVector(1, 1), neighbourIndex: [0, 1, 6, 5], owner: undefined },
        { pos: p5.createVector(3, 1), neighbourIndex: [1, 2, 7, 6], owner: undefined },

        { pos: p5.createVector(0, 2), neighbourIndex: [3, 6, 8, 10], owner: undefined },
        { pos: p5.createVector(2, 2), neighbourIndex: [3, 1, 4, 7, 9, 11, 8, 5], owner: undefined },
        { pos: p5.createVector(4, 2), neighbourIndex: [2, 12, 9, 6], owner: undefined },

        { pos: p5.createVector(1, 3), neighbourIndex: [5, 6, 11, 10], owner: undefined },
        { pos: p5.createVector(3, 3), neighbourIndex: [6, 7, 12, 11], owner: undefined },

        { pos: p5.createVector(0, 4), neighbourIndex: [5, 8, 11], owner: undefined },
        { pos: p5.createVector(2, 4), neighbourIndex: [8, 6, 9, 12, 10], owner: undefined },
        { pos: p5.createVector(4, 4), neighbourIndex: [9, 7, 11], owner: undefined }
    ];

    return cells;
}

export default CrossBoard;
