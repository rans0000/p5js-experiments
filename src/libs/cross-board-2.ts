import P5 from 'p5';
import { Gamer } from 'src/utils/utils';

// --------------------------------------------------------
const OFFSET = new P5.Vector(150, 150);
const CELL_RADIUS = 50;
const DIMENSION = 100;
// --------------------------------------------------------

export type TCrossBoard = {
    cells: TCrossBoardCell[];
    pawns: Pawn[];
    currentPlayer: Gamer;
};
type TCrossBoardConfig = Pick<TCrossBoard, 'currentPlayer'>;

export type TCrossBoardCell = {
    id: number;
    pos: P5.Vector;
    neighbourIndices: number[];
    capturableIndices: (number | undefined)[];
    pawnIndex: number | undefined;
};

export type TCrossBoardPawn = {
    id: number;
    pos: P5.Vector;
    owner: Gamer;
    cellIndex: number;

    board: CrossBoard;
    radius: number;
    showHelpers: boolean;
};
type TCrossBoardPawnConfig = Pick<TCrossBoardPawn, 'id' | 'board' | 'owner' | 'cellIndex'>;

// --------------------------------------------------------
// --------------------------------------------------------
class CrossBoard {
    p5: P5;

    cells: TCrossBoardCell[];
    pawns: Pawn[];

    currentPlayer: Gamer;

    constructor(p5: P5, config: TCrossBoardConfig) {
        this.p5 = p5;
        this.cells = buildBoard(p5);
        this.pawns = buildPawns(p5, this);
    }
    update(deltaTime: number): this {
        // update pawns
        for (let i = 0; i < this.pawns.length; i++) {
            const pawn = this.pawns[i];
            const cell = this.cells[pawn.cellIndex];
            pawn.update(this.p5.deltaTime, OFFSET.x + cell.pos.x * DIMENSION, OFFSET.y + cell.pos.y * DIMENSION);
        }
        return this;
    }

    draw() {
        for (let i = 0; i < this.cells.length; i++) {
            const { x: x1, y: y1 } = this.cells[i].pos;
            const posX = OFFSET.x + x1 * DIMENSION;
            const posY = OFFSET.y + y1 * DIMENSION;
            const currentCell = this.p5.createVector(posX, posY);

            // draw lines to neighbours
            this.cells[i].neighbourIndices.forEach((neighbour) => {
                const { x: x2, y: y2 } = this.cells[neighbour].pos;
                this.p5.strokeWeight(2);
                this.p5.stroke(255, 0.1);
                this.p5.line(posX, posY, OFFSET.x + x2 * DIMENSION, OFFSET.y + y2 * DIMENSION);
            });

            // draw helpers
            if (true) {
                // points texts
                this.p5.stroke(255);
                this.p5.strokeWeight(1);
                this.p5.noFill();
                this.p5.text(`${this.cells[i].id}`, posX + 25, posY - 5);
            }

            // draw hover point
            const distance = this.p5.createVector(this.p5.mouseX, this.p5.mouseY).sub(currentCell).mag();
            if (distance < CELL_RADIUS) {
                this.p5.cursor(this.p5.HAND);
                this.p5.noStroke();
                this.p5.fill(255);
                this.p5.circle(
                    currentCell.x,
                    currentCell.y,
                    this.p5.constrain(CELL_RADIUS - distance, 0, CELL_RADIUS * 0.3)
                );
            }
        }

        // draw cells
        for (const pawn of this.pawns) {
            pawn.draw();
        }
    }
}

// --------------------------------------------------------
// --------------------------------------------------------
class Pawn {
    p5: P5;
    id: number;
    pos: P5.Vector;
    owner: Gamer;
    cellIndex: number;

    board: CrossBoard;
    radius: number;
    showHelpers: boolean;

    constructor(p5: P5, config: TCrossBoardPawnConfig) {
        this.p5 = p5;
        this.id = config.id;
        this.board = config.board;
        this.owner = config.owner;
        this.cellIndex = config.cellIndex;
        this.pos = p5.createVector(0, 0);
    }
    update(deltaTime: number, posX: number, posY: number): this {
        // update Cells
        this.pos.x = posX;
        this.pos.y = posY;
        return this;
    }

    draw() {
        this.p5.noStroke();
        this.owner === Gamer.AI ? this.p5.fill(200, 80, 70) : this.p5.fill(10, 80, 70);
        this.p5.ellipseMode(this.p5.CENTER);
        this.p5.circle(this.pos.x, this.pos.y, CELL_RADIUS * 0.6);

        if (true || this.showHelpers) {
            // points texts
            this.p5.stroke(255);
            this.p5.strokeWeight(1);
            this.p5.noFill();
            this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
            this.p5.text(this.id, this.pos.x, this.pos.y);
        }
    }
}

// --------------------------------------------------------
// --------------------------------------------------------
function buildPawns(p5: P5, board: CrossBoard) {
    const pawns: Pawn[] = [
        new Pawn(p5, { id: 0, board, owner: Gamer.AI, cellIndex: 0 }),
        new Pawn(p5, { id: 1, board, owner: Gamer.AI, cellIndex: 1 }),
        new Pawn(p5, { id: 2, board, owner: Gamer.AI, cellIndex: 2 }),
        new Pawn(p5, { id: 3, board, owner: Gamer.AI, cellIndex: 3 }),
        new Pawn(p5, { id: 4, board, owner: Gamer.AI, cellIndex: 4 }),
        // new Pawn(p5, { board, owner: Gamer.AI, cellIndex: 6 }),

        new Pawn(p5, { id: 5, board, owner: Gamer.PLAYER, cellIndex: 8 }),
        new Pawn(p5, { id: 6, board, owner: Gamer.PLAYER, cellIndex: 9 }),
        new Pawn(p5, { id: 7, board, owner: Gamer.PLAYER, cellIndex: 10 }),
        new Pawn(p5, { id: 8, board, owner: Gamer.PLAYER, cellIndex: 11 }),
        new Pawn(p5, { id: 9, board, owner: Gamer.PLAYER, cellIndex: 12 })
    ];

    return pawns;
}

export function buildBoard(p5: P5) {
    // build points
    const points: TCrossBoardCell[] = [
        {
            id: 0,
            pos: p5.createVector(0, 0),
            neighbourIndices: [1, 3, 5],
            capturableIndices: [2, 6, 10],
            pawnIndex: 0
        },
        {
            id: 1,
            pos: p5.createVector(2, 0),
            neighbourIndices: [0, 2, 3, 4],
            capturableIndices: [undefined, undefined, 5, 7],
            pawnIndex: 1
        },
        {
            id: 2,
            pos: p5.createVector(4, 0),
            neighbourIndices: [1, 4, 7],
            capturableIndices: [0, 6, 12],
            pawnIndex: 2
        },

        {
            id: 3,
            pos: p5.createVector(1, 1),
            neighbourIndices: [0, 1, 6, 5],
            capturableIndices: [undefined, undefined, 9, undefined],
            pawnIndex: 3
        },
        {
            id: 4,
            pos: p5.createVector(3, 1),
            neighbourIndices: [1, 2, 7, 6],
            capturableIndices: [undefined, undefined, undefined, 8],
            pawnIndex: 4
            // pawnIndex: undefined
        },

        {
            id: 5,
            pos: p5.createVector(0, 2),
            neighbourIndices: [0, 3, 6, 8, 10],
            capturableIndices: [undefined, 1, 7, 11, undefined],
            pawnIndex: undefined
        },
        {
            id: 6,
            pos: p5.createVector(2, 2),
            neighbourIndices: [3, 1, 4, 7, 9, 11, 8, 5],
            capturableIndices: [0, undefined, 2, undefined, 12, undefined, 10, undefined],
            pawnIndex: undefined
            // pawnIndex: 4
        },
        {
            id: 7,
            pos: p5.createVector(4, 2),
            neighbourIndices: [4, 2, 12, 9, 6],
            capturableIndices: [1, undefined, undefined, 11, 5],
            pawnIndex: undefined
        },

        {
            id: 8,
            pos: p5.createVector(1, 3),
            neighbourIndices: [5, 6, 11, 10],
            capturableIndices: [undefined, 4, undefined, undefined],
            pawnIndex: 5
        },
        {
            id: 9,
            pos: p5.createVector(3, 3),
            neighbourIndices: [6, 7, 12, 11],
            capturableIndices: [3, undefined, undefined, undefined],
            pawnIndex: 6
        },

        {
            id: 10,
            pos: p5.createVector(0, 4),
            neighbourIndices: [5, 8, 11],
            capturableIndices: [0, 6, 12],
            pawnIndex: 7
        },
        {
            id: 11,
            pos: p5.createVector(2, 4),
            neighbourIndices: [8, 6, 9, 12, 10],
            capturableIndices: [5, 1, 7, undefined, undefined],
            pawnIndex: 8
        },
        {
            id: 12,
            pos: p5.createVector(4, 4),
            neighbourIndices: [9, 7, 11],
            capturableIndices: [6, 2, 10],
            pawnIndex: 9
        }
    ];

    // for (const point of points) {
    //     point.pos = p5.createVector(point.pos.x, point.pos.y);
    // }

    return points;
}
// --------------------------------------------------------
// --------------------------------------------------------
export default CrossBoard;
