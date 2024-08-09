import P5, { Color } from 'p5';

export enum TEntityType {
    ENTITY,
    PARTICLES
}

export type TEntity = {
    pos?: P5.Vector;
    r?: number;
};

export type TParticle = TEntity & {
    mass?: number;
    velocity?: P5.Vector;
    accelaration?: P5.Vector;
    mu?: number; //coefficient of fricton
    c?: number; //coefficient of drag
};

export type TEdges = {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
};

export type TApplicableForces = {
    gravity: boolean;
    wind: boolean;
    friction: boolean;
    drag: boolean;
};

export type TAutonomousAgentConfig = {
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
    perceptionRadius: number;
    repelRadius: number;
    wrapOnScreenEdge: boolean;
    showHelpers: boolean;
};

export type TGroupBehaviour = {
    alignment: P5.Vector;
    cohesion: P5.Vector;
    separation: P5.Vector;
};

export type TInteractivePathConfig = {
    radius: number;
    color: number;
    isClosed: boolean;
};

export type TPoints = P5.Vector[];
