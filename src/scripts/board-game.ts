import { GUI } from 'dat.gui';
import P5 from 'p5';
import CrossBoard from 'src/libs/cross-board';
import { Gamer } from 'src/utils/utils';

/**--------------------------------- */
// variables & types
let board: CrossBoard;
let MARGIN = 10;
let MAX_CELL_SIZE = 100;
const scoreContainer = document.getElementById('score-card');
const statusContainer = document.getElementById('status');

/**--------------------------------- */
// sketch
const sketch = (p5: P5) => {
    const options = {
        showHelpers: false
    };

    const gui = new GUI({ autoPlace: false });
    gui.domElement.id = 'gui';
    document.getElementById('gui')?.appendChild(gui.domElement);
    gui.add(options, 'showHelpers').onChange((val) => {
        board.setValues('showHelpers', val);
    });

    /** setup */
    p5.setup = () => {
        const canvas = p5.createCanvas(window.innerWidth, window.innerHeight);
        canvas.parent('app');
        p5.background('white');
        p5.pixelDensity(1);
        p5.colorMode(p5.HSB);
        window.addEventListener('resize', () => resizeDisplay(p5));

        // setup markup
        if (scoreContainer) scoreContainer.style.top = `${(window.innerHeight + 400) / 2 + 30}px`;
        scoreContainer?.addEventListener('submit', (event: FormDataEvent) => {
            event.preventDefault();
            scoreContainer.style.display = 'none';
            const { cellSize, offset } = calculateBoardDimensions();
            board.resetGame({
                currentPlayer: Gamer.PLAYER,
                showHelpers: options.showHelpers,
                size: cellSize,
                offset: offset,
                onResolve
            });
            p5.loop();
        });

        init(p5);
    };

    /** draw */
    p5.draw = () => {
        p5.background(200, 60, 10);
        board?.update(p5.deltaTime).draw();
    };

    /**--------------------------------- */
    // functions

    function resizeDisplay(canvas: P5) {
        canvas.resizeCanvas(window.innerWidth, window.innerHeight);

        const { cellSize, offset } = calculateBoardDimensions();
        board.setValues('size', cellSize);
        board.setValues('offset', offset);
    }

    function calculateBoardDimensions() {
        const { innerWidth, innerHeight } = window;
        const DIMENSION = innerWidth < innerHeight ? innerWidth : innerHeight;

        const totalSize = DIMENSION - 2 * MARGIN;
        const maxSize = MAX_CELL_SIZE * 4;
        const cellSize = Math.min(totalSize, maxSize) / 5;
        const offset = p5.createVector(innerWidth / 2 - 2 * cellSize, innerHeight / 2 - 2 * cellSize);

        return {
            cellSize,
            offset
        };
    }

    function init(p5: P5) {
        p5.background(200, 60, 10);

        //setup board
        const { cellSize, offset } = calculateBoardDimensions();
        board = new CrossBoard(p5, {
            currentPlayer: Gamer.PLAYER,
            showHelpers: options.showHelpers,
            size: cellSize,
            offset: offset,
            onResolve
        });
        board.currentPlayer === Gamer.PLAYER ? p5.loop() : p5.noLoop();
    }

    function onResolve(winner: Gamer) {
        const text = winner === Gamer.PLAYER ? 'You Win!!' : 'You Loose!!';
        if (scoreContainer) scoreContainer.style.display = 'flex';
        if (statusContainer) statusContainer.innerText = text;
    }

    /**--------------------------------- */
    // classes
};

new P5(sketch);
