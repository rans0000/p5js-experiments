import P5 from 'p5';
import { TAutonomousAgentConfig, TGroupBehaviour } from '../utils/types';
import InteractivePath from './interactive-path';

type Keys = 'maxSpeed' | 'maxForce' | 'perceptionRadius' | 'repelRadius' | 'showHelpers' | 'visibilityAngle';
let id = -1;
class AutonomousAgent {
    id: number;
    p5: P5;
    pos: P5.Vector;
    mass: number;
    cachedVelocity: P5.Vector;
    velocity: P5.Vector;
    acceleration: P5.Vector;
    maxSpeed: number;
    maxForce: number;
    wanderTheta: number;
    breakingThreshold: number;
    r: number;
    material: P5.Color;
    perceptionRadius: number;
    repelRadius: number;
    visibilityAngle: number;
    wrapOnScreenEdge: boolean;
    showHelpers: boolean;

    constructor(p5: P5, _config?: Partial<TAutonomousAgentConfig>) {
        const defaultConfig: TAutonomousAgentConfig = {
            pos: p5.createVector(0, 0),
            mass: 1,
            velocity: p5.createVector(0, 0),
            cachedVelocity: p5.createVector(0, 0),
            acceleration: p5.createVector(0, 0),
            maxSpeed: 15,
            maxForce: 0.25,
            wanderTheta: 0,
            breakingThreshold: 100,
            r: 20,
            material: p5.color('#00ffff'),
            perceptionRadius: 30,
            repelRadius: 20,
            visibilityAngle: Math.PI / 3,
            wrapOnScreenEdge: false,
            showHelpers: false
        };
        const config = { ...defaultConfig, ..._config };

        this.id = ++id;
        this.p5 = p5;
        this.pos = config.pos;
        this.mass = config.mass;
        this.velocity = config.velocity;
        this.acceleration = config.acceleration;
        this.maxSpeed = config.maxSpeed;
        this.maxForce = config.maxForce;
        this.wanderTheta = config.wanderTheta;
        this.breakingThreshold = config.breakingThreshold;
        this.r = config.r;
        this.material = config.material;
        this.perceptionRadius = config.perceptionRadius;
        this.repelRadius = config.repelRadius;
        this.visibilityAngle = config.visibilityAngle;
        this.wrapOnScreenEdge = config.wrapOnScreenEdge;
        this.showHelpers = config.showHelpers;

        this.wanderTheta = 0;
    }

    setValues(key: Keys, value: number | boolean) {
        if (typeof value === 'number') {
            switch (key) {
                case 'maxSpeed':
                    this.maxSpeed = value;
                    break;
                case 'maxForce':
                    this.maxForce = value;
                    break;
                case 'perceptionRadius':
                    this.perceptionRadius = value;
                    break;
                case 'repelRadius':
                    this.repelRadius = value;
                    break;
                case 'visibilityAngle':
                    this.visibilityAngle = value;
                    break;

                default:
                    throw 'Unsupported key passed to setValues()';
            }
        }
        if (typeof value === 'boolean') {
            switch (key) {
                case 'showHelpers':
                    this.showHelpers = value;
                    break;
                default:
                    throw 'Unsupported key passed to setValues()';
            }
        }
    }

    draw() {
        this.p5.push();
        this.p5.translate(this.pos.x, this.pos.y);
        this.p5.rotate(this.velocity.heading());
        this.showHelpers && this.drawHelpers();
        this.drawSprite();
        this.p5.pop();
        return this;
    }

    update() {
        this.cachedVelocity = this.velocity.copy().add(this.acceleration.limit(this.maxForce));
        this.cachedVelocity.limit(this.maxSpeed);
        return this;
    }

    move() {
        this.velocity.set(this.cachedVelocity.x, this.cachedVelocity.y);
        this.pos.add(this.velocity);
        this.wrapOnScreenEdge && this.constraintWithinWindow(this.pos.x, this.pos.y);
        this.acceleration.set(0, 0);
        return this;
    }

    applyForces(force: P5.Vector | null) {
        if (!force) return this;
        this.acceleration.add(force);
        return this;
    }

    drawSprite() {
        const size = this.r;
        this.p5.stroke(this.material);
        this.p5.strokeWeight(1);
        this.p5.noFill();
        this.p5.triangle(size, 0, -size, size / 2, -size, -size / 2);
        this.p5.stroke(50);
        return this;
    }

    drawHelpers() {
        // draw text
        this.p5.noStroke();
        this.p5.fill(255);
        this.p5.textSize(15);
        this.p5.text(this.id, 0, 0);
        // draw perception radius
        this.p5.noFill();
        this.velocity.mag() < this.maxSpeed ? this.p5.stroke(0, 80, 50) : this.p5.stroke(50);
        this.p5.strokeWeight(1);
        this.p5.circle(0, 0, this.perceptionRadius);
        // visibility radius
        this.p5.fill(255, 255, 255, 0.3);
        this.p5.arc(0, 0, this.perceptionRadius, this.perceptionRadius, -this.visibilityAngle, this.visibilityAngle);
        // draw heading

        const temp = this.p5.createVector(1, 0).setMag(this.velocity.mag()).mult(20);
        this.p5.line(0, 0, temp.x, temp.y);
        return this;
    }

    seek(target: P5.Vector | null, isArriving: boolean = false): P5.Vector {
        if (!target) return this.p5.createVector();
        let force = P5.Vector.sub(target, this.pos);
        let desiredVelocity = this.maxSpeed;

        if (isArriving) {
            const distance = force.mag();
            if (distance < this.breakingThreshold) {
                desiredVelocity = this.p5.map(distance, 0, this.breakingThreshold, 0, this.maxSpeed);
            }
        }

        force.setMag(desiredVelocity);
        force.sub(this.velocity);
        force.limit(this.maxForce);
        return force;
    }

    flee(target: P5.Vector | null) {
        if (target === null) return null;
        return this.seek(target)!.mult(-1);
    }

    pursue(agent: AutonomousAgent) {
        const target = agent.pos.copy();
        let predictedPos = agent.velocity.copy();
        predictedPos.mult(40);
        target.add(predictedPos);
        return this.seek(target);
    }

    evade(agent: AutonomousAgent) {
        let a = this.pursue(agent);
        a!.mult(-1);
        return a;
    }

    arrive(target: P5.Vector | null) {
        return this.seek(target, true);
    }

    wander(): P5.Vector {
        const lookahead = 100;
        const lookaheadRadius = 50;
        const deltaTheta = this.p5.PI / 6;

        const x = lookaheadRadius * this.p5.cos(this.wanderTheta);
        const y = lookaheadRadius * this.p5.sin(this.wanderTheta);
        const targetPos = this.velocity.copy().setMag(lookahead);
        targetPos.add(this.p5.createVector(x, y));
        targetPos.add(this.pos);

        this.constraintWithinWindow(this.pos.x, this.pos.y);

        this.wanderTheta += this.p5.random(-deltaTheta, deltaTheta);
        return this.seek(targetPos);
    }

    pathFollow(path: InteractivePath, isPointWithinSegment = false): P5.Vector {
        const lookahead = 50;
        const target = this.velocity.copy().normalize().mult(lookahead).add(this.pos);
        this.p5.strokeWeight(1);
        this.p5.stroke(255);
        const closest = path.getClosestSegment(target.x, target.y, isPointWithinSegment);
        if (closest.length && closest.length > path.radius && closest.intersectionPosition) {
            return this.seek(closest.intersectionPosition);
        }
        return this.velocity.copy();
    }

    groupBehaviour(agents: AutonomousAgent[]): TGroupBehaviour {
        let alignment = this.p5.createVector();
        let cohesion = this.p5.createVector();
        let separation = this.p5.createVector();
        const numberOfAgents = agents.length;

        for (let i = 0; i < numberOfAgents; i++) {
            if (agents[i] === this) continue;

            const angle = this.velocity.copy().normalize().dot(agents[i].velocity.copy().normalize());
            const distance = P5.Vector.dist(agents[i].pos, this.pos);
            if (distance > this.perceptionRadius || angle > this.visibilityAngle) continue;

            // alignment
            alignment.add(agents[i].velocity);

            // cohesion
            // @todo: scale the force applied to cohesion based on the distance between two bodies
            // distant objects extert less force
            const ratio = (this.perceptionRadius - distance) / this.perceptionRadius;

            distance > this.repelRadius && cohesion.add(agents[i].pos);
            const diff = this.pos
                .copy()
                .sub(agents[i].pos) //
                .div(ratio); //

            // separation
            separation.add(diff);

            this.p5.stroke(20);
            this.p5.strokeWeight(2);
            this.showHelpers && this.p5.line(agents[i].pos.x, agents[i].pos.y, this.pos.x, this.pos.y);

            if (numberOfAgents - 1 > 0) {
                alignment
                    .div(numberOfAgents - 1)
                    .sub(this.velocity)
                    .setMag(this.maxSpeed);
                cohesion
                    .div(numberOfAgents - 1)
                    .sub(this.pos)
                    .setMag(this.maxSpeed);
                separation
                    .div(numberOfAgents - 1)
                    .sub(this.velocity)
                    .setMag(this.maxSpeed);
            }
        }
        return { alignment, cohesion, separation };
    }

    constraintWithinWindow(x: number, y: number) {
        const { innerWidth, innerHeight } = window;
        if (x < 0) this.pos.x = innerWidth;
        if (x > innerWidth) this.pos.x = 0;
        if (y < 0) this.pos.y = innerHeight;
        if (y > innerHeight) this.pos.y = 0;
    }
}

export default AutonomousAgent;
