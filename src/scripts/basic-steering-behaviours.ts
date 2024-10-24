import { GUI } from 'dat.gui';
import P5 from 'p5';
import AutonomousAgent from '../libs/autonomous-agent';
import { MOUSE_BTN } from '../utils/utils';

/**--------------------------------- */
// variables & types
type TMode = 'Seek' | 'Flee' | 'Pursuit' | 'Evade' | 'Arrive' | 'Wander';
let agents: AutonomousAgent[] = [];
let target: P5.Vector | null = null;

/**--------------------------------- */
// sketch
const sketch = (p5: P5) => {
    const options = {
        showHelpers: false,
        maxSpeed: 4,
        maxForce: 0.1,
        mode: 'Wander' as TMode
    };

    const gui = new GUI({ autoPlace: false });
    gui.domElement.id = 'gui';
    document.getElementById('gui')?.appendChild(gui.domElement);
    gui.add(options, 'mode', ['Seek', 'Flee', 'Pursuit', 'Evade', 'Arrive', 'Wander'])
        .name('Example Type')
        .onChange((val: TMode) => {
            init(p5);
        });
    gui.add(options, 'showHelpers').onChange((val) =>
        agents.forEach((agent, i) => {
            agent.setValues('showHelpers', val);
        })
    );
    gui.add(options, 'maxSpeed', 0.1, 10, 0.1).onChange((val) =>
        agents.forEach((agent, i) => {
            if (i === 0) {
                agent.setValues('maxSpeed', val);
            }
        })
    );
    gui.add(options, 'maxForce', 0.01, 2, 0.01).onChange((val) =>
        agents.forEach((agent, i) => {
            if (i === 0) {
                agent.setValues('maxForce', val);
            }
        })
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
            case 'Pursuit':
                pursuit();
                break;
            case 'Evade':
                evade();
                break;
            case 'Arrive':
                arrive();
                break;
            case 'Wander':
                wander();
                break;
            default:
                break;
        }
        for (const agent of agents) {
            agent.move();
        }
    };

    p5.mouseClicked = (e: MouseEvent) => {
        if (e.button !== MOUSE_BTN.LEFT) return false;
        switch (options.mode) {
            case 'Seek':
            case 'Flee':
            case 'Pursuit':
            case 'Evade':
            case 'Arrive':
                target = p5.createVector(e.clientX, e.clientY);
                break;
            case 'Wander':
                target = null;
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
        switch (options.mode) {
            case 'Seek':
                initSeek(p5);
                break;
            case 'Flee':
                initFlee(p5);
                break;
            case 'Pursuit':
                initPursuit(p5);
                break;
            case 'Evade':
                initEvade(p5);
                break;
            case 'Arrive':
                initArrive(p5);
                break;
            case 'Wander':
                initWander(p5);
                break;
            default:
                break;
        }
    }

    function initSeek(p5: P5) {
        agents = [];
        agents.push(
            new AutonomousAgent(p5, {
                pos: p5.createVector(200, 300),
                maxSpeed: options.maxSpeed,
                maxForce: options.maxForce,
                showHelpers: options.showHelpers
            })
        );
        target = target || p5.createVector(window.innerWidth / 2, window.innerHeight / 2);
    }

    function seek() {
        for (let i = 0; i < agents.length; i++) {
            const force = agents[i].seek(target);
            agents[i].applyForces(force);
            agents[i].update();
            agents[i].draw();
        }
    }

    function initFlee(p5: P5) {
        agents = [];
        initSeek(p5);
        target = target || p5.createVector(window.innerWidth / 2, window.innerHeight / 2);
    }

    function flee() {
        for (let i = 0; i < agents.length; i++) {
            const force = agents[i].flee(target);
            agents[i].applyForces(force);
            agents[i].update();
            agents[i].draw();
        }
    }

    function initPursuit(p5: P5) {
        const player = new AutonomousAgent(p5, {
            pos: p5.createVector(window.innerWidth, window.innerHeight),
            maxSpeed: options.maxSpeed,
            maxForce: options.maxForce,
            showHelpers: options.showHelpers
        });
        const aiBot = new AutonomousAgent(p5, {
            pos: p5.createVector(200, 300),
            maxSpeed: 4,
            maxForce: 0.3,
            material: p5.color('#0000ff'),
            showHelpers: options.showHelpers
        });
        agents = [player, aiBot];
        target = target || p5.createVector(window.innerWidth / 2, window.innerHeight / 2);
    }

    function pursuit() {
        const player = agents[0];
        const aiBot = agents[1];

        const seek = aiBot.seek(target);
        aiBot.applyForces(seek);
        const attack = player.pursue(aiBot);
        player.applyForces(attack);

        for (let i = 0; i < agents.length; i++) {
            agents[i].update();
            agents[i].draw();
        }
    }

    function initEvade(p5: P5) {
        const player = new AutonomousAgent(p5, {
            pos: p5.createVector(300, 300),
            maxSpeed: options.maxSpeed,
            maxForce: options.maxForce,
            showHelpers: options.showHelpers
        });
        const runner = new AutonomousAgent(p5, {
            pos: p5.createVector(400, 300),
            maxSpeed: 2,
            maxForce: 0.1,
            material: p5.color('#0000ff'),
            showHelpers: options.showHelpers
        });
        agents = [player, runner];
        target = target || p5.createVector(window.innerWidth / 2, window.innerHeight / 2);
    }

    function evade() {
        const player = agents[0];
        const runner = agents[1];

        const seek = player.seek(target);
        player.applyForces(seek);
        const force = runner.evade(player);
        runner.applyForces(force);

        for (let i = 0; i < agents.length; i++) {
            agents[i].update();
            agents[i].draw();
        }
    }

    function initArrive(p5: P5) {
        const player = new AutonomousAgent(p5, {
            pos: p5.createVector(300, 300),
            maxSpeed: options.maxSpeed,
            maxForce: options.maxForce,
            showHelpers: options.showHelpers
        });
        agents = [player];
        target = target || p5.createVector(window.innerWidth / 2, window.innerHeight / 2);
    }

    function arrive() {
        const player = agents[0];

        const arrive = player.arrive(target);
        player.applyForces(arrive);

        for (let i = 0; i < agents.length; i++) {
            agents[i].update();
            agents[i].draw();
        }
    }

    function initWander(p5: P5) {
        const player = new AutonomousAgent(p5, {
            pos: p5.createVector(window.innerWidth / 2, window.innerHeight / 2),
            maxSpeed: options.maxSpeed,
            maxForce: options.maxForce,
            showHelpers: options.showHelpers
        });
        agents = [player];
        target = null;
    }

    function wander() {
        const player = agents[0];

        const wander = player.wander();
        player.applyForces(wander);

        for (let i = 0; i < agents.length; i++) {
            agents[i].update();
            agents[i].draw();
        }
    }

    function drawTarget(target: P5.Vector | null) {
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
