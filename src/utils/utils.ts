import p5 from 'p5';
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
export type TTicTacToeCell = {
    pos: p5.Vector;
    owner: Gamer | undefined;
};
export type TGameStatus = {
    filledCells: number;
    status: Gamer | undefined | 'draw';
    cells: TTicTacToeCell[];
};
