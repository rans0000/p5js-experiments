import P5 from 'p5';

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
    forces?: P5.Vector[];
};

export type TEdges = {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
};
