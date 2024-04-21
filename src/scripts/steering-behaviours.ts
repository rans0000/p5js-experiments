import { GUI } from 'dat.gui';
import P5 from 'p5';
import AutonomousAgent from '../libs/autonomous-agent';
import { MOUSE_BTN } from '../utils/utils';

/**--------------------------------- */
// variables
let agents: AutonomousAgent[] = [];
let target: P5.Vector | null = null;

/**--------------------------------- */
// sketch
const sketch = (p5: P5) => {
    const options = {
        showHelpers: false
    };

    const gui = new GUI({ autoPlace: false });
    gui.domElement.id = 'gui';
    gui.add(options, 'showHelpers');
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
    };

    /** draw */
    p5.draw = () => {
        p5.background(200, 60, 10);

        drawTarget(target);

        for (let i = 0; i < agents.length; i++) {
            const force = agents[i].seek(target);
            agents[i].applyForces(force);
            agents[i].update();
            agents[i].draw(options.showHelpers);
        }
    };

    p5.mouseClicked = (e: MouseEvent) => {
        if (e.button !== MOUSE_BTN.LEFT) return false;
        target = p5.createVector(e.clientX, e.clientY);
        return false;
    };

    /**--------------------------------- */
    // functions

    function resizeDisplay(canvas: P5) {
        canvas.resizeCanvas(window.innerWidth, window.innerHeight);
    }

    function init(p5: P5) {
        p5.background(200, 60, 10);

        agents.push(new AutonomousAgent(p5, { pos: p5.createVector(200, 300) }));
    }

    function drawTarget(target) {
        if (!target) return;

        p5.push();
        p5.translate(target.x, target.y);
        p5.noFill();
        p5.stroke(0, 100, 70);
        p5.circle(0, 0, 5);
        p5.rotate(p5.PI / 4);
        p5.rectMode(p5.CENTER);
        p5.rect(0, 0, 10);
        p5.pop();
    }

    /**--------------------------------- */
    // classes
};

new P5(sketch);
