import { Piece, SquareWidth } from "../types";
import { Square } from "./Square";

import "./style.css";

export type ShapeProps = {
    piece: Piece,
    squareWidth: SquareWidth
}

export const Shape = (props: ShapeProps): JSX.Element => {
    const { piece: { squares, color }, squareWidth } = props;
    return <>
        {squares.map((square) =>
            <Square
                key={`${square.x}:${square.y}`}
                position={square}
                color={color}
                width={squareWidth}
            />
        )}
    </>
}
