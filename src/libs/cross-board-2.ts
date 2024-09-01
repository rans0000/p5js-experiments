import P5 from 'p5';
import { Gamer } from 'src/utils/utils';

// --------------------------------------------------------
const OFFSET = new P5.Vector(150, 150);
const CELL_RADIUS = 50;
const DIMENSION = 100;
const MAX_DEPTH = 5;
let count = 0;
const ENABLE_PRUNING = true;
// --------------------------------------------------------

type TCrossBoard = {
    cells: TCrossBoardCell[];
    pawns: Pawn[];
    currentPlayer: Gamer;

    state: STATE;
    showHelpers: boolean;
};
type TCrossBoardConfig = Pick<TCrossBoard, 'currentPlayer' | 'showHelpers'>;

type TCrossBoardCell = {
    id: number;
    pos: P5.Vector;
    connectingIndices: [number, number | undefined][];
    pawn: null | Pawn;
};

type TCrossBoardPawn = {
    id: number;
    pos: P5.Vector;
    owner: Gamer;
    cellIndex: number;

    board: CrossBoard;
    radius: number;
};
type TCrossBoardPawnConfig = Pick<TCrossBoardPawn, 'id' | 'board' | 'owner' | 'cellIndex'>;

type TBestMove = {
    pawnId: number;
    targetCellIndex: number;
    capturedCellIndex?: number;
    bestScore: number;
} | null;

type Keys = 'showHelpers';

enum STATE {
    NORMAL,
    ANIMATION,
    DRAG
}

// --------------------------------------------------------
// --------------------------------------------------------
class CrossBoard {
    p5: P5;

    cells: TCrossBoardCell[];
    pawns: Pawn[];
    currentPlayer: Gamer;

    state: STATE;
    showHelpers: boolean;

    constructor(p5: P5, _config?: Partial<TCrossBoardConfig>) {
        const config: TCrossBoardConfig = { showHelpers: false, currentPlayer: Gamer.PLAYER, ..._config };
        this.p5 = p5;
        this.currentPlayer = config.currentPlayer;
        this.pawns = buildPawns(p5, this);
        this.cells = buildBoard(p5, this.pawns);

        this.state = STATE.NORMAL;
        this.showHelpers = config.showHelpers;
    }

    checkScore(board: CrossBoard, player: Gamer): number {
        let score = 0;
        for (const pawn of board.pawns) {
            score += pawn.owner === player ? -1 : 1;
        }
        return score;
    }

    nextMove(board: CrossBoard) {
        count = 0;
        const currentPlayer = this.currentPlayer;
        const nextPlayer = currentPlayer === Gamer.AI ? Gamer.PLAYER : Gamer.AI;
        let bestScore = -Infinity;
        let bestMove: TBestMove = null;
        let alpha = -Infinity;
        let beta = Infinity;

        console.log('player: ', currentPlayer);
        // search through the available pawns
        for (const pawn of board.pawns) {
            if (pawn.owner !== currentPlayer) continue;
            console.log('\nPawn ', pawn.id);
            const currentCell = board.cells[pawn.cellIndex];

            // find neighbour cell
            for (const connector of currentCell.connectingIndices) {
                const neighbourCellIndex = connector[0];
                const capturableCellIndex = connector[1];
                const neighbourPawn = board.cells[neighbourCellIndex].pawn;

                // check for capturable cells
                if (
                    capturableCellIndex !== undefined &&
                    !board.cells[capturableCellIndex].pawn &&
                    neighbourPawn &&
                    neighbourPawn.owner !== currentPlayer
                ) {
                    // pre-calc
                    const stashCellIndex = pawn.cellIndex;
                    pawn.cellIndex = capturableCellIndex;
                    board.cells[capturableCellIndex].pawn = pawn;
                    board.cells[stashCellIndex].pawn = null;
                    // delete captured pawn
                    const capturedPawn = neighbourPawn;
                    const index = board.pawns.findIndex((p) => p.id === capturedPawn.id);
                    if (index > -1) {
                        board.cells[neighbourCellIndex].pawn = null;
                        board.pawns.splice(index, 1);
                    }

                    // depth
                    const score = this.minimax(
                        board,
                        MAX_DEPTH,
                        false,
                        currentPlayer,
                        alpha,
                        beta,
                        `cap// pawn(${pawn.id}) ${stashCellIndex}-${capturableCellIndex}`
                    );

                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = {
                            pawnId: pawn.id,
                            targetCellIndex: capturableCellIndex,
                            capturedCellIndex: neighbourCellIndex,
                            bestScore
                        };
                    }

                    // undo minimax changes
                    board.pawns.splice(index, 0, capturedPawn);
                    board.cells[capturedPawn.cellIndex].pawn = capturedPawn;
                    pawn.cellIndex = stashCellIndex;
                    board.cells[stashCellIndex].pawn = pawn;
                    board.cells[neighbourCellIndex].pawn = capturedPawn;
                    board.cells[capturableCellIndex].pawn = null;
                }

                // check for neighbour cells
                else if (!neighbourPawn) {
                    // pre-calc
                    const stashCellIndex = pawn.cellIndex;
                    pawn.cellIndex = neighbourCellIndex;
                    board.cells[neighbourCellIndex].pawn = pawn;
                    board.cells[stashCellIndex].pawn = null;

                    // depth
                    const score = this.minimax(
                        board,
                        MAX_DEPTH,
                        false,
                        currentPlayer,
                        alpha,
                        beta,
                        `mov// pawn(${pawn.id}) ${stashCellIndex}-${neighbourCellIndex}`
                    );

                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = { pawnId: pawn.id, targetCellIndex: neighbourCellIndex, bestScore };
                    }
                    // undo minimax changes
                    pawn.cellIndex = stashCellIndex;
                    board.cells[stashCellIndex].pawn = pawn;
                    board.cells[neighbourCellIndex].pawn = null;
                }
            }
        }
        console.log(bestMove, board);
        // initiate board move
        if (bestMove) {
            this.movePawn(board, bestMove);
            // toggle player
            board.currentPlayer = nextPlayer;
        }
    }

    minimax(
        board: CrossBoard,
        depth: number,
        isMaximizing: boolean,
        lastPlayer: Gamer,
        alpha: number,
        beta: number,
        status: string
    ): number {
        ++count;
        const score = this.checkScore(board, lastPlayer);
        console.log(' '.padStart((MAX_DEPTH - depth) * 3, ' '), status, '--', score, `${depth}D`, count);

        const currentPlayer = lastPlayer === Gamer.AI ? Gamer.PLAYER : Gamer.AI;
        // if (depth <= 0 || count > 100) return score;
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
                    const neighbourPawn = board.cells[neighbourCellIndex].pawn;

                    // check for capturable cells
                    if (
                        capturableCellIndex !== undefined &&
                        !board.cells[capturableCellIndex].pawn &&
                        neighbourPawn &&
                        neighbourPawn.owner !== currentPlayer
                    ) {
                        // pre-calc
                        const stashCellIndex = pawn.cellIndex;
                        pawn.cellIndex = capturableCellIndex;
                        board.cells[capturableCellIndex].pawn = pawn;
                        board.cells[stashCellIndex].pawn = null;
                        // delete captured pawn
                        const capturedPawn = neighbourPawn;
                        const index = board.pawns.findIndex((p) => p.id === capturedPawn.id);
                        if (index > -1) {
                            board.cells[neighbourCellIndex].pawn = null;
                            board.pawns.splice(index, 1);
                        }

                        // depth
                        const score = this.minimax(
                            board,
                            depth - 1,
                            false,
                            currentPlayer,
                            alpha,
                            beta,
                            `cap++ pawn(${pawn.id}) ${stashCellIndex}-${capturableCellIndex}`
                        );
                        bestScore = Math.max(score, bestScore);

                        // undo minimax changes
                        board.pawns.splice(index, 0, capturedPawn);
                        board.cells[capturedPawn.cellIndex].pawn = capturedPawn;
                        pawn.cellIndex = stashCellIndex;
                        board.cells[stashCellIndex].pawn = pawn;
                        board.cells[neighbourCellIndex].pawn = capturedPawn;
                        board.cells[capturableCellIndex].pawn = null;

                        // alpha-beta
                        if (ENABLE_PRUNING) {
                            alpha = Math.max(alpha, score);
                            if (beta <= alpha) break;
                        }
                    }

                    // check for neighbour cells
                    else if (!neighbourPawn) {
                        // pre-calc
                        const stashCellIndex = pawn.cellIndex;
                        pawn.cellIndex = neighbourCellIndex;
                        board.cells[neighbourCellIndex].pawn = pawn;
                        board.cells[stashCellIndex].pawn = null;

                        // depth
                        const score = this.minimax(
                            board,
                            depth - 1,
                            false,
                            currentPlayer,
                            alpha,
                            beta,
                            `mov++ pawn(${pawn.id}) ${stashCellIndex}-${neighbourCellIndex}`
                        );
                        bestScore = Math.max(score, bestScore);

                        // undo minimax changes
                        pawn.cellIndex = stashCellIndex;
                        board.cells[stashCellIndex].pawn = pawn;
                        board.cells[neighbourCellIndex].pawn = null;

                        // alpha-beta
                        if (ENABLE_PRUNING) {
                            alpha = Math.max(alpha, score);
                            if (beta <= alpha) break;
                        }
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
                    const neighbourPawn = board.cells[neighbourCellIndex].pawn;

                    // check for capturable cells
                    if (
                        capturableCellIndex !== undefined &&
                        !board.cells[capturableCellIndex].pawn &&
                        neighbourPawn &&
                        neighbourPawn.owner !== currentPlayer
                    ) {
                        // pre-calc
                        const stashCellIndex = pawn.cellIndex;
                        pawn.cellIndex = capturableCellIndex;
                        board.cells[capturableCellIndex].pawn = pawn;
                        board.cells[stashCellIndex].pawn = null;
                        // delete captured pawn
                        const capturedPawn = neighbourPawn;
                        const index = board.pawns.findIndex((p) => p.id === capturedPawn.id);
                        if (index > -1) {
                            board.cells[neighbourCellIndex].pawn = null;
                            board.pawns.splice(index, 1);
                        }

                        // depth
                        const score = this.minimax(
                            board,
                            depth - 1,
                            true,
                            currentPlayer,
                            alpha,
                            beta,
                            `cap-- pawn(${pawn.id}) ${stashCellIndex}-${capturableCellIndex}`
                        );
                        bestScore = Math.min(score, bestScore);

                        // undo minimax changes
                        board.pawns.splice(index, 0, capturedPawn);
                        board.cells[capturedPawn.cellIndex].pawn = capturedPawn;
                        pawn.cellIndex = stashCellIndex;
                        board.cells[stashCellIndex].pawn = pawn;
                        board.cells[neighbourCellIndex].pawn = capturedPawn;
                        board.cells[capturableCellIndex].pawn = null;

                        // alpha-beta
                        if (ENABLE_PRUNING) {
                            beta = Math.min(beta, score);
                            if (beta <= alpha) break;
                        }
                    }

                    // check for neighbour cells
                    else if (!neighbourPawn) {
                        // pre-calc
                        const stashCellIndex = pawn.cellIndex;
                        pawn.cellIndex = neighbourCellIndex;
                        board.cells[neighbourCellIndex].pawn = pawn;
                        board.cells[stashCellIndex].pawn = null;

                        // depth
                        const score = this.minimax(
                            board,
                            depth - 1,
                            true,
                            currentPlayer,
                            alpha,
                            beta,
                            `mov-- pawn(${pawn.id}) ${stashCellIndex}-${neighbourCellIndex}`
                        );
                        bestScore = Math.min(score, bestScore);

                        // undo minimax changes
                        pawn.cellIndex = stashCellIndex;
                        board.cells[stashCellIndex].pawn = pawn;
                        board.cells[neighbourCellIndex].pawn = null;

                        // alpha-beta
                        if (ENABLE_PRUNING) {
                            beta = Math.min(beta, score);
                            if (beta <= alpha) break;
                        }
                    }
                }
            }
            // calc end
            return bestScore;
        }
    }

    movePawn(board: CrossBoard, bestMove: TBestMove): CrossBoard {
        if (!bestMove) return board;
        const { pawnId, targetCellIndex, capturedCellIndex } = bestMove;
        const pawn = board.pawns.find((p) => p.id === pawnId);
        if (pawn !== undefined) {
            const tempCell = pawn.cellIndex;
            pawn.cellIndex = targetCellIndex;
            board.cells[targetCellIndex].pawn = pawn;
            board.cells[tempCell].pawn = null;

            if (capturedCellIndex !== undefined) {
                const capturedPawn = board.pawns[capturedCellIndex];
                const index = board.pawns.findIndex((p) => p.id === capturedPawn.id);
                if (index > -1) {
                    board.pawns.splice(index, 1);
                    board.cells[capturedCellIndex].pawn = null;
                }
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
            if (this.showHelpers) {
                // points texts
                this.p5.stroke(255);
                this.p5.strokeWeight(1);
                this.p5.noFill();
                this.p5.text(
                    `${this.cells[i].id}  ${this.cells[i].pawn !== null ? this.cells[i].pawn?.id : ''}`,
                    posX + 25,
                    posY - 5
                );
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

    setValues(key: Keys, value: boolean) {
        switch (key) {
            case 'showHelpers':
                this.showHelpers = value;
                break;
            default:
                throw 'Unsupported key passed to setValues()';
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

        if (this.board.showHelpers) {
            // points texts
            this.p5.stroke(255);
            this.p5.strokeWeight(1);
            this.p5.noFill();
            this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
            this.p5.text(`${this.id} (${this.cellIndex})`, this.pos.x, this.pos.y);
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

        new Pawn(p5, { id: 5, board, owner: Gamer.PLAYER, cellIndex: 8 }),
        new Pawn(p5, { id: 6, board, owner: Gamer.PLAYER, cellIndex: 9 }),
        new Pawn(p5, { id: 7, board, owner: Gamer.PLAYER, cellIndex: 10 }),
        new Pawn(p5, { id: 8, board, owner: Gamer.PLAYER, cellIndex: 11 }),
        new Pawn(p5, { id: 9, board, owner: Gamer.PLAYER, cellIndex: 12 })
    ];

    return pawns;
}

function buildBoard(p5: P5, pawns: Pawn[]) {
    // build points
    const points: TCrossBoardCell[] = [
        {
            id: 0,
            pos: p5.createVector(0, 0),
            connectingIndices: [
                [1, 2],
                [3, 6],
                [5, 10]
            ],
            pawn: pawns[0]
        },
        {
            id: 1,
            pos: p5.createVector(2, 0),
            connectingIndices: [
                [0, undefined],
                [2, undefined],
                [3, 5],
                [4, 7],
                [6, 11]
            ],
            pawn: pawns[1]
        },
        {
            id: 2,
            pos: p5.createVector(4, 0),
            connectingIndices: [
                [1, 0],
                [4, 6],
                [7, 12]
            ],
            pawn: pawns[2]
        },

        {
            id: 3,
            pos: p5.createVector(1, 1),
            connectingIndices: [
                [0, undefined],
                [1, undefined],
                [6, 9],
                [5, undefined]
            ],
            pawn: pawns[3]
        },
        {
            id: 4,
            pos: p5.createVector(3, 1),
            connectingIndices: [
                [1, undefined],
                [2, undefined],
                [7, undefined],
                [6, 8]
            ],
            pawn: pawns[4]
        },

        {
            id: 5,
            pos: p5.createVector(0, 2),
            connectingIndices: [
                [0, undefined],
                [3, 1],
                [6, 7],
                [8, 11],
                [10, undefined]
            ],
            pawn: null
        },
        {
            id: 6,
            pos: p5.createVector(2, 2),
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
            pawn: null
        },
        {
            id: 7,
            pos: p5.createVector(4, 2),
            connectingIndices: [
                [4, 1],
                [2, undefined],
                [12, undefined],
                [9, 11],
                [6, 5]
            ],
            pawn: null
        },

        {
            id: 8,
            pos: p5.createVector(1, 3),
            connectingIndices: [
                [5, undefined],
                [6, 4],
                [11, undefined],
                [10, undefined]
            ],
            pawn: pawns[5]
        },
        {
            id: 9,
            pos: p5.createVector(3, 3),
            connectingIndices: [
                [6, 3],
                [7, undefined],
                [12, undefined],
                [11, undefined]
            ],
            pawn: pawns[6]
        },

        {
            id: 10,
            pos: p5.createVector(0, 4),
            connectingIndices: [
                [5, 0],
                [8, 6],
                [11, 12]
            ],
            pawn: pawns[7]
        },
        {
            id: 11,
            pos: p5.createVector(2, 4),
            connectingIndices: [
                [8, 5],
                [6, 1],
                [9, 7],
                [12, undefined],
                [10, undefined]
            ],
            pawn: pawns[8]
        },
        {
            id: 12,
            pos: p5.createVector(4, 4),
            connectingIndices: [
                [9, 6],
                [7, 2],
                [11, 10]
            ],
            pawn: pawns[9]
        }
    ];

    return points;
}
// llllllllllllllllllllllll
// function buildPawns2(p5: P5, board: CrossBoard) {
//     const pawns: Pawn[] = [
//         new Pawn(p5, { id: 0, board, owner: Gamer.PLAYER, cellIndex: 0 }),
//         new Pawn(p5, { id: 1, board, owner: Gamer.AI, cellIndex: 1 }),
//         new Pawn(p5, { id: 2, board, owner: Gamer.AI, cellIndex: 2 })
//     ];

//     return pawns;
// }

// function buildBoard2(p5: P5, pawns: Pawn[]) {
//     // build points
//     const points: TCrossBoardCell[] = [
//         {
//             id: 0,
//             pos: p5.createVector(0, 0),
//             connectingIndices: [
//                 [2, 4],
//                 [1, undefined],
//                 [3, undefined]
//             ],
//             pawn: pawns[0]
//         },
//         {
//             id: 1,
//             pos: p5.createVector(2, 0),
//             connectingIndices: [
//                 [2, 3],
//                 [0, undefined],
//                 [4, undefined]
//             ],
//             pawn: pawns[1]
//         },
//         {
//             id: 2,
//             pos: p5.createVector(1, 1),
//             connectingIndices: [
//                 [0, undefined],
//                 [1, undefined],
//                 [3, undefined],
//                 [4, undefined]
//             ],
//             pawn: pawns[2]
//         },

//         {
//             id: 3,
//             pos: p5.createVector(0, 2),
//             connectingIndices: [
//                 [2, 1],
//                 [0, undefined],
//                 [4, undefined]
//             ],
//             pawn: null
//         },
//         {
//             id: 4,
//             pos: p5.createVector(2, 2),
//             connectingIndices: [
//                 [2, 0],
//                 [1, undefined],
//                 [3, undefined]
//             ],
//             pawn: null
//         }
//     ];

//     return points;
// }
// --------------------------------------------------------
// --------------------------------------------------------
export default CrossBoard;
