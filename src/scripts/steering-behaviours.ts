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
        showHelpers: false,
        maxSpeed: 4,
        maxForce: 0.1,
        mode: 'Seek'
    };

    const gui = new GUI({ autoPlace: false });
    gui.domElement.id = 'gui';
    document.getElementById('gui')?.appendChild(gui.domElement);
    gui.add(options, 'mode', ['Seek', 'Flee'])
        .name('Example Type')
        .onChange((val) => {
            switch (val) {
                case 'Seek':
                    initSeek(p5);
                    break;
                case 'Flee':
                    initFlee(p5);
                    break;
                default:
                    break;
            }
        });
    gui.add(options, 'showHelpers');
    gui.add(options, 'maxSpeed', 0.1, 10, 0.1).onChange((val) =>
        agents.forEach((agent) => agent.setValues('maxSpeed', val))
    );
    gui.add(options, 'maxForce', 0.01, 2, 0.01).onChange((val) =>
        agents.forEach((agent) => agent.setValues('maxForce', val))
    );

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
        switch (options.mode) {
            case 'Seek':
                seek();
                break;
            case 'Flee':
                flee();
                break;
            default:
                break;
        }
    };

    p5.mouseClicked = (e: MouseEvent) => {
        if (e.button !== MOUSE_BTN.LEFT) return false;
        switch (options.mode) {
            case 'Seek':
            case 'Flee':
                target = p5.createVector(e.clientX, e.clientY);
                break;
            default:
                break;
        }
        return false;
    };

    /**--------------------------------- */
    // functions

    function resizeDisplay(canvas: P5) {
        canvas.resizeCanvas(window.innerWidth, window.innerHeight);
    }

    function init(p5: P5) {
        p5.background(200, 60, 10);
        target = p5.createVector(window.innerWidth / 2, window.innerHeight / 2);
        initSeek(p5);
    }
    function initSeek(p5: P5) {
        agents = [];
        agents.push(
            new AutonomousAgent(p5, {
                pos: p5.createVector(200, 300),
                maxSpeed: options.maxSpeed,
                maxForce: options.maxForce
            })
        );
    }

    function initFlee(p5: P5) {
        agents = [];
        initSeek(p5);
    }

    function seek() {
        for (let i = 0; i < agents.length; i++) {
            const force = agents[i].seek(target);
            agents[i].applyForces(force);
            agents[i].update();
            agents[i].draw(options.showHelpers);
        }
    }
    function flee() {
        for (let i = 0; i < agents.length; i++) {
            const force = agents[i].flee(target);
            agents[i].applyForces(force);
            agents[i].update();
            agents[i].draw(options.showHelpers);
        }
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
