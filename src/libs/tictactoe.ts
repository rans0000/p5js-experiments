import P5 from 'p5';
import { Gamer, TGameStatus, TTicTacToeCell } from 'src/utils/utils';

type TTicTacToe = {
    showHelpers: boolean;
    cells: TTicTacToeCell[];
    size: number;
    currentTurn: Gamer;
    status: Gamer | undefined | 'draw';
    winnerCells: TTicTacToeCell[];
    onResolve?: (status: TGameStatus) => void;
};

type Keys = 'size';

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
            size: 300,
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
    }

    setValues(key: Keys, value: number) {
        switch (key) {
            case 'size':
                this.size = value;
                break;

            default:
                throw 'Unsupported key passed to setValues()';
        }
    }

    onClick(event: MouseEvent) {
        if (this.status !== undefined) return;

        const width = this.size / 3;
        const { innerWidth, innerHeight } = window;
        const offsetX = (innerWidth - this.size) / 2;
        const offsetY = (innerHeight - this.size) / 2;
        const size = 3;
        const { clientX, clientY } = event;

        for (const cell of this.cells) {
            const startX = offsetX + cell.pos.x * width;
            const startY = offsetY + cell.pos.y * width;

            if (
                cell.owner === undefined &&
                clientX > startX &&
                clientX < startX + this.size / size &&
                clientY > startY &&
                clientY < startY + this.size / size
            ) {
                cell.owner = this.currentTurn;
                this.currentTurn = this.currentTurn === Gamer.AI ? Gamer.PLAYER : Gamer.AI;
            }
        }

        const game = this.checkGameStatus();
        this.status = game.status;
        this.winnerCells = game.cells;

        if (game.filledCells === 0 || game.status !== undefined) {
            this.onResolve && this.onResolve(game);
        }
    }

    checkGameStatus(): TGameStatus {
        let filledCells = 0;
        let status: TGameStatus['status'];
        let cells: TTicTacToeCell[] = [];

        // cheack filled cells
        for (const cell of this.cells) {
            if (cell.owner === undefined) ++filledCells;
        }

        // check for win
        const size = 3;
        for (let i = 0; i < size; i++) {
            if (
                this.cells[i].owner !== undefined &&
                this.cells[i].owner === this.cells[i + size].owner &&
                this.cells[i].owner === this.cells[i + 2 * size].owner
            ) {
                status = this.cells[i].owner;
                cells = [this.cells[i], this.cells[i + size], this.cells[i + 2 * size]];
                break;
            }
            if (
                this.cells[i * size].owner !== undefined &&
                this.cells[i * size].owner === this.cells[1 + i * size].owner &&
                this.cells[i * size].owner === this.cells[2 + i * size].owner
            ) {
                status = this.cells[i * size].owner;
                cells = [this.cells[i * size], this.cells[1 + i * size], this.cells[2 + i * size]];
                break;
            }
        }
        if (
            this.cells[0].owner !== undefined &&
            this.cells[0].owner === this.cells[4].owner &&
            this.cells[0].owner === this.cells[8].owner
        ) {
            status = this.cells[0].owner;
            cells = [this.cells[0], this.cells[4], this.cells[8]];
        }
        if (
            this.cells[2].owner !== undefined &&
            this.cells[2].owner === this.cells[4].owner &&
            this.cells[2].owner === this.cells[6].owner
        ) {
            status = this.cells[2].owner;
            cells = [this.cells[2], this.cells[4], this.cells[6]];
        }

        if (filledCells === 0 && status === undefined) {
            status = 'draw';
        }

        return {
            filledCells,
            status,
            cells
        };
    }

    resetGame(currentTurn: Gamer = Gamer.PLAYER) {
        this.cells = buildCells(this.p5);
        this.currentTurn = currentTurn;
        this.status = undefined;
        this.winnerCells = [];
    }

    update(deltaTime: number): this {
        return this;
    }

    draw(): this {
        this.p5.cursor(this.p5.ARROW);
        const width = this.size / 3;
        const { innerWidth, innerHeight } = window;
        const offsetX = (innerWidth - this.size) / 2;
        const offsetY = (innerHeight - this.size) / 2;
        const size = 3;
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

            if (cell.owner !== undefined) {
                this.p5.strokeWeight(0);
                this.p5.fill(255);
                this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
                this.p5.textSize(this.size / size);
                const text = cell.owner === Gamer.PLAYER ? 'X' : 'O';
                this.p5.text(text, startX + this.size / size / 2, startY + this.size / size / 2);
            }

            // draw winner cells
            if (this.status === Gamer.AI || this.status === Gamer.PLAYER) {
                this.p5.strokeWeight(10);
                this.p5.stroke(0, 100, 100);

                this.p5.line(
                    offsetX + this.size / size / 2 + this.winnerCells[0].pos.x * width,
                    offsetY + this.size / size / 2 + this.winnerCells[0].pos.y * width,
                    offsetX + this.size / size / 2 + this.winnerCells[2].pos.x * width,
                    offsetY + this.size / size / 2 + this.winnerCells[2].pos.y * width
                );
            }

            // show valid cells
            if (this.status !== undefined) continue;
            if (
                cell.owner === undefined &&
                mouseX > startX &&
                mouseX < startX + this.size / size &&
                mouseY > startY &&
                mouseY < startY + this.size / size
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
    const size = 3;
    const cells: TTicTacToeCell[] = [];
    for (let i = 0; i < size * size; i++) {
        cells.push({
            pos: p5.createVector(i % size, Math.floor(i / size)),
            owner: undefined
        });
    }
    return cells;
}

export default TicTacToe;
