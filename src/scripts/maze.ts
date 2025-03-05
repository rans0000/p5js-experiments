import P5 from 'p5';
import TileGrid from 'src/libs/tile-grid';
import { TTileGrid } from 'src/utils/types';

/**--------------------------------- */
// variables & types
let grid: TTileGrid;

/**--------------------------------- */
// sketch
const sketch = (p5: P5) => {
    // const options = {
    //     showHelpers: false,
    //     size: 400,
    //     currentTurn: Gamer.AI
    // };

    // const gui = new GUI({ autoPlace: false });
    // gui.domElement.id = 'gui';
    // document.getElementById('gui')?.appendChild(gui.domElement);
    // gui.add(options, 'showHelpers').onChange((val) => {
    //     console.log(val);

    //     board.setValues('showHelpers', val);
    // });
    // gui.add(options, 'size', 200, 500, 10).onChange((val) => {
    //     board.setValues('size', val);
    //     if (scoreContainer) scoreContainer.style.top = `${(window.innerHeight + val) / 2 + 30}px`;
    // });

    /** setup */
    p5.setup = () => {
        const canvas = p5.createCanvas(window.innerWidth, window.innerHeight);
        canvas.parent('app');
        p5.background('white');
        p5.pixelDensity(1);
        p5.colorMode(p5.HSB);
        window.addEventListener('resize', () => resizeDisplay(p5));

        //
        init(p5);
    };

    /** draw */
    p5.draw = () => {
        p5.background(200, 60, 10);
        grid.update(p5.deltaTime).draw();
    };

    /**--------------------------------- */
    // functions

    function resizeDisplay(canvas: P5) {
        canvas.resizeCanvas(window.innerWidth, window.innerHeight);
    }

    function init(p5: P5) {
        p5.background(200, 60, 10);
        grid = new TileGrid({ p5: p5, width: 360, size: 10, solver: 'DFS_Recursive' });
    }

    /**--------------------------------- */
    // classes
};

new P5(sketch);
