import { line, shapes } from "./consts";
import { Coordinates, PositionlessPiece, Piece, PieceDefinition } from "./types";


export const isSamePosition = (position1: Coordinates, position2: Coordinates) => {
    return position1.x === position2.x &&
        position1.y === position2.y
}

export const generatePositionlessPiece = (): PositionlessPiece => {
    const color = `rgb(${Math.random() *255},${Math.random() *255},${Math.random() *255})`
    const definition = shapes[Math.floor(Math.random() * shapes.length)];
    return { color, definition }
}

export const getPieceInitialPosition = (definition: PieceDefinition, boardWidth: number, xOffset: number = 0): Coordinates[] => {
    return definition.reduce<Coordinates[]>((rowAccumulator, row, rowIndex) =>
        [...rowAccumulator, ...row.split("").reduce<Coordinates[]>((columnAccumulator, column, columnIndex) =>
            column === " " ?
                columnAccumulator
                :
                [
                    ...columnAccumulator,
                    {
                        x: rowIndex + 1 + xOffset,
                        y:
                            //Math.floor(boardWidth/2) + columnIndex
                            Math.floor((boardWidth - definition[0].length) / 2 + columnIndex + 1)
                    }
                ], [])
        ], [])
}

export const generateRandomPiece = (boardWidth: number): Piece => {
    const newPiece = generatePositionlessPiece();
    const squares: Coordinates[] = getPieceInitialPosition(newPiece.definition, boardWidth)

    return { ...newPiece, squares }
}

export const getCenter = (piece: Coordinates[]): Coordinates => {
    const minX = Math.min(...piece.map(position => position.x))
    const maxX = Math.max(...piece.map(position => position.x))
    const minY = Math.min(...piece.map(position => position.y))
    const maxY = Math.max(...piece.map(position => position.y))

    return {
        x: minX + (maxX - minX) / 2,
        y: minY + (maxY - minY) / 2
    }
}
