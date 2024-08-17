import P5 from 'p5';
import { Gamer, TGameStatus, TTicTacToeCell } from 'src/utils/utils';

const SIZE = 3;
let turns = 0;

type TTicTacToe = {
    showHelpers: boolean;
    cells: TTicTacToeCell[];
    size: number;
    currentTurn: Gamer;
    status: Gamer | undefined;
    winnerCells: TTicTacToeCell[];
    onResolve?: (status: TGameStatus) => void;
};

type Keys = 'size' | 'showHelpers';

class TicTacToe {
    p5: P5;
    cells: TTicTacToeCell[];
    showHelpers: boolean;
    size: number;
    status: TTicTacToe['status'];
    currentTurn: Gamer;
    winnerCells: TTicTacToeCell[];
    onResolve?: (status: TGameStatus) => void;

    constructor(p5: P5, _config?: Partial<TTicTacToe>) {
        const config: TTicTacToe = {
            showHelpers: false,
            cells: buildCells(p5),
            size: 400,
            status: undefined,
            currentTurn: Gamer.PLAYER,
            winnerCells: [],
            ..._config
        };
        this.p5 = p5;
        this.showHelpers = config.showHelpers;
        this.cells = config.cells;
        this.size = config.size;
        this.status = config.status;
        this.currentTurn = config.currentTurn;
        winnerCells: config.winnerCells;
        this.onResolve = config.onResolve;

        this.p5.canvas.addEventListener('click', this.onClick.bind(this));

        if (this.currentTurn === Gamer.AI) {
            const index = this.calculateBestMove(this.cells);
            if (index > -1) this.cells[index].owner = Gamer.AI;
            this.currentTurn = Gamer.PLAYER;
        }
    }

    setValues(key: Keys, value: number | boolean) {
        if (typeof value === 'number') {
            switch (key) {
                case 'size':
                    this.size = value;
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

    onClick(event: MouseEvent) {
        if (this.status !== undefined) return;

        const width = this.size / SIZE;
        const { innerWidth, innerHeight } = window;
        const offsetX = (innerWidth - this.size) / 2;
        const offsetY = (innerHeight - this.size) / 2;
        const { clientX, clientY } = event;

        // set selected cell
        for (const cell of this.cells) {
            const startX = offsetX + cell.pos.x * width;
            const startY = offsetY + cell.pos.y * width;

            if (
                cell.owner === undefined &&
                clientX > startX &&
                clientX < startX + this.size / SIZE &&
                clientY > startY &&
                clientY < startY + this.size / SIZE
            ) {
                cell.owner = this.currentTurn;
                this.currentTurn = this.currentTurn === Gamer.AI ? Gamer.PLAYER : Gamer.AI;
            }
        }

        // ai calculations
        if (this.currentTurn === Gamer.AI) {
            turns = 0;
            const index = this.calculateBestMove(this.cells);

            if (index > -1) this.cells[index].owner = Gamer.AI;
            this.currentTurn = Gamer.PLAYER;
            console.log(turns);
        }

        // check win/draw status
        const game = this.checkGameStatus(this.cells);
        this.status = game.winner;
        this.winnerCells = game.cells;

        if (game.filledCells === 0 || game.winner !== undefined) {
            this.onResolve && this.onResolve(game);
        }
    }

    calculateBestMove(cells: TTicTacToeCell[] = []): number {
        const dimension = SIZE * SIZE;
        let bestScore = -Infinity;
        let move: number = -1;
        let depth = 0;
        let alpha = -Infinity;
        let beta = Infinity;

        for (let i = 0; i < dimension; i++) {
            if (cells[i].owner === undefined) {
                cells[i].owner = Gamer.AI;
                let score = this.minimax(cells, depth, false, alpha, beta, i);
                this.showHelpers && console.log('score: ', i, score);

                cells[i].owner = undefined;
                if (score >= bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }

        return move;
    }

    minimax(
        cells: TTicTacToeCell[] = [],
        depth: number,
        isMaximizing: boolean,
        alpha: number,
        beta: number,
        next: number
    ): number {
        const dimension = SIZE * SIZE;
        const game = this.checkGameStatus(cells);

        turns++;

        game.winner !== undefined && game.filledCells === 8 && console.log(game);

        if (game.winner !== undefined) {
            const points = getPoints(game.winner, depth);
            if (this.showHelpers) {
                let ccc = printCells(cells);
                console.log(ccc, `C: ${next} P: ${points.toFixed(2)}  D: ${depth}`);
            }

            return points;
        }
        if (game.winner === undefined && game.filledCells === 0) return getPoints(game.winner, depth);

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < dimension; i++) {
                // is spot available?
                if (cells[i].owner === undefined) {
                    cells[i].owner = Gamer.AI;
                    let score = this.minimax(cells, depth + 1, false, alpha, beta, i);
                    cells[i].owner = undefined;
                    bestScore = Math.max(score, bestScore);
                    alpha = Math.max(alpha, score);
                    if (beta <= alpha) break;
                }
            }

            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < dimension; i++) {
                // is spot available?
                if (cells[i].owner === undefined) {
                    cells[i].owner = Gamer.PLAYER;
                    let score = this.minimax(cells, depth + 1, true, alpha, beta, i);
                    cells[i].owner = undefined;
                    bestScore = Math.min(score, bestScore);
                    beta = Math.min(beta, score);
                    if (beta <= alpha) break;
                }
            }
            return bestScore;
        }
    }

    checkGameStatus(cells: TTicTacToeCell[]): TGameStatus {
        let filledCells = 0;
        let winner: TGameStatus['winner'];
        let victoryCells: TTicTacToeCell[] = [];

        // cheack filled cells
        for (const cell of cells) {
            if (cell.owner === undefined) ++filledCells;
        }

        // check for win
        const dimension = SIZE;
        for (let i = 0; i < dimension; i++) {
            if (cells[i].owner !== undefined && areCellsEqual(cells[i], cells[i + dimension], cells[i + 2 * dimension])) {
                winner = cells[i].owner;
                victoryCells = [cells[i], cells[i + dimension], cells[i + 2 * dimension]];
                break;
            }

            if (
                cells[i * dimension].owner !== undefined &&
                areCellsEqual(cells[i * dimension], cells[1 + i * dimension], cells[2 + i * dimension])
            ) {
                winner = cells[i * dimension].owner;
                victoryCells = [cells[i * dimension], cells[1 + i * dimension], cells[2 + i * dimension]];
                break;
            }
        }
        if (cells[0].owner !== undefined && areCellsEqual(cells[0], cells[4], cells[8])) {
            winner = cells[0].owner;
            victoryCells = [cells[0], cells[4], cells[8]];
        }
        if (cells[2].owner !== undefined && areCellsEqual(cells[2], cells[4], cells[6])) {
            winner = cells[2].owner;
            victoryCells = [cells[2], cells[4], cells[6]];
        }

        return {
            filledCells,
            winner,
            cells: victoryCells
        };
    }

    resetGame(currentTurn: Gamer = Gamer.PLAYER) {
        this.cells = buildCells(this.p5);
        this.currentTurn = currentTurn;
        this.status = undefined;
        this.winnerCells = [];

        if (this.currentTurn === Gamer.AI) {
            const index = this.calculateBestMove(this.cells);
            if (index > -1) this.cells[index].owner = Gamer.AI;
            this.currentTurn = Gamer.PLAYER;
        }
    }

    update(deltaTime: number): this {
        return this;
    }

    draw(): this {
        this.p5.cursor(this.p5.ARROW);
        const width = this.size / SIZE;
        const { innerWidth, innerHeight } = window;
        const offsetX = (innerWidth - this.size) / 2;
        const offsetY = (innerHeight - this.size) / 2;
        const dimension = SIZE;
        const { mouseX, mouseY } = this.p5;

        for (const cell of this.cells) {
            const startX = offsetX + cell.pos.x * width;
            const startY = offsetY + cell.pos.y * width;

            //draw the cells
            this.p5.strokeWeight(1);
            this.p5.stroke(255);
            this.p5.fill(40, 50, 10);
            this.p5.rectMode(this.p5.CORNER);
            this.p5.rect(startX, startY, width, width);

            // draw cell index
            if (this.showHelpers) {
                this.p5.textAlign(this.p5.LEFT, this.p5.TOP);
                this.p5.textSize(15);
                this.p5.text(cell.pos.x + cell.pos.y * SIZE, startX, startY);
            }

            if (cell.owner !== undefined) {
                this.p5.strokeWeight(0);
                this.p5.fill(255);
                this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
                this.p5.textSize(this.size / dimension);
                const text = cell.owner === Gamer.PLAYER ? 'X' : 'O';
                this.p5.text(text, startX + this.size / dimension / 2, startY + this.size / dimension / 2);
            }

            // draw winner cells
            if (this.status === Gamer.AI || this.status === Gamer.PLAYER) {
                this.p5.strokeWeight(10);
                this.p5.stroke(0, 100, 100);

                this.p5.line(
                    offsetX + this.size / dimension / 2 + this.winnerCells[0].pos.x * width,
                    offsetY + this.size / dimension / 2 + this.winnerCells[0].pos.y * width,
                    offsetX + this.size / dimension / 2 + this.winnerCells[2].pos.x * width,
                    offsetY + this.size / dimension / 2 + this.winnerCells[2].pos.y * width
                );
            }

            // show valid cells
            if (this.status !== undefined) continue;
            if (
                cell.owner === undefined &&
                mouseX > startX &&
                mouseX < startX + this.size / dimension &&
                mouseY > startY &&
                mouseY < startY + this.size / dimension
            ) {
                this.p5.cursor(this.p5.HAND);
            }
        }
        return this;
    }
}

/**--------------------------------- */
// functions

function buildCells(p5: P5): TTicTacToeCell[] {
    const dimension = SIZE;
    const cells: TTicTacToeCell[] = [];
    for (let i = 0; i < dimension * dimension; i++) {
        cells.push({
            pos: p5.createVector(i % dimension, Math.floor(i / dimension)),
            owner: undefined
        });
    }
    return cells;
}

function areCellsEqual(cell0: TTicTacToeCell, cell1: TTicTacToeCell, cell2: TTicTacToeCell): boolean {
    return cell0.owner === cell1.owner && cell0.owner === cell2.owner;
}

function getPoints(val: number | undefined, depth: number) {
    depth++;
    return val === undefined ? 0 : val === 0 ? -10 / depth : 10 / depth;
}

function printCells(cells: TTicTacToeCell[] = []) {
    let text = '';
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            const index = i * SIZE + j;
            text += `${cells[index].owner === undefined ? '   ' : cells[index].owner === Gamer.AI ? ' O ' : ' X '}`;
        }
        text += '\n';
    }
    return text;
}

export default TicTacToe;
