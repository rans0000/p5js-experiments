import { GUI } from 'dat.gui';
import P5 from 'p5';
import InteractivePath from '../libs/interactive-path';
import { MOUSE_BTN } from '../utils/utils';
import { TPoints } from 'src/utils/types';

/* ********************************************* */
type TMode = 'view' | 'draw';
let collection: InteractivePath[] = [];
let path: InteractivePath;

const sketch = (p5: P5) => {
    let options = {
        mode: 'view' as TMode,
        findOnlyWithinSegment: false,
        clear: clear
    };

    function clear() {
        path.setPoints([]);
    }

    function toggleDrawMode(mode: TMode) {
        switch (mode) {
            case 'view':
                path?.stopPainting();
                break;
            case 'draw':
                path?.startPainting();
                break;
            default:
                break;
        }
    }

    const gui = new GUI({ autoPlace: false });
    gui.domElement.id = 'gui';
    document.getElementById('gui')?.appendChild(gui.domElement);
    gui.add(options, 'mode', ['view', 'draw']).onChange(toggleDrawMode);
    gui.add(options, 'findOnlyWithinSegment').name('Find Within Segment');
    gui.add(options, 'clear').name('Clear Canvas');

    //setup
    p5.setup = () => {
        const canvas = p5.createCanvas(window.innerWidth, window.innerHeight);
        canvas.parent('app');
        p5.background('white');
        p5.pixelDensity(1);
        p5.colorMode(p5.HSB);

        window.addEventListener('resize', () => resizeDisplay(p5));
        document.oncontextmenu = function () {
            return false;
        };

        path = new InteractivePath(p5, { isClosed: false });
        const points: TPoints[] = [
            [p5.createVector(200, 300), p5.createVector(250, 150), p5.createVector(550, 250), p5.createVector(730, 100)]
        ];
        path.setPoints(points);
        collection.push(path);
    };

    p5.mouseReleased = (event: MouseEvent) => {
        switch (event.button) {
            case MOUSE_BTN.LEFT:
                if (options.mode === 'draw') {
                    path?.startPainting();
                }
                break;
            case MOUSE_BTN.RIGHT:
                if (options.mode === 'draw') {
                    path?.stopPainting();
                }
                break;
            default:
                break;
        }
    };

    p5.keyPressed = (event: KeyboardEvent) => {
        if (event.keyCode === p5.ESCAPE) {
            p5.isLooping() ? p5.noLoop() : p5.loop();
        }
    };

    //draw
    p5.draw = () => {
        p5.clear();
        collection.forEach((item) => {
            item.update(p5.deltaTime).draw();
            if (item instanceof InteractivePath && item.getPoints().length && options.mode === 'view') {
                const closest = item.getClosestSegment(p5.mouseX, p5.mouseY, options.findOnlyWithinSegment);
                if (closest.intersectionPosition) {
                    drawHelper(p5, closest.intersectionPosition);
                }
            }
        });
    };
};

function resizeDisplay(canvas: P5) {
    canvas.resizeCanvas(window.innerWidth, window.innerHeight);
}

function drawHelper(p5: P5, intersectionPosition: P5.Vector) {
    const mx = p5.mouseX;
    const my = p5.mouseY;

    p5.stroke(0, 200, 128);
    p5.strokeWeight(2);
    p5.line(mx, my, intersectionPosition.x, intersectionPosition.y);

    p5.strokeWeight(0);
    p5.fill(255);
    p5.circle(mx, my, 5);
}

new P5(sketch);
