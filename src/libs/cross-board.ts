import P5 from 'p5';
import { Gamer } from 'src/utils/utils';

// --------------------------------------------------------
const OFFSET = new P5.Vector(150, 150);
const PAWN_RADIUS = 30;
const DIMENSION = 100;
const SNAP_RADIUS = 30;
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
    onResolve?: (status: Gamer) => void;
};
type TCrossBoardConfig = Pick<TCrossBoard, 'currentPlayer' | 'showHelpers' | 'onResolve'>;

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
    state: STATE;
    targetCell: number;
};
type TCrossBoardPawnConfig = Pick<TCrossBoardPawn, 'id' | 'board' | 'owner' | 'cellIndex'>;

type TBestMove = {
    pawnId: number;
    targetCellIndex: number;
    capturedPawnId?: number;
    bestScore: number;
} | null;

type Keys = 'showHelpers';

enum STATE {
    NORMAL,
    ANIMATION,
    DRAG,
    PAUSED
}

// --------------------------------------------------------
// --------------------------------------------------------
class CrossBoard {
    p5: P5;

    cells: TCrossBoardCell[];
    pawns: Pawn[];
    currentPlayer: Gamer;
    cachedMove: TBestMove;

    state: STATE;
    showHelpers: boolean;
    onResolve?: (status: Gamer) => void;

    constructor(p5: P5, _config?: Partial<TCrossBoardConfig>) {
        const config: TCrossBoardConfig = { showHelpers: false, currentPlayer: Gamer.PLAYER, ..._config };
        this.p5 = p5;
        this.currentPlayer = config.currentPlayer;
        this.pawns = buildPawns(p5, this);
        this.cells = buildBoard(p5, this.pawns);

        this.state = STATE.NORMAL;
        this.showHelpers = config.showHelpers;
        this.onResolve = config.onResolve;
    }

    checkGameStatus(board: CrossBoard): Gamer | undefined {
        let aiPawns = 0;
        let playerPawns = 0;
        board.pawns.forEach((p) => (p.owner === Gamer.AI ? ++aiPawns : ++playerPawns));
        let winner = aiPawns === 0 ? Gamer.PLAYER : playerPawns === 0 ? Gamer.AI : undefined;
        return winner;
    }

    checkScore(board: CrossBoard, player: Gamer): { score: number; hasWon: boolean } {
        let score = 0;
        let hasWon = false;
        // const hasWon = !board.pawns.some((p) => p.owner === Gamer.AI) || !board.pawns.some((p) => p.owner === Gamer.PLAYER);
        for (const pawn of board.pawns) {
            score += pawn.owner === player ? -1 : 1;
        }
        // multiply with a large number to influence the weight
        if (!board.pawns.some((p) => p.owner === Gamer.AI)) {
            score *= 1000;
            hasWon = true;
        } else if (!board.pawns.some((p) => p.owner === Gamer.PLAYER)) {
            score *= -1000;
            hasWon = true;
        }
        return { score, hasWon };
    }

    nextMove() {
        count = 0;
        const board = this;
        const currentPlayer = this.currentPlayer;
        let bestScore = -Infinity;
        let bestMove: TBestMove = null;
        let alpha = -Infinity;
        let beta = Infinity;
        // this.p5.noLoop();

        // search through the available pawns
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
                        MAX_DEPTH,
                        false,
                        currentPlayer,
                        alpha,
                        beta,
                        `cap// pawn(${pawn.id}) ${stashCellIndex}-${capturableCellIndex}`
                    );
                    // undo minimax changes
                    board.pawns.splice(index, 0, capturedPawn);
                    board.cells[capturedPawn.cellIndex].pawn = capturedPawn;
                    pawn.cellIndex = stashCellIndex;
                    board.cells[stashCellIndex].pawn = pawn;
                    board.cells[neighbourCellIndex].pawn = capturedPawn;
                    board.cells[capturableCellIndex].pawn = null;

                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = {
                            pawnId: pawn.id,
                            targetCellIndex: capturableCellIndex,
                            capturedPawnId: capturedPawn.id,
                            bestScore
                        };
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
                        MAX_DEPTH,
                        false,
                        currentPlayer,
                        alpha,
                        beta,
                        `mov// pawn(${pawn.id}) ${stashCellIndex}-${neighbourCellIndex}`
                    );
                    // undo minimax changes
                    pawn.cellIndex = stashCellIndex;
                    board.cells[stashCellIndex].pawn = pawn;
                    board.cells[neighbourCellIndex].pawn = null;

                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = { pawnId: pawn.id, targetCellIndex: neighbourCellIndex, bestScore };
                    }
                }
            }
        }

        // initiate board move
        const pawn = board.pawns.find((p) => p.id === bestMove?.pawnId);
        if (pawn && bestMove?.targetCellIndex !== undefined) {
            this.cachedMove = bestMove;
            board.state = pawn.state = STATE.ANIMATION;
            pawn.targetCell = bestMove.targetCellIndex;
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
        const { score, hasWon } = this.checkScore(board, lastPlayer);

        const currentPlayer = lastPlayer === Gamer.AI ? Gamer.PLAYER : Gamer.AI;
        // if (depth <= 0 || count > 100) return score;
        // if (depth <= 0) return score;
        if (depth <= 0 || hasWon) return score * (depth + 1);

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
        const { pawnId, targetCellIndex, capturedPawnId } = bestMove;
        const pawn = board.pawns.find((p) => p.id === pawnId);
        if (pawn !== undefined) {
            const tempCell = pawn.cellIndex;
            pawn.cellIndex = targetCellIndex;
            board.cells[targetCellIndex].pawn = pawn;
            board.cells[tempCell].pawn = null;

            if (capturedPawnId !== undefined) {
                const capturedPawn = board.pawns.find((p) => p.id === capturedPawnId);
                if (!capturedPawn) return board;
                const index = board.pawns.findIndex((p) => p.id === capturedPawn?.id);
                if (index > -1) {
                    board.cells[capturedPawn.cellIndex].pawn = null;
                    board.pawns.splice(index, 1);
                }
            }
        }
        return board;
    }
    update(deltaTime: number): this {
        // board:update()
        // update pawns
        for (let i = 0; i < this.pawns.length; i++) {
            const pawn = this.pawns[i];
            const cell = this.cells[pawn.cellIndex];
            // pawn.update(this.p5.deltaTime, OFFSET.x + cell.pos.x * DIMENSION, OFFSET.y + cell.pos.y * DIMENSION);
            pawn.update(deltaTime, OFFSET.x, OFFSET.y);
        }
        return this;
    }

    draw() {
        // bord:draw()
        this.p5.cursor(this.p5.ARROW);

        for (let i = 0; i < this.cells.length; i++) {
            const { x: x1, y: y1 } = this.cells[i].pos;
            const posX = OFFSET.x + x1 * DIMENSION;
            const posY = OFFSET.y + y1 * DIMENSION;
            const currentCellPos = this.p5.createVector(posX, posY);

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
                    `${this.cells[i].id}/  ${this.cells[i].pawn !== null ? this.cells[i].pawn?.id : ''}`,
                    posX + 25,
                    posY - 5
                );
            }

            // draw hover point
            if ((this.state === STATE.NORMAL || this.state === STATE.DRAG) && this.cells[i].pawn?.owner !== Gamer.AI) {
                const distance = this.p5.createVector(this.p5.mouseX, this.p5.mouseY).sub(currentCellPos).mag();
                if (distance < PAWN_RADIUS) {
                    this.p5.cursor(this.p5.HAND);
                    this.p5.noStroke();
                    this.p5.fill(255);
                    this.p5.circle(
                        currentCellPos.x,
                        currentCellPos.y,
                        this.p5.constrain(PAWN_RADIUS - distance, 0, PAWN_RADIUS * 0.5)
                    );
                }
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

    resetGame(_config?: Partial<TCrossBoardConfig>) {
        const config: TCrossBoardConfig = { showHelpers: false, currentPlayer: Gamer.PLAYER, ..._config };
        this.currentPlayer = config.currentPlayer;
        this.pawns = buildPawns(this.p5, this);
        this.cells = buildBoard(this.p5, this.pawns);

        this.state = STATE.NORMAL;
        this.showHelpers = config.showHelpers;
        this.onResolve = config.onResolve;
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
    state: STATE;
    targetCell: number;

    constructor(p5: P5, config: TCrossBoardPawnConfig) {
        this.p5 = p5;
        this.id = config.id;
        this.board = config.board;
        this.owner = config.owner;
        this.cellIndex = config.cellIndex;
        this.pos = p5.createVector(0, 0);
        this.state = STATE.NORMAL;
    }
    update(deltaTime: number, offsetX: number, offsetY: number): this {
        // pawn:update()
        const board = this.board;
        const cells = this.board.cells;
        const parentPos = this.p5.createVector(
            offsetX + cells[this.cellIndex].pos.x * DIMENSION,
            offsetY + cells[this.cellIndex].pos.y * DIMENSION
        );
        const mousePos = this.p5.createVector(this.p5.mouseX, this.p5.mouseY);

        // update Cells at rest
        if (this.state === STATE.NORMAL && board.state === STATE.NORMAL && !this.p5.mouseIsPressed) {
            this.pos.set(parentPos.x, parentPos.y);

            return this;
        }

        // initiate dragging
        if (
            this.owner === Gamer.PLAYER &&
            this.p5.mouseIsPressed &&
            board.state === STATE.NORMAL &&
            this.state === STATE.NORMAL
        ) {
            const distance = parentPos.copy().sub(mousePos).mag();
            if (distance < SNAP_RADIUS) {
                board.state = this.state = STATE.DRAG;
                return this;
            }
        }

        // continue dragging
        if (this.owner === Gamer.PLAYER && this.state === STATE.DRAG && this.p5.mouseIsPressed) {
            this.pos.set(mousePos.x, mousePos.y);
        }

        // finish drag state when mouseup
        if (this.owner === Gamer.PLAYER && this.state === STATE.DRAG && !this.p5.mouseIsPressed) {
            board.state = this.state = STATE.ANIMATION;

            // calculate the permissible cells
            const length = board.cells.length;

            for (let i = 0; i < length; i++) {
                if (this.cellIndex === i || cells[i].pawn) continue;

                const currentCell = cells[i];

                const pos = this.p5.createVector(
                    offsetX + currentCell.pos.x * DIMENSION,
                    offsetY + currentCell.pos.y * DIMENSION
                );
                const distance = pos.copy().sub(this.pos).mag();
                if (distance < SNAP_RADIUS) {
                    const { isLegal } = this.getLegalMove(board, this.cellIndex, i);

                    if (!isLegal) continue;
                    // set the new target cell to move
                    this.targetCell = i;
                    return this;
                }
            }

            // no snappable points, return to home
            this.targetCell = this.cellIndex;

            return this;
        }

        // travel to position
        if (this.state === STATE.ANIMATION) {
            const targetPos = this.p5.createVector(
                offsetX + cells[this.targetCell].pos.x * DIMENSION,
                offsetY + cells[this.targetCell].pos.y * DIMENSION
            );
            const distance = targetPos.copy().sub(this.pos).mag();

            // if near the target cell, snap to it
            if (distance < SNAP_RADIUS) {
                board.state = this.state = STATE.NORMAL;
                this.pos.set(targetPos.x, targetPos.y);

                // commit to the move
                if (this.targetCell !== this.cellIndex) {
                    const { capturedPawnId, isLegal } = this.getLegalMove(board, this.cellIndex, this.targetCell);

                    if (!isLegal) return this;

                    const bestMove: TBestMove = {
                        pawnId: this.id,
                        targetCellIndex: this.targetCell,
                        capturedPawnId,
                        bestScore: 0
                    };
                    board.movePawn(board, bestMove);

                    // check for a winner
                    if (board.currentPlayer === Gamer.PLAYER) {
                        const winner = board.checkGameStatus(board);
                        if (winner !== undefined) {
                            board.state = this.state = STATE.PAUSED;
                            board.onResolve && board.onResolve(winner);
                            return this;
                        }

                        // if there is no winner
                        board.currentPlayer = Gamer.AI;
                        board.nextMove();
                    }

                    // AI move confirm
                    if (board.currentPlayer === Gamer.AI) {
                        board.movePawn(board, board.cachedMove);

                        // check for winner
                        const winner = board.checkGameStatus(board);
                        if (winner !== undefined) {
                            board.state = this.state = STATE.PAUSED;
                            board.onResolve && board.onResolve(winner);
                            return this;
                        }

                        // if there is no winner, continue
                        board.state = this.state = STATE.NORMAL;
                        board.currentPlayer = Gamer.PLAYER;
                    }
                }
                return this;
            }

            // if not near any cells, move to target
            this.pos.add(targetPos).div(2);
        }

        return this;
    }

    draw() {
        // pawn:draw()
        const { mouseX, mouseY } = this.p5;
        // pawn style
        this.p5.noStroke();
        this.owner === Gamer.AI ? this.p5.fill(10, 80, 70) : this.p5.fill(200, 80, 70);
        this.p5.ellipseMode(this.p5.CENTER);
        this.p5.circle(this.pos.x, this.pos.y, PAWN_RADIUS);

        // draw curson
        if (this.owner === Gamer.PLAYER && this.p5.createVector(mouseX, mouseY).dist(this.pos) < PAWN_RADIUS) {
            this.p5.cursor(this.p5.HAND);
        }

        if (this.board.showHelpers) {
            // points texts
            this.p5.stroke(255);
            this.p5.strokeWeight(1);
            this.p5.noFill();
            this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
            this.p5.text(`${this.id} (${this.cellIndex})`, this.pos.x, this.pos.y);
        }
    }

    getLegalMove(
        board: TCrossBoard,
        currentCellIndex: number,
        targetCellIndex: number
    ): { isLegal: boolean; capturedPawnId: number | undefined } {
        let isLegal = false;
        let capturedPawnId;
        const cell = board.cells[currentCellIndex];

        for (let i = 0; i < cell.connectingIndices.length; i++) {
            const connector = cell.connectingIndices[i];
            if (connector[0] === targetCellIndex) isLegal = true;
            if (
                connector[1] === targetCellIndex &&
                board.cells[connector[0]].pawn?.owner !== this.owner &&
                board.cells[connector[0]].pawn?.owner !== undefined
            ) {
                const capturedPawn = board.pawns.find((p) => p.cellIndex === connector[0]);
                capturedPawnId = capturedPawn?.id;
                isLegal = true;
            }
        }

        return { isLegal, capturedPawnId };
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
        // new Pawn(p5, { id: 4, board, owner: Gamer.AI, cellIndex: 6 }),

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
            // pawn: null
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
            // pawn: pawns[4]
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

// --------------------------------------------------------
// --------------------------------------------------------
export default CrossBoard;
