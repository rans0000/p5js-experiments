import P5 from 'p5';
import { TAutonomousAgentConfig } from '../utils/types';

type Keys = 'maxSpeed' | 'maxForce';
class AutonomousAgent {
    p5: P5;
    pos: P5.Vector;
    mass: number;
    velocity: P5.Vector;
    acceleration: P5.Vector;
    maxSpeed: number;
    maxForce: number;
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
        this.breakingThreshold = config.breakingThreshold;
        this.r = config.r;
        this.material = config.material;
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
    }

    update() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.pos.add(this.velocity);
        this.acceleration.set(0, 0);
    }

    applyForces(force: P5.Vector | null) {
        if (!force) return;
        this.acceleration.add(force);
    }

    drawSprite() {
        const size = this.r;
        this.p5.stroke(this.material);
        this.p5.noFill();
        this.p5.triangle(size, 0, -size, size / 2, -size, -size / 2);
    }

    drawHelpers() {
        this.p5.stroke(0, 80, 50);
        const temp = this.velocity.copy();
        temp.setMag(temp.mag() * 20);
        this.p5.line(0, 0, temp.x, temp.y);
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
}

export default AutonomousAgent;
