import { Body, Composite } from 'matter-js';
import P5 from 'p5';

export enum TEntityType {
    ENTITY,
    PARTICLES
}

export type TEntity = {
    pos?: P5.Vector;
    r?: number;
};

export type TPhysicsEntityConfig = {
    type: string;
    body?: Body;
    parent: Composite;
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
    cachedVelocity: P5.Vector;
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

export type TSketch = {
    p5: P5;
    update: (deltatime: number) => void;
    draw: () => void;
};

export type TTile = {
    x: number;
    y: number;
    gird: TTileGrid;
} & TSketch;

export type TTileConfig = {
    x: number;
    y: number;
    grid: TTileGrid;
};

export type TTileGrid = {
    size: number;
    width: number;
    tiles: TTile[];
    createTiles: () => void;
} & TSketch;

export type TTileGridConfig = {
    size: number;
    width: number;
};
