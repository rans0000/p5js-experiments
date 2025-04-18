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
    update: (deltatime?: number) => TSketch;
    draw: () => TSketch;
};

export type TTileGetter = {
    (prop: 'VISITED'): boolean;
    (prop: 'CURRENT'): boolean;
    (prop: 'WALLS'): [boolean, boolean, boolean, boolean];
};

export type TTile = {
    id: number;
    getter: TTileGetter;
    setter: (action: TTileSetter) => void;
    getPosition: () => { _x: number; _y: number };
    setWallStaus: (ndex: number, state: boolean) => void;
} & TSketch;

export type TTileConfig = {
    p5: P5;
    x: number;
    y: number;
    id: number;
    grid: TMaze;
};

export type TMazeSolvers = 'DFS_Recursive' | 'Kruskal';
export type TTileSetter = { type: 'VISITED'; payload: boolean } | { type: 'CURRENT'; payload: boolean };

export type TMaze = {
    getWidth: () => number;
    getSize: () => number;
    getTiles: () => TTile[];
    setStrategy: (solver: TMazeSolvers) => void;
    getIndex: (i: number, j: number) => number;
    getNeighbours: (tile: TTile) => TTile[];
    removeWalls: (current: TTile, next: TTile) => void;
} & TSketch;

export type TMazeConfig = {
    p5: P5;
    size: number;
    width: number;
    solver: TMazeSolvers;
};

export type TMazeStrategy = {
    solve: () => boolean;
};

export type TMazeStrategyConstructor = new (grid: TMaze) => TMazeStrategy;

export type TREdge<K, T> = {
    id: string;
    directed: boolean;
    start: TRVertex<T, K>;
    end: TRVertex<T, K>;
    data?: K;
};

export type TRVertex<T, K> = {
    id: string;
    edges: TREdge<K, T>[];
    data?: T;
    setEdge(end: TRVertex<T, K>, directed: boolean, data?: K): void;
};

export type TRGraph<T, K> = {
    id: string;
    isGrid: boolean;
    vertices: TRVertex<T, K>[];
    addVertex(vertex: TRVertex<T, K> | TRVertex<T, K>[]): void;
    buildGrid(
        rows: number,
        columns: number,
        vDataCallback: (x: number, y: number) => T,
        eDataCallback: (start: TRVertex<T, K>, end: TRVertex<T, K>) => K
    ): void;
};

export type TVertexData = {
    num: number;
    pos: [number, number];
    x: number;
    y: number;
    isWall: boolean;
};
export type TEdgeData = {
    start: [number, number];
    end: [number, number];
};
