import { GUI } from 'dat.gui';
import P5 from 'p5';
import AutonomousAgent from 'src/libs/autonomous-agent';
import { TGroupBehaviour } from 'src/utils/types';

/**--------------------------------- */
// variables & types
let agents: AutonomousAgent[] = [];

/**--------------------------------- */
// sketch
const sketch = (p5: P5) => {
    const options = {
        showHelpers: false,
        alignmentWeight: 1,
        cohesionWeight: 1,
        separationWeight: 1,
        maxSpeed: 2,
        maxForce: 0.03,
        perceptionRadius: 70,
        visibilityAngle: Math.PI / 3,
        repelRadius: 40
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
    gui.add(options, 'perceptionRadius', 0.01, 200, 1).onChange((val) =>
        agents.forEach((agent) => {
            agent.setValues('perceptionRadius', val);
        })
    );
    gui.add(options, 'visibilityAngle', -Math.PI, Math.PI, 0.01).onChange((val) =>
        agents.forEach((agent) => {
            agent.setValues('visibilityAngle', val);
        })
    );
    gui.add(options, 'repelRadius', 0.01, 200, 1).onChange((val) =>
        agents.forEach((agent) => {
            agent.setValues('repelRadius', val);
        })
    );
    gui.add(options, 'alignmentWeight', 0, 1, 0.1);
    gui.add(options, 'cohesionWeight', 0, 1, 0.1);
    gui.add(options, 'separationWeight', 0, 1, 0.1);

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

        flock(agents);
    };

    /**--------------------------------- */
    // functions

    function resizeDisplay(canvas: P5) {
        canvas.resizeCanvas(window.innerWidth, window.innerHeight);
    }

    function init(p5: P5) {
        p5.background(200, 60, 10);

        //setup agent
        agents = [];
        for (let i = 0; i < 20; i++) {
            agents.push(
                new AutonomousAgent(p5, {
                    showHelpers: options.showHelpers,
                    pos: p5.createVector(p5.random(window.innerWidth), p5.random(window.innerHeight)),
                    velocity: P5.Vector.random2D().setMag(options.maxSpeed),
                    maxSpeed: options.maxSpeed,
                    maxForce: options.maxForce,
                    perceptionRadius: options.perceptionRadius,
                    visibilityAngle: options.visibilityAngle,
                    wrapOnScreenEdge: true
                })
            );
        }
    }

    function flock(agents: AutonomousAgent[]) {
        const forces: TGroupBehaviour[] = [];

        for (let i = 0; i < agents.length; i++) {
            const groupBehaviour = agents[i].groupBehaviour(agents);
            forces.push(groupBehaviour);
        }
        for (let i = 0; i < agents.length; i++) {
            agents[i]
                .applyForces(forces[i].cohesion.mult(options.cohesionWeight)) //
                .applyForces(forces[i].alignment.mult(options.alignmentWeight)) //
                .applyForces(forces[i].separation.mult(options.separationWeight)) //
                .update()
                .draw();
        }

        for (const agent of agents) {
            agent.move();
        }
    }

    /**--------------------------------- */
    // classes
};

new P5(sketch);
