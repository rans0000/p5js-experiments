import P5 from 'p5';
import { Gamer } from 'src/utils/utils';

type Keys = 'size' | 'showHelpers';
const SNAP_RADIUS = 40;
let pawnIdCounter = -1;
const DEBUG = false;

type TCrossBoard = {
    size: number;
    showHelpers: boolean;
    currentPlayer: Gamer;
};
type TCell = {
    id: number;
    pos: P5.Vector;
    neighbourIndex: number[];
    capturableIndex: (number | null)[];
    owner: Pawn | undefined;
};
type TPawn = {
    board: CrossBoard;
    owner: Gamer;
    pointIndex: number;
    radius: number;
    showHelpers: boolean;
};
class CrossBoard {
    p5: P5;
    size: number;
    offset: P5.Vector;
    showHelpers: boolean;
    points: TCell[];
    mode: 'normal' | 'animation' | 'drag';

    cellRadius: number;

    constructor(p5: P5, _config?: Partial<TCrossBoard>) {
        const config: TCrossBoard = {
            size: 400,
            showHelpers: false,
            currentPlayer: Gamer.PLAYER,
            ..._config
        };
        const offsetX = (window.innerWidth - config.size) / 2;
        const offsetY = (window.innerHeight - config.size) / 2;

        this.p5 = p5;
        this.mode = 'normal';
        this.size = config.size;
        this.offset = p5.createVector(offsetX, offsetY);
        this.showHelpers = config.showHelpers;
        const points = buildBoard(this.p5, this);
        this.points = points;
        this.cellRadius = 50;
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
        if (this.points[end].owner !== undefined) throw 'Target cell is already populated. Move not allowed!!';
        const temp = this.points[start].owner;
        this.points[start].owner = undefined;
        this.points[end].owner = temp;
    }

    update(deltaTime: number): this {
        const dimension = this.size / 5;
        const length = this.points.length;
        const { x: offsetX, y: offsetY } = this.offset;

        for (let i = 0; i < length; i++) {
            this.points[i].owner?.update(deltaTime, offsetX, offsetY, dimension);
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

            if (distance < this.cellRadius) {
                this.p5.cursor(this.p5.HAND);
                this.p5.noStroke();
                this.p5.fill(255);
                this.p5.circle(
                    currentPoint.x,
                    currentPoint.y,
                    this.p5.constrain(this.cellRadius - distance, 0, this.cellRadius * 0.3)
                );
            }
        }
        // draw pawn
        for (let i = 0; i < length; i++) {
            this.points[i].owner?.draw();
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
                if (distance > this.cellRadius) continue;

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

class Pawn {
    p5: P5;
    id: number;
    board: CrossBoard;
    owner: Gamer;
    pointIndex: number;
    nextPoint: number | null;
    pos: P5.Vector;
    radius: number;
    color: P5.Color;
    mode: 'normal' | 'animation' | 'drag';
    showHelpers: boolean;

    constructor(p5: P5, config: TPawn) {
        this.p5 = p5;
        this.id = ++pawnIdCounter;
        this.mode = 'normal';
        this.board = config.board;
        this.owner = config.owner;
        this.pointIndex = config.pointIndex;
        this.nextPoint = null;
        this.pos = p5.createVector();
        this.radius = config.radius;
        this.color = config.owner === Gamer.AI ? p5.color(20, 200, 120) : p5.color(200, 100, 70);
        this.showHelpers = config.showHelpers;
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
            const point = this.board.points[this.pointIndex];
            const distance = this.p5
                .createVector(this.p5.mouseX, this.p5.mouseY)
                .sub(this.p5.createVector(offsetX + point.pos.x * dimension, offsetY + point.pos.y * dimension))
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
                const point = this.board.points[neighbourIndex];
                if (point.owner === undefined) movablePoints.push(neighbourIndex);
                if (
                    point.owner?.owner === Gamer.AI &&
                    capturableIndex !== null &&
                    this.board.points[capturableIndex].owner?.owner === undefined
                )
                    movablePoints.push(capturableIndex);
            }
            // find if pawn is near any of the permissible points
            for (let i = 0; i < movablePoints.length; i++) {
                const index = movablePoints[i];
                if (index === null) continue;
                const point = this.board.points[index];
                if (point.owner !== undefined) continue;

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
            // this.id === 7 && console.log(this.nextPoint);

            const targetIndex = this.nextPoint !== null ? this.nextPoint : this.pointIndex;
            const pointPos = this.board.points[targetIndex].pos;
            const targetPos = this.p5.createVector(offsetX + pointPos.x * dimension, offsetY + pointPos.y * dimension);
            const distance = targetPos.copy().sub(this.pos).mag();
            if (distance < SNAP_RADIUS) {
                this.pos.set(targetPos.x, targetPos.y);
                this.board.mode = this.mode = 'normal';
                this.nextPoint !== null && this.board.movePawn(this.pointIndex, this.nextPoint);
                this.pointIndex = targetIndex;
                this.nextPoint = null;
                // @todo: update board
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

function buildBoard(p5: P5, board: CrossBoard) {
    const radius = 30;
    // build points
    const points: TCell[] = [
        {
            id: 0,
            pos: p5.createVector(0, 0),
            neighbourIndex: [1, 3, 5],
            capturableIndex: [2, 6, 10],
            owner: new Pawn(p5, { board, radius, owner: Gamer.AI, pointIndex: 0, showHelpers: board.showHelpers })
        },
        {
            id: 1,
            pos: p5.createVector(2, 0),
            neighbourIndex: [0, 2, 3, 4],
            capturableIndex: [null, null, 5, 7],
            owner: new Pawn(p5, { board, radius, owner: Gamer.AI, pointIndex: 1, showHelpers: board.showHelpers })
        },
        {
            id: 2,
            pos: p5.createVector(4, 0),
            neighbourIndex: [1, 4, 7],
            capturableIndex: [0, 6, 12],
            owner: new Pawn(p5, { board, radius, owner: Gamer.AI, pointIndex: 2, showHelpers: board.showHelpers })
        },

        {
            id: 3,
            pos: p5.createVector(1, 1),
            neighbourIndex: [0, 1, 6, 5],
            capturableIndex: [null, null, 9, null],
            owner: new Pawn(p5, { board, radius, owner: Gamer.AI, pointIndex: 3, showHelpers: board.showHelpers })
        },
        {
            id: 4,
            pos: p5.createVector(3, 1),
            neighbourIndex: [1, 2, 7, 6],
            capturableIndex: [null, null, null, 8],
            owner: new Pawn(p5, { board, radius, owner: Gamer.AI, pointIndex: 4, showHelpers: board.showHelpers })
        },

        {
            id: 5,
            pos: p5.createVector(0, 2),
            neighbourIndex: [0, 3, 6, 8, 10],
            capturableIndex: [null, 1, 7, 11, null],
            owner: undefined
        },
        {
            id: 6,
            pos: p5.createVector(2, 2),
            neighbourIndex: [3, 1, 4, 7, 9, 11, 8, 5],
            capturableIndex: [0, null, 2, null, 12, null, 10, null],
            owner: undefined
        },
        {
            id: 7,
            pos: p5.createVector(4, 2),
            neighbourIndex: [4, 2, 12, 9, 6],
            capturableIndex: [1, null, null, 11, 5],
            owner: undefined
        },

        {
            id: 8,
            pos: p5.createVector(1, 3),
            neighbourIndex: [5, 6, 11, 10],
            capturableIndex: [null, 4, null, null],
            owner: new Pawn(p5, { board, radius, owner: Gamer.PLAYER, pointIndex: 8, showHelpers: board.showHelpers })
        },
        {
            id: 9,
            pos: p5.createVector(3, 3),
            neighbourIndex: [6, 7, 12, 11],
            capturableIndex: [3, null, null, null],
            owner: new Pawn(p5, { board, radius, owner: Gamer.PLAYER, pointIndex: 9, showHelpers: board.showHelpers })
        },

        {
            id: 10,
            pos: p5.createVector(0, 4),
            neighbourIndex: [5, 8, 11],
            capturableIndex: [0, 6, 12],
            owner: new Pawn(p5, { board, radius, owner: Gamer.PLAYER, pointIndex: 10, showHelpers: board.showHelpers })
        },
        {
            id: 11,
            pos: p5.createVector(2, 4),
            neighbourIndex: [8, 6, 9, 12, 10],
            capturableIndex: [5, 1, 7, null, null],
            owner: new Pawn(p5, { board, radius, owner: Gamer.PLAYER, pointIndex: 11, showHelpers: board.showHelpers })
        },
        {
            id: 12,
            pos: p5.createVector(4, 4),
            neighbourIndex: [9, 7, 11],
            capturableIndex: [6, 2, 10],
            owner: new Pawn(p5, { board, radius, owner: Gamer.PLAYER, pointIndex: 12, showHelpers: board.showHelpers })
        }
    ];

    for (const point of points) {
        point.pos = p5.createVector(point.pos.x, point.pos.y);
    }

    return points;
}

export default CrossBoard;
