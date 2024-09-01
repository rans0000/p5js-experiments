import { GUI } from 'dat.gui';
import P5 from 'p5';
import CrossBoard from 'src/libs/cross-board-2';
import { Gamer, MOUSE_BTN } from 'src/utils/utils';

/**--------------------------------- */
// variables & types
let board: CrossBoard;

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
        init(p5);
    };

    /** draw */
    p5.draw = () => {
        p5.background(200, 60, 10);
        board?.update(p5.deltaTime).draw();
    };

    p5.mouseClicked = (e: MouseEvent) => {
        if (e.button !== MOUSE_BTN.LEFT) return;
        console.log(board);

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
        // board = new CrossBoard(p5, {
        //     currentPlayer: Gamer.PLAYER,
        //     size: options.size,
        //     showHelpers: options.showHelpers
        // });
        board = new CrossBoard(p5, { currentPlayer: Gamer.PLAYER, showHelpers: options.showHelpers });
        board.currentPlayer === Gamer.PLAYER ? p5.loop() : p5.noLoop();

        // console.log(board.points.map((p) => [p.pos.x, p.pos.y]));
    }

    /**--------------------------------- */
    // classes
};

new P5(sketch);
