import { Size, SquareWidth } from "./types";

export const J = ['XXX', 'X '];
export const L = ['XXX', '  X'];
export const square = ['XX', 'XX'];
export const line = ['XXXX'];
export const S = [' XX', 'XX '];
export const Z = ['XX ', ' XX'];
export const W = ['XXX', ' X '];
export const shapes = [L, J, S, Z, W, square, line] as const;

export const baseFallSpeed = 1100;

export const SquareWidths = [
    SquareWidth.L,
    SquareWidth.M,
    SquareWidth.S
]

export const defaultBoardSize: Size = {
    width: 8,
    height: 10,
}

export const nextPieceGridSize: Size = {
    width: 4,
    height: 4,
}