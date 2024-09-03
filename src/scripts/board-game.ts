import { GUI } from 'dat.gui';
import P5 from 'p5';
import CrossBoard from 'src/libs/cross-board';
import { Gamer, MOUSE_BTN } from 'src/utils/utils';

/**--------------------------------- */
// variables & types
let board: CrossBoard;
const scoreContainer = document.getElementById('score-card');
const statusContainer = document.getElementById('status');

/**--------------------------------- */
// sketch
const sketch = (p5: P5) => {
    const options = {
        size: 400,
        showHelpers: true
    };

    const gui = new GUI({ autoPlace: false });
    gui.domElement.id = 'gui';
    document.getElementById('gui')?.appendChild(gui.domElement);
    gui.add(options, 'showHelpers').onChange((val) => {
        board.setValues('showHelpers', val);
    });
    gui.add(options, 'size', 200, 500, 10).onChange((val) => {
        // board.setValues('size', val);
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
        if (scoreContainer) scoreContainer.style.top = `${(window.innerHeight + options.size) / 2 + 30}px`;
        scoreContainer?.addEventListener('submit', (event: FormDataEvent) => {
            event.preventDefault();
            scoreContainer.style.display = 'none';
            board.resetGame({ currentPlayer: Gamer.PLAYER, showHelpers: options.showHelpers, onResolve });
            p5.loop();
        });

        init(p5);
    };

    /** draw */
    p5.draw = () => {
        p5.background(200, 60, 10);
        board?.update(p5.deltaTime).draw();
    };

    p5.mouseClicked = (e: MouseEvent) => {
        if (e.button !== MOUSE_BTN.LEFT) return;
        // console.log(board);

        // p5.background(200, 60, 10);
        // board.nextMove(board);
        // board.update(1).draw();
    };

    /**--------------------------------- */
    // functions

    function resizeDisplay(canvas: P5) {
        canvas.resizeCanvas(window.innerWidth, window.innerHeight);
    }

    function init(p5: P5) {
        p5.background(200, 60, 10);

        //setup board
        board = new CrossBoard(p5, { currentPlayer: Gamer.PLAYER, showHelpers: options.showHelpers, onResolve });
        board.currentPlayer === Gamer.PLAYER ? p5.loop() : p5.noLoop();
    }

    function onResolve(winner: Gamer) {
        const text = winner === Gamer.PLAYER ? 'You Win!!' : 'You Loose!!';
        console.log(text);
        if (scoreContainer) scoreContainer.style.display = 'flex';
        if (statusContainer) statusContainer.innerText = text;
    }

    /**--------------------------------- */
    // classes
};

new P5(sketch);
