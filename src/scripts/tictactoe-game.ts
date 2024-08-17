import { GUI } from 'dat.gui';
import P5 from 'p5';
import TicTacToe from 'src/libs/tictactoe';
import { Gamer, TGameStatus } from 'src/utils/utils';

/**--------------------------------- */
// variables & types
const scoreContainer = document.getElementById('score-card');
const statusContainer = document.getElementById('status');
let board: TicTacToe;

/**--------------------------------- */
// sketch
const sketch = (p5: P5) => {
    const options = {
        showHelpers: false,
        size: 400,
        currentTurn: Gamer.AI
    };

    const gui = new GUI({ autoPlace: false });
    gui.domElement.id = 'gui';
    document.getElementById('gui')?.appendChild(gui.domElement);
    gui.add(options, 'showHelpers').onChange((val) => {
        console.log(val);

        board.setValues('showHelpers', val);
    });
    gui.add(options, 'size', 200, 500, 10).onChange((val) => {
        board.setValues('size', val);
        if (scoreContainer) scoreContainer.style.top = `${(window.innerHeight + val) / 2 + 30}px`;
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
            options.currentTurn = options.currentTurn === Gamer.AI ? Gamer.PLAYER : Gamer.AI;
            if (options.currentTurn === Gamer.PLAYER) {
                if (scoreContainer) scoreContainer.style.display = 'flex';
                if (statusContainer) statusContainer.innerText = 'Start Game';
            }
            board.resetGame(options.currentTurn);
        });
        init(p5);
        // p5.noLoop();

        // setup the board
        board = new TicTacToe(p5, {
            showHelpers: options.showHelpers,
            size: options.size,
            onResolve: onResolve,
            currentTurn: options.currentTurn
        });
    };

    /** draw */
    p5.draw = () => {
        p5.background(200, 60, 10);

        board.update(p5.deltaTime).draw();
    };

    /**--------------------------------- */
    // functions

    function resizeDisplay(canvas: P5) {
        canvas.resizeCanvas(window.innerWidth, window.innerHeight);
    }

    function init(p5: P5) {
        p5.background(200, 60, 10);
    }

    function onResolve(game: TGameStatus) {
        let text = '';

        switch (game.winner) {
            case Gamer.PLAYER:
                text = "Player 'X' Wins!!";
                break;
            case Gamer.AI:
                text = "Player 'O' Wins!!";
                break;
            default:
                text = 'Game is a Tie!!';
                break;
        }
        if (scoreContainer) scoreContainer.style.display = 'flex';
        if (statusContainer) statusContainer.innerText = text;
    }

    /**--------------------------------- */
    // classes
};

new P5(sketch);
