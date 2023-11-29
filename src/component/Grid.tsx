import { CSSProperties, useMemo } from "react";
import { Size, SquareWidth } from "../types";

import "./style.css";

type GridProps = {
  boardSize: Size,
  squareWidth: SquareWidth,
  children: JSX.Element | JSX.Element[] | string | undefined
}

export const Grid = (props: GridProps) => {
  const { children, boardSize, squareWidth } = props;

  const stageGridStyle = useMemo((): CSSProperties => ({
    gridTemplateColumns: Array.from({ length: boardSize.width }, () => `${squareWidth}px `).join(""),
    gridTemplateRows: Array.from({ length: boardSize.height }, () => `${squareWidth}px `).join("")
  }), [boardSize.height, boardSize.width, squareWidth]);

  return (
    <div
      className="stage"
      style={{
        ...stageGridStyle,
        maxHeight: boardSize.height * squareWidth,
        maxWidth: boardSize.width * squareWidth,
      }} >
      {children}
    </div>
  );
}