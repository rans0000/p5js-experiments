import { GUI } from 'dat.gui';
import P5 from 'p5';
import CA from 'src/libs/cellular-automaton';
import { MOUSE_BTN } from 'src/utils/utils';

/**--------------------------------- */
// variables & types
let ca: CA;
let isDragging = false;
/**--------------------------------- */
// sketch
const sketch = (p5: P5) => {
    const options = {
        showHelpers: false
    };

    const gui = new GUI({ autoPlace: false });
    gui.domElement.id = 'gui';
    document.getElementById('gui')?.appendChild(gui.domElement);

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
    };

    /** draw */
    p5.draw = () => {
        p5.background(200, 60, 10);

        ca.update(p5.deltaTime).draw();

        !isDragging && ca.calculateState();
    };

    p5.mousePressed = (event: MouseEvent) => {
        if (event.button === MOUSE_BTN.LEFT) {
            isDragging = true;
            p5.loop();
            const { clientX, clientY } = event;
            if (clientX > ca.horizontalTiles * ca.size && clientY > ca.verticalTiles) return;
            const x = Math.floor(clientX / ca.size);
            const y = Math.floor(clientY / ca.size);
            ca.updateTile(x, y);
        }
    };

    p5.mouseDragged = (event: MouseEvent) => {
        if (!isDragging) return;
        const { clientX, clientY } = event;
        if (clientX > ca.horizontalTiles * ca.size && clientY > ca.verticalTiles) return;
        const x = Math.floor(clientX / ca.size);
        const y = Math.floor(clientY / ca.size);
        ca.updateTile(x, y);
    };

    p5.mouseReleased = (event: MouseEvent) => {
        if (event.button === MOUSE_BTN.LEFT) {
            isDragging = false;
            ca.calculateState();
            p5.loop();
        }
    };

    /**--------------------------------- */
    // functions

    function resizeDisplay(canvas: P5) {
        canvas.resizeCanvas(window.innerWidth, window.innerHeight);
    }

    function init(p5: P5) {
        p5.background(200, 60, 10);
        let { innerWidth, innerHeight } = window;
        const size = 20;
        ca = new CA(p5, {
            horizontalTiles: Math.floor(innerWidth / size),
            verticalTiles: Math.floor(innerHeight / size),
            size
        });
    }

    /**--------------------------------- */
    // classes
};

new P5(sketch);
