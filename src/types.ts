import { shapes } from "./consts";

export enum SquareWidth {
    "L" = 50,
    "M" = 30,
    "S" = 20
}

export type PieceDefinition = typeof shapes[number];

export type Coordinates = { x: number, y: number };

export type Square = {
    position: Coordinates
}

export type Piece = {
    squares: Coordinates[],
    color: string,
    definition: PieceDefinition
}

export type PositionlessPiece = Omit<Piece, "squares">;

export type DirectionOnAxis = -1 | 1 | 0;

export type Size = {
    width: number,
    height: number
};
