import { Coordinates, SquareWidth } from "../types";

import "./style.css";

export type SquareProps = {
    position: Coordinates,
    color: string;
    width: SquareWidth
};

export const Square = (props: SquareProps): JSX.Element => {
    const { position, color, width } = props;

    return <div
        style={{
            backgroundColor: color,
            gridRow: `${position.x} / ${position.x + 1}`,
            gridColumn: `${position.y} / ${position.y + 1}`,
            width,
            height: width
        }}
        className="square"
    />
}
