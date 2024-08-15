import { GUI } from 'dat.gui';
import P5 from 'p5';
import TicTacToe from 'src/libs/tictactoe';
import { TGameStatus } from 'src/utils/utils';

/**--------------------------------- */
// variables & types
let board: TicTacToe;

/**--------------------------------- */
// sketch
const sketch = (p5: P5) => {
    const options = {
        showHelpers: true,
        size: 400
    };

    const gui = new GUI({ autoPlace: false });
    gui.domElement.id = 'gui';
    document.getElementById('gui')?.appendChild(gui.domElement);
    gui.add(options, 'showHelpers');
    gui.add(options, 'size', 200, 500, 10).onChange((val) => {
        board.setValues('size', val);
    });

    /** setup */
    p5.setup = () => {
        const canvas = p5.createCanvas(window.innerWidth, window.innerHeight);
        canvas.parent('app');
        p5.background('white');
        p5.pixelDensity(1);
        p5.colorMode(p5.HSB);
        window.addEventListener('resize', () => resizeDisplay(p5));
        init(p5);
        // p5.noLoop();

        // setup the board
        board = new TicTacToe(p5, { showHelpers: options.showHelpers, size: options.size, onResolve: onResolve });
        // console.log(board.cells.map((t) => t.owner));
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

    function onResolve(status: TGameStatus) {
        console.log(status);
        // board.resetGame();
    }

    /**--------------------------------- */
    // classes
};

new P5(sketch);
