import P5 from 'p5';
import { Gamer } from 'src/utils/utils';

type TCrossBoard = {
    size: number;
    offset: P5.Vector;
    showHelpers: boolean;
    currentPlayer: Gamer;
};
type TCell = {
    id: number;
    pos: P5.Vector;
    neighbourIndex: number[];
    owner: Gamer | undefined;
};

class CrossBoard {
    p5: P5;
    size: number;
    offset: P5.Vector;
    showHelpers: boolean;
    points: TCell[];
    cellRadius: number;

    constructor(p5: P5, _config?: Partial<TCrossBoard>) {
        const config: TCrossBoard = {
            size: 400,
            offset: p5.createVector(0, 0),
            showHelpers: false,
            currentPlayer: Gamer.PLAYER,
            ..._config
        };
        this.p5 = p5;
        this.size = config.size;
        this.offset = config.offset;
        this.showHelpers = config.showHelpers;
        this.points = buildBoard(this.p5, this.size / 5, this.offset);
        this.cellRadius = 50;
    }

    update(deltaTime: number): this {
        return this;
    }

    draw(): this {
        this.p5.cursor(this.p5.ARROW);
        const dimension = this.size / 5;
        const length = this.points.length;
        for (let i = 0; i < length; i++) {
            // draw the board
            this.p5.strokeWeight(2);
            this.p5.stroke(255);
            this.p5.circle(this.points[i].pos.x * dimension, this.points[i].pos.y * dimension, 10);

            this.points[i].neighbourIndex.forEach((index) => {
                this.p5.stroke(255);
                this.p5.line(
                    this.points[i].pos.x,
                    this.points[i].pos.y,
                    this.points[index].pos.x,
                    this.points[index].pos.y
                );
            });

            // draw hover
            const distance = this.p5.createVector(this.p5.mouseX, this.p5.mouseY).sub(this.points[i].pos).mag();
            if (distance < this.cellRadius) {
                // console.log(distance);

                this.p5.cursor(this.p5.HAND);
                this.p5.noStroke();
                this.p5.fill(255);
                this.p5.circle(
                    this.points[i].pos.x,
                    this.points[i].pos.y,
                    this.p5.constrain(this.cellRadius - distance, 0, this.cellRadius * 0.3)
                );
            }
        }
        // draw connections
        if (this.showHelpers) {
            for (let i = 0; i < length; i++) {
                const distance = this.p5.createVector(this.p5.mouseX, this.p5.mouseY).sub(this.points[i].pos).mag();
                if (distance > this.cellRadius) continue;
                this.points[i].neighbourIndex.forEach((index) => {
                    this.p5.stroke(255, 200, 100);
                    this.p5.strokeWeight(8);
                    this.p5.line(
                        this.points[i].pos.x,
                        this.points[i].pos.y,
                        this.points[index].pos.x,
                        this.points[index].pos.y
                    );
                });
            }
        }

        return this;
    }
}

/**--------------------------------- */
// functions

function buildBoard(p5: P5, dimension: number, offset: P5.Vector) {
    const cells: TCell[] = [
        // { id: 0, pos: p5.createVector(0, 0), neighbourIndex: [[1,2], [3,6], [5,10]], owner: undefined },
        { id: 0, pos: p5.createVector(0, 0), neighbourIndex: [1, 3, 5], owner: undefined },
        { id: 1, pos: p5.createVector(2, 0), neighbourIndex: [0, 2, 3, 4], owner: undefined },
        { id: 2, pos: p5.createVector(4, 0), neighbourIndex: [1, 4, 7], owner: undefined },

        { id: 3, pos: p5.createVector(1, 1), neighbourIndex: [0, 1, 6, 5], owner: undefined },
        { id: 4, pos: p5.createVector(3, 1), neighbourIndex: [1, 2, 7, 6], owner: undefined },

        { id: 5, pos: p5.createVector(0, 2), neighbourIndex: [0, 3, 6, 8, 10], owner: undefined },
        { id: 6, pos: p5.createVector(2, 2), neighbourIndex: [3, 1, 4, 7, 9, 11, 8, 5], owner: undefined },
        { id: 7, pos: p5.createVector(4, 2), neighbourIndex: [4, 2, 12, 9, 6], owner: undefined },

        { id: 8, pos: p5.createVector(1, 3), neighbourIndex: [5, 6, 11, 10], owner: undefined },
        { id: 9, pos: p5.createVector(3, 3), neighbourIndex: [6, 7, 12, 11], owner: undefined },

        { id: 10, pos: p5.createVector(0, 4), neighbourIndex: [5, 8, 11], owner: undefined },
        { id: 11, pos: p5.createVector(2, 4), neighbourIndex: [8, 6, 9, 12, 10], owner: undefined },
        { id: 12, pos: p5.createVector(4, 4), neighbourIndex: [9, 7, 11], owner: undefined }
    ];

    for (const cell of cells) {
        cell.pos = p5.createVector(cell.pos.x * dimension, cell.pos.y * dimension).add(offset);
    }

    return cells;
}

export default CrossBoard;
