import P5 from 'p5';
import { Gamer, TGameStatus } from 'src/utils/utils';

type TCell = {
    pos: P5.Vector;
    owner: Gamer | undefined;
};

type TTicTacToe = {
    showHelpers: boolean;
    cells: TCell[];
    size: number;
    currentTurn: Gamer;
    onResolve?: (status: TGameStatus) => void;
};

type Keys = 'size';

class TicTacToe {
    p5: P5;
    cells: TCell[];
    showHelpers: boolean;
    size: number;
    currentTurn: Gamer;
    onResolve?: (status: TGameStatus) => void;

    constructor(p5: P5, _config?: Partial<TTicTacToe>) {
        const config: TTicTacToe = {
            showHelpers: false,
            cells: buildCells(p5),
            size: 300,
            currentTurn: Gamer.PLAYER,
            ..._config
        };
        this.p5 = p5;
        this.showHelpers = config.showHelpers;
        this.cells = config.cells;
        this.size = config.size;
        this.currentTurn = config.currentTurn;
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

        const status = this.checkGameStatus();

        if (status.filledCells === 0) {
            this.onResolve && this.onResolve(status);
        }
    }

    checkGameStatus(): TGameStatus {
        let filledCells = 0;
        let status: TGameStatus['status'];
        for (const cell of this.cells) {
            if (cell.owner === undefined) ++filledCells;
        }
        return {
            filledCells,
            status
        };
    }

    resetGame(currentTurn: Gamer = Gamer.PLAYER) {
        this.cells = buildCells(this.p5);
        this.currentTurn = currentTurn;
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

            // show valid cells
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

function buildCells(p5: P5): TCell[] {
    const size = 3;
    const cells: TCell[] = [];
    for (let i = 0; i < size * size; i++) {
        // let owner: Gamer | undefined = Math.floor(p5.random(2));
        cells.push({
            pos: p5.createVector(Math.floor(i / size), i % size),
            owner: undefined
        });
    }
    return cells;
}

export default TicTacToe;
