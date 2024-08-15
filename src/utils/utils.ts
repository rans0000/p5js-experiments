import { TEdges } from './types';

export const defaultEntityConfig = { r: 5 };
export const defaultEdgeConfig: TEdges = {
    top: true,
    right: true,
    bottom: true,
    left: true
};
export enum MOUSE_BTN {
    LEFT,
    MIDDLE,
    RIGHT
}
export enum Gamer {
    PLAYER,
    AI
}
export type TGameStatus = {
    filledCells: number;
    status: Gamer | undefined | 'draw';
};
