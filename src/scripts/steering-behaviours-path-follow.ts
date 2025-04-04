import { GUI } from 'dat.gui';
import P5 from 'p5';
import AutonomousAgent from 'src/libs/autonomous-agent';
import { TPoints } from 'src/utils/types';
import InteractivePath from '../libs/interactive-path';

/**--------------------------------- */
// variables & types
let path: InteractivePath;
let agents: AutonomousAgent[] = [];

/**--------------------------------- */
// sketch
const sketch = (p5: P5) => {
    const options = {
        showHelpers: false,
        maxSpeed: 3,
        maxForce: 0.3
    };

    const gui = new GUI({ autoPlace: false });
    gui.domElement.id = 'gui';
    document.getElementById('gui')?.appendChild(gui.domElement);

    gui.add(options, 'showHelpers').onChange((val) =>
        agents.forEach((agent) => {
            agent.setValues('showHelpers', val);
        })
    );
    gui.add(options, 'maxSpeed', 0.1, 10, 0.1).onChange((val) =>
        agents.forEach((agent) => {
            agent.setValues('maxSpeed', val);
        })
    );
    gui.add(options, 'maxForce', 0.01, 2, 0.01).onChange((val) =>
        agents.forEach((agent) => {
            agent.setValues('maxForce', val);
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

        path.update(p5.deltaTime).draw();
        pathFollow(path, agents);
    };

    /**--------------------------------- */
    // functions

    function resizeDisplay(canvas: P5) {
        canvas.resizeCanvas(window.innerWidth, window.innerHeight);
    }

    function init(p5: P5) {
        p5.background(200, 60, 10);

        // setup path
        path = new InteractivePath(p5, { isClosed: true, color: 20, radius: 20 });
        const points: TPoints[] = [
            [
                p5.createVector(150, 300),
                p5.createVector(250, 150),
                p5.createVector(550, 250),
                p5.createVector(730, 150),
                p5.createVector(800, 500),
                p5.createVector(400, 600)
            ]
        ];
        path.setPoints(points);

        //setup agent
        agents.push(
            new AutonomousAgent(p5, {
                pos: p5.createVector(p5.random(window.innerWidth), p5.random(window.innerHeight)),
                velocity: P5.Vector.random2D().setMag(options.maxSpeed),
                maxSpeed: options.maxSpeed,
                maxForce: options.maxForce,
                wrapOnScreenEdge: true
            })
        );
    }

    function pathFollow(path: InteractivePath, agents: AutonomousAgent[]) {
        for (let i = 0; i < agents.length; i++) {
            const force = agents[i].pathFollow(path, true);
            agents[i].applyForces(force).update().draw();
        }

        for (const agent of agents) {
            agent.move();
        }
    }

    /**--------------------------------- */
    // classes
};

new P5(sketch);
