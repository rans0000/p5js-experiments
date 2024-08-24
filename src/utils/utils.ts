import P5 from 'p5';
import { TEdges } from './types';
import CrossBoard from 'src/libs/cross-board-2';

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
    pos: P5.Vector;
    owner: Gamer | undefined;
};
export type TGameStatus = {
    filledCells: number;
    winner: Gamer | undefined;
    cells: TTicTacToeCell[];
};
