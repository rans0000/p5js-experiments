import P5 from 'p5';
import { Gamer } from 'src/utils/utils';

// --------------------------------------------------------
const OFFSET = new P5.Vector(150, 150);
const CELL_RADIUS = 50;
const DIMENSION = 100;
const MAX_DEPTH = 1;
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
    connectingIndices: [number, number | undefined][];
    // neighbourIndices: number[];
    // capturableIndices: (number | undefined)[];
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

type TBestMove = {
    pawnIndex: number;
    targetCellIndex: number;
    capturedCellIndex?: number;
} | null;

// --------------------------------------------------------
// --------------------------------------------------------
class CrossBoard {
    p5: P5;

    cells: TCrossBoardCell[];
    pawns: Pawn[];

    currentPlayer: Gamer;

    constructor(p5: P5, config: TCrossBoardConfig) {
        this.p5 = p5;
        this.currentPlayer = config.currentPlayer;
        this.cells = buildBoard(p5);
        this.pawns = buildPawns(p5, this);
    }

    checkScore(board: CrossBoard, player: Gamer): number {
        let score = 0;
        for (const pawn of board.pawns) {
            score += pawn.owner === player ? 1 : -1;
        }
        return score;
    }

    nextMove(board: CrossBoard) {
        const currentPlayer = this.currentPlayer;
        let bestScore = -Infinity;
        let bestMove: TBestMove = null;

        console.log('player: ', currentPlayer);
        // search through the available pawns
        for (const pawn of board.pawns) {
            if (pawn.owner !== currentPlayer) continue;
            const currentCell = board.cells[pawn.cellIndex];

            // find neighbour cell
            for (const connector of currentCell.connectingIndices) {
                const neighbourCellIndex = connector[0];
                const capturableCellIndex = connector[1];
                const neighbourPawnIndex = board.cells[neighbourCellIndex].pawnIndex;

                // check for capturable cells
                if (
                    capturableCellIndex !== undefined &&
                    board.cells[capturableCellIndex].pawnIndex === undefined &&
                    neighbourPawnIndex !== undefined &&
                    board.pawns[neighbourPawnIndex].owner !== currentPlayer
                ) {
                    // pre-calc
                    const currentCellIndex = pawn.cellIndex;
                    const currentPawnIndex = board.cells[currentCellIndex].pawnIndex;
                    pawn.cellIndex = capturableCellIndex;
                    board.cells[capturableCellIndex].pawnIndex = currentPawnIndex;
                    board.cells[currentCellIndex].pawnIndex = undefined;
                    const tempPawn = board.pawns.splice(neighbourPawnIndex, 1);
                    board.cells[neighbourCellIndex].pawnIndex = undefined;

                    // errr
                    if (pawn.id == 9 && currentCellIndex == 12 && capturableCellIndex == 2) {
                        //
                        // debugger;
                    }

                    // depth
                    const score = this.minimax(
                        board,
                        MAX_DEPTH,
                        true,
                        currentPlayer,
                        `cap-x pawn(${pawn.id}) ${currentCellIndex}-${capturableCellIndex}`
                    );
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = {
                            pawnIndex: pawn.id,
                            targetCellIndex: capturableCellIndex,
                            capturedCellIndex: neighbourCellIndex
                        };
                    }

                    // errr
                    if (pawn.id === 9 && currentCellIndex === 12 && capturableCellIndex === 2) {
                        //
                        // debugger;
                    }

                    // undo minimax changes
                    board.pawns.splice(neighbourPawnIndex, 0, ...tempPawn);
                    pawn.cellIndex = currentCellIndex;
                    board.cells[currentCellIndex].pawnIndex = currentPawnIndex;
                    board.cells[neighbourCellIndex].pawnIndex = neighbourPawnIndex;
                }

                // check for neighbour cells
                else if (neighbourPawnIndex === undefined) {
                    // for initializing
                    if (!bestMove) {
                        bestMove = { pawnIndex: pawn.id, targetCellIndex: neighbourCellIndex };
                    }

                    // pre-calc
                    const currentCellIndex = pawn.cellIndex;
                    const currentPawnIndex = board.cells[currentCellIndex].pawnIndex;
                    pawn.cellIndex = neighbourCellIndex;
                    board.cells[neighbourCellIndex].pawnIndex = currentPawnIndex;
                    board.cells[currentCellIndex].pawnIndex = undefined;

                    // depth
                    const score = this.minimax(
                        board,
                        MAX_DEPTH,
                        true,
                        currentPlayer,
                        `mov-x pawn(${pawn.id}) ${currentCellIndex}-${neighbourCellIndex}`
                    );
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = { pawnIndex: pawn.id, targetCellIndex: neighbourCellIndex };
                    }
                    // undo minimax changes
                    pawn.cellIndex = currentCellIndex;
                    board.cells[currentCellIndex].pawnIndex = currentPawnIndex;
                    board.cells[neighbourCellIndex].pawnIndex = undefined;
                }
            }
        }
        console.log(bestMove, board);
        // initiate board move
        if (bestMove) {
            this.movePawn(board, bestMove);
            board.currentPlayer = board.currentPlayer === Gamer.AI ? Gamer.PLAYER : Gamer.AI;
        }
        // toggle player
    }

    validate(board: CrossBoard, status: string, depth: number) {
        for (let i = 0; i < this.pawns.length; i++) {
            const pawn = board.pawns[i];
            const t = board.cells[pawn.cellIndex].pawnIndex;
            // if (board.cells[pawn.cellIndex].pawnIndex !== pawn.cellIndex) {
            //     console.log(status, board);
            //     throw `error ${i} ${board.cells[pawn.cellIndex].pawnIndex}`;
            // }
        }
    }

    minimax(board: CrossBoard, depth: number, isMaximizing: boolean, currentPlayer: Gamer, status: string): number {
        this.validate(board, status, depth);
        const score = this.checkScore(board, currentPlayer);

        const nextPlayer = currentPlayer === Gamer.AI ? Gamer.PLAYER : Gamer.AI;
        if (depth <= 0) return score;

        if (isMaximizing) {
            let bestScore = -Infinity;
            // calc start
            for (const pawn of board.pawns) {
                if (pawn.owner !== currentPlayer) continue;
                const currentCell = board.cells[pawn.cellIndex];

                // find neighbour cell
                for (const connector of currentCell.connectingIndices) {
                    const neighbourCellIndex = connector[0];
                    const capturableCellIndex = connector[1];
                    const neighbourPawnIndex = board.cells[neighbourCellIndex].pawnIndex;

                    // check for capturable cells
                    if (
                        capturableCellIndex !== undefined &&
                        board.cells[capturableCellIndex].pawnIndex === undefined &&
                        neighbourPawnIndex !== undefined &&
                        board.pawns[neighbourPawnIndex].owner !== currentPlayer
                    ) {
                        // pre-calc
                        const currentCellIndex = pawn.cellIndex;
                        const currentPawnIndex = board.cells[currentCellIndex].pawnIndex;
                        pawn.cellIndex = capturableCellIndex;
                        board.cells[capturableCellIndex].pawnIndex = currentPawnIndex;
                        board.cells[currentCellIndex].pawnIndex = undefined;
                        const tempPawn = board.pawns.splice(neighbourPawnIndex, 1);
                        board.cells[neighbourCellIndex].pawnIndex = undefined;

                        // errr
                        if (pawn.id == 9 && currentCellIndex == 12 && capturableCellIndex == 2) {
                            //
                            // debugger;
                        }

                        // depth
                        const score = this.minimax(
                            board,
                            MAX_DEPTH - 1,
                            false,
                            nextPlayer,
                            `cap pawn(${pawn.id}) ${currentCellIndex}-${capturableCellIndex}`
                        );
                        if (score > bestScore) {
                            bestScore = score;
                        }

                        // errr
                        if (pawn.id === 9 && currentCellIndex === 12 && capturableCellIndex === 2) {
                            //
                            // debugger;
                        }

                        // undo minimax changes
                        board.pawns.splice(neighbourPawnIndex, 0, ...tempPawn);
                        pawn.cellIndex = currentCellIndex;
                        board.cells[currentCellIndex].pawnIndex = currentPawnIndex;
                        board.cells[neighbourCellIndex].pawnIndex = neighbourPawnIndex;
                    }

                    // check for neighbour cells
                    else if (neighbourPawnIndex === undefined) {
                        // pre-calc
                        const currentCellIndex = pawn.cellIndex;
                        const currentPawnIndex = board.cells[currentCellIndex].pawnIndex;
                        pawn.cellIndex = neighbourCellIndex;
                        board.cells[neighbourCellIndex].pawnIndex = currentPawnIndex;
                        board.cells[currentCellIndex].pawnIndex = undefined;

                        // depth
                        const score = this.minimax(
                            board,
                            MAX_DEPTH - 1,
                            false,
                            nextPlayer,
                            `mov pawn(${pawn.id}) ${currentCellIndex}-${neighbourCellIndex}`
                        );
                        if (score > bestScore) {
                            bestScore = score;
                        }
                        // undo minimax changes
                        pawn.cellIndex = currentCellIndex;
                        board.cells[currentCellIndex].pawnIndex = currentPawnIndex;
                        board.cells[neighbourCellIndex].pawnIndex = undefined;
                    }
                }
            }
            // calc end
            return bestScore;
        } else {
            let bestScore = Infinity;
            // calc start
            for (const pawn of board.pawns) {
                if (pawn.owner !== currentPlayer) continue;
                const currentCell = board.cells[pawn.cellIndex];

                // find neighbour cell
                for (const connector of currentCell.connectingIndices) {
                    const neighbourCellIndex = connector[0];
                    const capturableCellIndex = connector[1];
                    const neighbourPawnIndex = board.cells[neighbourCellIndex].pawnIndex;

                    // check for capturable cells
                    if (
                        capturableCellIndex !== undefined &&
                        board.cells[capturableCellIndex].pawnIndex === undefined &&
                        neighbourPawnIndex !== undefined &&
                        board.pawns[neighbourPawnIndex].owner !== currentPlayer
                    ) {
                        // pre-calc
                        const currentCellIndex = pawn.cellIndex;
                        const currentPawnIndex = board.cells[currentCellIndex].pawnIndex;
                        pawn.cellIndex = capturableCellIndex;
                        board.cells[capturableCellIndex].pawnIndex = currentPawnIndex;
                        board.cells[currentCellIndex].pawnIndex = undefined;
                        const tempPawn = board.pawns.splice(neighbourPawnIndex, 1);
                        board.cells[neighbourCellIndex].pawnIndex = undefined;

                        // errr
                        if (pawn.id == 9 && currentCellIndex == 12 && capturableCellIndex == 2) {
                            //
                            // debugger;
                        }

                        // depth
                        const score = this.minimax(
                            board,
                            MAX_DEPTH - 1,
                            true,
                            nextPlayer,
                            `cap pawn(${pawn.id}) ${currentCellIndex}-${capturableCellIndex}`
                        );
                        if (score > bestScore) {
                            bestScore = score;
                        }

                        // errr
                        if (pawn.id === 9 && currentCellIndex === 12 && capturableCellIndex === 2) {
                            //
                            // debugger;
                        }

                        // undo minimax changes
                        board.pawns.splice(neighbourPawnIndex, 0, ...tempPawn);
                        pawn.cellIndex = currentCellIndex;
                        board.cells[currentCellIndex].pawnIndex = currentPawnIndex;
                        board.cells[neighbourCellIndex].pawnIndex = neighbourPawnIndex;
                    }

                    // check for neighbour cells
                    else if (neighbourPawnIndex === undefined) {
                        // for initializing

                        // pre-calc
                        const currentCellIndex = pawn.cellIndex;
                        const currentPawnIndex = board.cells[currentCellIndex].pawnIndex;
                        pawn.cellIndex = neighbourCellIndex;
                        board.cells[neighbourCellIndex].pawnIndex = currentPawnIndex;
                        board.cells[currentCellIndex].pawnIndex = undefined;

                        // depth
                        const score = this.minimax(
                            board,
                            MAX_DEPTH - 1,
                            true,
                            nextPlayer,
                            `mov-x pawn(${pawn.id}) ${currentCellIndex}-${neighbourCellIndex}`
                        );
                        if (score > bestScore) {
                            bestScore = score;
                        }
                        // undo minimax changes
                        pawn.cellIndex = currentCellIndex;
                        board.cells[currentCellIndex].pawnIndex = currentPawnIndex;
                        board.cells[neighbourCellIndex].pawnIndex = undefined;
                    }
                }
            }
            // calc end
            return bestScore;
        }
    }

    movePawn(board: CrossBoard, bestMove: TBestMove): CrossBoard {
        if (!bestMove) return board;

        const { pawnIndex, targetCellIndex, capturedCellIndex } = bestMove;
        const currCellIndex = board.pawns[pawnIndex].cellIndex;
        board.pawns[pawnIndex].cellIndex = targetCellIndex;
        board.cells[currCellIndex].pawnIndex = undefined;
        board.cells[targetCellIndex].pawnIndex = pawnIndex;
        if (capturedCellIndex !== undefined) {
            // delete pawn
            const capturedPawnIndex = board.cells[capturedCellIndex].pawnIndex;
            if (capturedPawnIndex !== undefined) {
                board.pawns.splice(capturedPawnIndex, 1);
                board.cells[capturedCellIndex].pawnIndex = undefined;
                console.log('xxxxx ', capturedCellIndex);
            }
        }
        return board;
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
            this.cells[i].connectingIndices.forEach((neighbour) => {
                const index = neighbour[0];
                const { x: x2, y: y2 } = this.cells[index].pos;
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
        this.owner === Gamer.AI ? this.p5.fill(10, 80, 70) : this.p5.fill(200, 80, 70);
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
            // neighbourIndices: [1, 3, 5],
            // capturableIndices: [2, 6, 10],
            connectingIndices: [
                [1, 2],
                [3, 6],
                [5, 10]
            ],
            pawnIndex: 0
        },
        {
            id: 1,
            pos: p5.createVector(2, 0),
            // neighbourIndices: [0, 2, 3, 4],
            // capturableIndices: [undefined, undefined, 5, 7],
            connectingIndices: [
                [0, undefined],
                [2, undefined],
                [3, 5],
                [4, 7]
            ],
            pawnIndex: 1
        },
        {
            id: 2,
            pos: p5.createVector(4, 0),
            // neighbourIndices: [1, 4, 7],
            // capturableIndices: [0, 6, 12],
            connectingIndices: [
                [1, 0],
                [4, 6],
                [7, 12]
            ],
            pawnIndex: 2
        },

        {
            id: 3,
            pos: p5.createVector(1, 1),
            // neighbourIndices: [0, 1, 6, 5],
            // capturableIndices: [undefined, undefined, 9, undefined],
            connectingIndices: [
                [0, undefined],
                [1, undefined],
                [6, 9],
                [5, undefined]
            ],
            pawnIndex: 3
        },
        {
            id: 4,
            pos: p5.createVector(3, 1),
            // neighbourIndices: [1, 2, 7, 6],
            // capturableIndices: [undefined, undefined, undefined, 8],
            connectingIndices: [
                [1, undefined],
                [2, undefined],
                [7, undefined],
                [6, 8]
            ],
            pawnIndex: 4
            // pawnIndex: undefined
        },

        {
            id: 5,
            pos: p5.createVector(0, 2),
            // neighbourIndices: [0, 3, 6, 8, 10],
            // capturableIndices: [undefined, 1, 7, 11, undefined],
            connectingIndices: [
                [0, undefined],
                [3, 1],
                [6, 7],
                [8, 11],
                [10, undefined]
            ],
            pawnIndex: undefined
        },
        {
            id: 6,
            pos: p5.createVector(2, 2),
            // neighbourIndices: [3, 1, 4, 7, 9, 11, 8, 5],
            // capturableIndices: [0, undefined, 2, undefined, 12, undefined, 10, undefined],
            connectingIndices: [
                [3, 0],
                [1, undefined],
                [4, 2],
                [7, undefined],
                [9, 12],
                [11, undefined],
                [8, 10],
                [5, undefined]
            ],
            pawnIndex: undefined
            // pawnIndex: 4
        },
        {
            id: 7,
            pos: p5.createVector(4, 2),
            // neighbourIndices: [4, 2, 12, 9, 6],
            // capturableIndices: [1, undefined, undefined, 11, 5],
            connectingIndices: [
                [4, 1],
                [2, undefined],
                [12, undefined],
                [9, 11],
                [6, 5]
            ],
            pawnIndex: undefined
        },

        {
            id: 8,
            pos: p5.createVector(1, 3),
            // neighbourIndices: [5, 6, 11, 10],
            // capturableIndices: [undefined, 4, undefined, undefined],
            connectingIndices: [
                [5, undefined],
                [6, 4],
                [11, undefined],
                [10, undefined]
            ],
            pawnIndex: 5
        },
        {
            id: 9,
            pos: p5.createVector(3, 3),
            // neighbourIndices: [6, 7, 12, 11],
            // capturableIndices: [3, undefined, undefined, undefined],
            connectingIndices: [
                [6, 3],
                [7, undefined],
                [12, undefined],
                [11, undefined]
            ],
            pawnIndex: 6
        },

        {
            id: 10,
            pos: p5.createVector(0, 4),
            // neighbourIndices: [5, 8, 11],
            // capturableIndices: [0, 6, 12],
            connectingIndices: [
                [5, 0],
                [8, 6],
                [11, 12]
            ],
            pawnIndex: 7
        },
        {
            id: 11,
            pos: p5.createVector(2, 4),
            // neighbourIndices: [8, 6, 9, 12, 10],
            // capturableIndices: [5, 1, 7, undefined, undefined],
            connectingIndices: [
                [8, 5],
                [6, 1],
                [9, 7],
                [12, undefined],
                [10, undefined]
            ],
            pawnIndex: 8
        },
        {
            id: 12,
            pos: p5.createVector(4, 4),
            // neighbourIndices: [9, 7, 11],
            // capturableIndices: [6, 2, 10],
            connectingIndices: [
                [9, 6],
                [7, 2],
                [11, 10]
            ],
            pawnIndex: 9
        }
    ];

    return points;
}
// --------------------------------------------------------
// --------------------------------------------------------
export default CrossBoard;
