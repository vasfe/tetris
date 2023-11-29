import { useEffect, useState } from "react";
import { useGame } from "../useGame";
import { Shape } from "./Piece";
import { Grid } from "./Grid";
import { defaultBoardSize, SquareWidths, nextPieceGridSize } from "../consts";
import { getPieceInitialPosition } from "../utils";
import { Size, SquareWidth } from "../types";

import "./style.css";

export const Game = () => {
  const [started, setStarted] = useState<boolean>(false);
  const [boardSize, setBoardSize] = useState<Size>(defaultBoardSize);
  const [squareWidth, setSquareWidth] = useState<SquareWidth>(SquareWidth.M);

  const {
    piece,
    nextPiece,
    pile,
    gameOver,
    lines,
    score,
    level,
    keyboardEventHandler,
    startGame
  } = useGame({ boardSize });

  const handleStartGame = () => {
    startGame()
    setStarted(true)
  }

  useEffect(() => {
    if (gameOver) {
      setStarted(false)
    }
  }, [gameOver])

  return (
    <div className="container">
      <div className="options">
        <div className="inputContainer">
          <label>Height</label>
          <select
            disabled={started}
            name="squareWidth"
            defaultValue={SquareWidth.M}
            onChange={(e) => setSquareWidth(parseInt(e.target.value))}
          >
            {SquareWidths.map((width) =>
              <option value={width} key={width}>{
                Object.keys(SquareWidth).find((key: any) => parseInt(SquareWidth[key]) === width)
              }</option>
            )}
          </select>
        </div>
        <div className="inputContainer">
          <label>Width</label>
          <input
            disabled={started}
            value={boardSize.width}
            type="number"
            min={4}
            max={200}
            onChange={e =>
              setBoardSize(prev => ({
                ...prev,
                width: parseInt(e.target.value),
              }))}
          />
        </div>
        <div className="inputContainer">
          <label>Height</label>
          <input
            disabled={started}
            value={boardSize.height}
            type="number"
            min={8}
            max={500}
            onChange={e =>
              setBoardSize(prev => ({
                ...prev,
                height: parseInt(e.target.value),
              }))}
          />
        </div>
        <button
          onClick={() => handleStartGame()}
          disabled={started}
        >Start game</button>
      </div>
      <div
        className="game"
        onKeyDown={started ? keyboardEventHandler : () => { }}
        tabIndex={0}
      >
        <Grid squareWidth={squareWidth} boardSize={boardSize}>
          <>
            {pile.map((pilePiece, i) =>
              <Shape
                piece={pilePiece}
                key={i}
                squareWidth={squareWidth}
              />
            )}
          </>
          {gameOver ?
            <div className="gameOverContainer">
              Game Over
            </div>
            : <Shape
              piece={piece}
              squareWidth={squareWidth}
            />}
        </Grid>
        <div className="gamePanel">
          <div className="panelIntem">
            <div className="panelIntemLabel">
              Score
            </div>
            {score}
          </div>
          <div className="panelIntem">
            <div className="panelIntemLabel">
              Level
            </div>
            {level}
          </div>
          <div className="panelIntem">
            <div className="panelIntemLabel">
              Lines
            </div>
            {lines}
          </div>
          <Grid
            boardSize={nextPieceGridSize}
            squareWidth={squareWidth}>
            <Shape
              piece={{
                ...nextPiece,
                squares: getPieceInitialPosition(nextPiece.definition, nextPieceGridSize.width, 1)
              }}
              squareWidth={squareWidth}
            />
          </Grid>
        </div>
      </div>
    </div>
  );
}