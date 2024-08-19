import P5 from 'p5';
import { Gamer } from 'src/utils/utils';

type Keys = 'size' | 'showHelpers';
const SNAP_RADIUS = 40;
const DEBUG = false;
const CELL_RADIUS = 50;
let pawnIdCounter = -1;

type TPawn = {
    board: CrossBoard;
    owner: Gamer;
    pointIndex: number;
    nextPoint: number | null;

    id: number;
    pos: P5.Vector;
    radius: number;
    color: P5.Color;
    showHelpers: boolean;
    mode: 'normal' | 'animation' | 'drag';
};
type TPawnConfig = Pick<TPawn, 'board' | 'radius' | 'owner' | 'pointIndex' | 'showHelpers'>;

type TCrossBoard = {
    pawns: Pawn[];
    points: TCell[];
    currentPlayer: Gamer;

    size: number;
    showHelpers: boolean;
    offset: P5.Vector;
    mode: 'normal' | 'animation' | 'drag';
};
type TCrossBoardConfig = Pick<TCrossBoard, 'size' | 'showHelpers' | 'currentPlayer'>;

type TCell = {
    id: number;
    pos: P5.Vector;
    neighbourIndex: number[];
    capturableIndex: (number | null)[];
    pawnIndex: number | undefined;
};

class CrossBoard {
    p5: P5;
    pawns: Pawn[];
    points: TCell[];
    currentPlayer: Gamer;

    size: number;
    showHelpers: boolean;
    offset: P5.Vector;
    mode: 'normal' | 'animation' | 'drag';

    constructor(p5: P5, _config?: TCrossBoardConfig) {
        const config: TCrossBoardConfig = {
            size: 400,
            showHelpers: false,
            currentPlayer: Gamer.PLAYER,
            ..._config
        };
        const offsetX = (window.innerWidth - config.size) / 2;
        const offsetY = (window.innerHeight - config.size) / 2;

        this.p5 = p5;
        this.size = config.size;
        this.showHelpers = config.showHelpers;
        this.offset = p5.createVector(offsetX, offsetY);
        this.currentPlayer = config.currentPlayer;
        this.pawns = buildPawns(p5, this);
        this.points = buildBoard(this.p5);
        this.mode = 'normal';
    }

    setValues(key: Keys, value: number | boolean) {
        if (typeof value === 'number') {
            switch (key) {
                case 'size':
                    this.size = value;
                    const offsetX = (window.innerWidth - value) / 2;
                    const offsetY = (window.innerHeight - value) / 2;
                    this.offset = this.offset.set(offsetX, offsetY);
                    break;
                default:
                    throw 'Unsupported key passed to setValues()';
            }
        }
        if (typeof value === 'boolean') {
            switch (key) {
                case 'showHelpers':
                    this.showHelpers = value;
                    break;
                default:
                    throw 'Unsupported key passed to setValues()';
            }
        }
    }

    movePawn(start: number, end: number) {
        if (this.points[end].pawnIndex !== undefined) throw 'Target cell is already populated. Move not allowed!!';
        const temp = this.points[start].pawnIndex;
        this.points[start].pawnIndex = undefined;
        this.points[end].pawnIndex = temp;
    }

    update(deltaTime: number): this {
        const dimension = this.size / 5;
        const length = this.points.length;
        const { x: offsetX, y: offsetY } = this.offset;

        for (let i = 0; i < this.pawns.length; i++) {
            this.pawns[i].update(deltaTime, offsetX, offsetY, dimension);
        }
        return this;
    }

    draw(): this {
        this.p5.cursor(this.p5.ARROW);
        const dimension = this.size / 5;
        const length = this.points.length;
        const { x: offsetX, y: offsetY } = this.offset;

        for (let i = 0; i < length; i++) {
            const { x: x1, y: y1 } = this.points[i].pos;
            const currentPoint = this.p5.createVector(offsetX + x1 * dimension, offsetY + y1 * dimension);

            // draw lines to neighbours
            this.points[i].neighbourIndex.forEach((neighbour) => {
                const { x: x2, y: y2 } = this.points[neighbour].pos;
                this.p5.strokeWeight(2);
                this.p5.stroke(255, 0.1);
                this.p5.line(currentPoint.x, currentPoint.y, offsetX + x2 * dimension, offsetY + y2 * dimension);
            });

            // draw hover point
            const distance = this.p5.createVector(this.p5.mouseX, this.p5.mouseY).sub(currentPoint).mag();

            if (distance < CELL_RADIUS) {
                this.p5.cursor(this.p5.HAND);
                this.p5.noStroke();
                this.p5.fill(255);
                this.p5.circle(
                    currentPoint.x,
                    currentPoint.y,
                    this.p5.constrain(CELL_RADIUS - distance, 0, CELL_RADIUS * 0.3)
                );
            }
        }
        // draw pawn
        for (let i = 0; i < this.pawns.length; i++) {
            this.pawns[i].draw();
        }

        // draw helpers
        if (this.showHelpers) {
            for (let pointIndex = 0; pointIndex < length; pointIndex++) {
                const { x: x1, y: y1 } = this.points[pointIndex].pos;
                const currentPoint = this.p5.createVector(offsetX + x1 * dimension, offsetY + y1 * dimension);

                // points texts
                this.p5.stroke(255);
                this.p5.strokeWeight(1);
                this.p5.noFill();
                this.showHelpers &&
                    this.p5.text(
                        // `${currentPoint.x} ${currentPoint.y} [${this.points[pointIndex].id}]`,
                        `${this.points[pointIndex].id}`,
                        currentPoint.x + 15,
                        currentPoint.y - 5
                    );

                // connected points
                const distance = this.p5.createVector(this.p5.mouseX, this.p5.mouseY).sub(currentPoint).mag();
                if (distance > CELL_RADIUS) continue;

                if (DEBUG) {
                    for (let j = 0; j < this.points[pointIndex].neighbourIndex.length; j++) {
                        const neighbourIndex = this.points[pointIndex].neighbourIndex[j];
                        const capturableIndex = this.points[pointIndex].capturableIndex[j];

                        // draw capture point
                        if (capturableIndex !== null) {
                            this.p5.stroke(180, 200, 100);
                            this.p5.strokeWeight(15);
                            this.p5.line(
                                currentPoint.x,
                                currentPoint.y,
                                offsetX + this.points[capturableIndex].pos.x * dimension,
                                offsetY + this.points[capturableIndex].pos.y * dimension
                            );
                        }

                        //draw neighbour
                        this.p5.stroke(255, 200, 100);
                        this.p5.strokeWeight(8);
                        this.p5.line(
                            currentPoint.x,
                            currentPoint.y,
                            offsetX + this.points[neighbourIndex].pos.x * dimension,
                            offsetY + this.points[neighbourIndex].pos.y * dimension
                        );
                    }
                }
            }
        }

        return this;
    }
}

// --------------------------------------------------------
// --------------------------------------------------------

class Pawn {
    p5: P5;
    board: CrossBoard;
    owner: Gamer;
    pointIndex: number;
    nextPoint: number | null;

    id: number;
    pos: P5.Vector;
    radius: number;
    color: P5.Color;
    showHelpers: boolean;
    mode: 'normal' | 'animation' | 'drag';

    constructor(p5: P5, config: TPawnConfig) {
        this.p5 = p5;
        this.id = ++pawnIdCounter;
        this.showHelpers = config.showHelpers;
        this.board = config.board;
        this.owner = config.owner;
        this.pointIndex = config.pointIndex;
        this.nextPoint = null;
        this.pos = p5.createVector();
        this.radius = config.radius;
        this.color = config.owner === Gamer.AI ? p5.color(20, 200, 120) : p5.color(200, 100, 70);
        this.mode = 'normal';
    }
    update(deltaTime: number, offsetX: number, offsetY: number, dimension: number) {
        // pawns at rest
        if (!this.p5.mouseIsPressed && this.board.mode === 'normal' && this.mode === 'normal') {
            const point = this.board.points[this.pointIndex];
            this.pos.set(offsetX + point.pos.x * dimension, offsetY + point.pos.y * dimension);
            return this;
        }

        // initiate drag
        if (
            this.owner === Gamer.PLAYER &&
            this.p5.mouseIsPressed &&
            this.board.mode === 'normal' &&
            this.mode === 'normal'
        ) {
            const currentPoint = this.board.points[this.pointIndex];
            const distance = this.p5
                .createVector(this.p5.mouseX, this.p5.mouseY)
                .sub(
                    this.p5.createVector(offsetX + currentPoint.pos.x * dimension, offsetY + currentPoint.pos.y * dimension)
                )
                .mag();

            if (distance <= SNAP_RADIUS) {
                this.board.mode = this.mode = 'drag';
                return this;
            }
        }

        // continue dragging
        if (this.owner === Gamer.PLAYER && this.mode === 'drag' && this.p5.mouseIsPressed) {
            this.pos.set(this.p5.mouseX, this.p5.mouseY);
            return this;
        }

        // finish  drag mode when mouseup
        if (this.owner === Gamer.PLAYER && this.mode === 'drag' && !this.p5.mouseIsPressed) {
            this.board.mode = this.mode = 'animation';
            const mousePos = this.p5.createVector(this.p5.mouseX, this.p5.mouseY);
            // calculate the permissible cells

            let movablePoints: number[] = [];
            for (let i = 0; i < this.board.points[this.pointIndex].neighbourIndex.length; i++) {
                const neighbourIndex = this.board.points[this.pointIndex].neighbourIndex[i];
                const capturableIndex = this.board.points[this.pointIndex].capturableIndex[i];
                const neighbourPoint = this.board.points[neighbourIndex];
                if (neighbourPoint.pawnIndex === undefined) movablePoints.push(neighbourIndex);

                if (
                    neighbourPoint.pawnIndex !== undefined &&
                    this.board.pawns[neighbourPoint.pawnIndex].owner === Gamer.AI &&
                    capturableIndex !== null &&
                    this.board.points[capturableIndex].pawnIndex !== undefined &&
                    this.board.pawns[this.board.points[capturableIndex].pawnIndex].owner
                )
                    movablePoints.push(capturableIndex);
            }

            // find if pawn is near any of the permissible points
            for (let i = 0; i < movablePoints.length; i++) {
                const index = movablePoints[i];
                const point = this.board.points[index];
                if (point.pawnIndex !== undefined) continue;

                if (i === this.pointIndex) continue;
                const distance = mousePos
                    .copy()
                    .sub(this.p5.createVector(offsetX + point.pos.x * dimension, offsetY + point.pos.y * dimension))
                    .mag();

                if (distance < SNAP_RADIUS) {
                    this.nextPoint = index;
                }
            }
        }

        // travel to target position
        if (this.mode === 'animation') {
            const targetIndex = this.nextPoint !== null ? this.nextPoint : this.pointIndex;
            const currentPos = this.board.points[targetIndex].pos;
            const targetPos = this.p5.createVector(offsetX + currentPos.x * dimension, offsetY + currentPos.y * dimension);
            const distance = targetPos.copy().sub(this.pos).mag();

            if (distance < SNAP_RADIUS) {
                this.pos.set(targetPos.x, targetPos.y);
                this.board.mode = this.mode = 'normal';
                this.nextPoint !== null && this.board.movePawn(this.pointIndex, this.nextPoint);
                this.pointIndex = targetIndex;
                this.nextPoint = null;
                return this;
            }

            this.pos.add(targetPos).div(2);
        }

        return this;
    }

    draw() {
        const point = this.board.points[this.pointIndex];
        this.p5.noStroke();
        this.p5.fill(this.color);
        this.p5.ellipseMode(this.p5.CENTER);
        this.p5.circle(this.pos.x, this.pos.y, this.radius);

        if (this.showHelpers) {
            // points texts
            this.p5.stroke(255);
            this.p5.strokeWeight(1);
            this.p5.noFill();
            this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
            this.p5.text(this.id, this.pos.x, this.pos.y);
        }

        return this;
    }
}

/**--------------------------------- */
// functions
function buildPawns(p5: P5, board: CrossBoard) {
    const radius = 30;
    const pawns: Pawn[] = [
        new Pawn(p5, { board, radius, owner: Gamer.AI, pointIndex: 0, showHelpers: board.showHelpers }),
        new Pawn(p5, { board, radius, owner: Gamer.AI, pointIndex: 1, showHelpers: board.showHelpers }),
        new Pawn(p5, { board, radius, owner: Gamer.AI, pointIndex: 2, showHelpers: board.showHelpers }),
        new Pawn(p5, { board, radius, owner: Gamer.AI, pointIndex: 3, showHelpers: board.showHelpers }),
        new Pawn(p5, { board, radius, owner: Gamer.AI, pointIndex: 4, showHelpers: board.showHelpers }),

        new Pawn(p5, { board, radius, owner: Gamer.PLAYER, pointIndex: 8, showHelpers: board.showHelpers }),
        new Pawn(p5, { board, radius, owner: Gamer.PLAYER, pointIndex: 9, showHelpers: board.showHelpers }),
        new Pawn(p5, { board, radius, owner: Gamer.PLAYER, pointIndex: 10, showHelpers: board.showHelpers }),
        new Pawn(p5, { board, radius, owner: Gamer.PLAYER, pointIndex: 11, showHelpers: board.showHelpers }),
        new Pawn(p5, { board, radius, owner: Gamer.PLAYER, pointIndex: 12, showHelpers: board.showHelpers })
    ];

    return pawns;
}

function buildBoard(p5: P5) {
    // build points
    const points: TCell[] = [
        {
            id: 0,
            pos: p5.createVector(0, 0),
            neighbourIndex: [1, 3, 5],
            capturableIndex: [2, 6, 10],
            pawnIndex: 0
        },
        {
            id: 1,
            pos: p5.createVector(2, 0),
            neighbourIndex: [0, 2, 3, 4],
            capturableIndex: [null, null, 5, 7],
            pawnIndex: 1
        },
        {
            id: 2,
            pos: p5.createVector(4, 0),
            neighbourIndex: [1, 4, 7],
            capturableIndex: [0, 6, 12],
            pawnIndex: 2
        },

        {
            id: 3,
            pos: p5.createVector(1, 1),
            neighbourIndex: [0, 1, 6, 5],
            capturableIndex: [null, null, 9, null],
            pawnIndex: 3
        },
        {
            id: 4,
            pos: p5.createVector(3, 1),
            neighbourIndex: [1, 2, 7, 6],
            capturableIndex: [null, null, null, 8],
            pawnIndex: 4
        },

        {
            id: 5,
            pos: p5.createVector(0, 2),
            neighbourIndex: [0, 3, 6, 8, 10],
            capturableIndex: [null, 1, 7, 11, null],
            pawnIndex: undefined
        },
        {
            id: 6,
            pos: p5.createVector(2, 2),
            neighbourIndex: [3, 1, 4, 7, 9, 11, 8, 5],
            capturableIndex: [0, null, 2, null, 12, null, 10, null],
            pawnIndex: undefined
        },
        {
            id: 7,
            pos: p5.createVector(4, 2),
            neighbourIndex: [4, 2, 12, 9, 6],
            capturableIndex: [1, null, null, 11, 5],
            pawnIndex: undefined
        },

        {
            id: 8,
            pos: p5.createVector(1, 3),
            neighbourIndex: [5, 6, 11, 10],
            capturableIndex: [null, 4, null, null],
            pawnIndex: 5
        },
        {
            id: 9,
            pos: p5.createVector(3, 3),
            neighbourIndex: [6, 7, 12, 11],
            capturableIndex: [3, null, null, null],
            pawnIndex: 6
        },

        {
            id: 10,
            pos: p5.createVector(0, 4),
            neighbourIndex: [5, 8, 11],
            capturableIndex: [0, 6, 12],
            pawnIndex: 7
        },
        {
            id: 11,
            pos: p5.createVector(2, 4),
            neighbourIndex: [8, 6, 9, 12, 10],
            capturableIndex: [5, 1, 7, null, null],
            pawnIndex: 8
        },
        {
            id: 12,
            pos: p5.createVector(4, 4),
            neighbourIndex: [9, 7, 11],
            capturableIndex: [6, 2, 10],
            pawnIndex: 9
        }
    ];

    for (const point of points) {
        point.pos = p5.createVector(point.pos.x, point.pos.y);
    }

    return points;
}

export default CrossBoard;
