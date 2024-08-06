import P5 from 'p5';
import { TAutonomousAgentConfig } from '../utils/types';
import InteractivePath from './interactive-path';

type Keys = 'maxSpeed' | 'maxForce';
class AutonomousAgent {
    p5: P5;
    pos: P5.Vector;
    mass: number;
    velocity: P5.Vector;
    acceleration: P5.Vector;
    maxSpeed: number;
    maxForce: number;
    wanderTheta: number;
    breakingThreshold: number;
    r: number;
    material: P5.Color;

    constructor(p5: P5, _config: Partial<TAutonomousAgentConfig>) {
        const defaultConfig: TAutonomousAgentConfig = {
            pos: p5.createVector(0, 0),
            mass: 1,
            velocity: p5.createVector(0, 0),
            acceleration: p5.createVector(0, 0),
            maxSpeed: 15,
            maxForce: 0.25,
            wanderTheta: 0,
            breakingThreshold: 100,
            r: 20,
            material: p5.color('#00ffff')
        };
        const config = { ...defaultConfig, ..._config };
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

        this.wanderTheta = 0;
    }

    setValues(key: Keys, value: number) {
        switch (key) {
            case 'maxSpeed':
                this.maxSpeed = value;
                break;
            case 'maxForce':
                this.maxForce = value;
                break;
            default:
                throw 'Unsupported key passed to setValues()';
        }
    }

    draw(showHelper: boolean = false) {
        this.p5.push();
        this.p5.translate(this.pos.x, this.pos.y);
        if (showHelper) this.drawHelpers();
        this.p5.rotate(this.velocity.heading());
        this.drawSprite();
        this.p5.pop();
        return this;
    }

    update() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.pos.add(this.velocity);
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
        return this;
    }

    drawHelpers() {
        this.p5.stroke(0, 80, 50);
        const temp = this.velocity.copy();
        temp.setMag(temp.mag() * 20);
        this.p5.line(0, 0, temp.x, temp.y);
        return this;
    }

    seek(target: P5.Vector | null, isArriving: boolean = false) {
        if (!target) return null;
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

    wander() {
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

    pathFollow(path: InteractivePath) {
        const lookahead = 50;
        const target = this.velocity.copy().normalize().mult(lookahead).add(this.pos);
        this.p5.strokeWeight(1);
        this.p5.stroke(255);
        this.p5.circle(target.x, target.y, 5);
        const closest = path.getClosestSegment(target.x, target.y);
        if (closest.length && closest.length > path.radius && closest.intersectionPosition) {
            return this.seek(closest.intersectionPosition);
        }
        return this.velocity.copy();
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
