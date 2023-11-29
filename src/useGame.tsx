import { KeyboardEventHandler, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { baseFallSpeed } from "./consts";
import { Size, Piece, PositionlessPiece, Coordinates } from "./types";
import { generatePositionlessPiece, generateRandomPiece, getCenter, isSamePosition, getPieceInitialPosition } from "./utils";

type PieceMove = "rotate" | "move-left" | "move-right" | "move-down";

type UseGameProps = {
    boardSize: Size
}

export const useGame = (props: UseGameProps): {
    gameOver: boolean,
    piece: Piece,
    nextPiece: PositionlessPiece,
    pile: Piece[],
    score: number,
    level: number,
    lines: number,
    keyboardEventHandler: KeyboardEventHandler
    startGame: () => void
} => {
    const { boardSize } = props;

    const [nextPiece, setNextPiece] = useState<PositionlessPiece>(generatePositionlessPiece());
    const [piece, setPiece] = useState<Piece>(generateRandomPiece(boardSize.width));
    const [pile, setPile] = useState<Piece[]>([]);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [lines, setLines] = useState<number>(0)
    const [score, setScore] = useState(0)
    const pieceRef = useRef<Piece>(piece);
    const nextPieceRef = useRef<PositionlessPiece>(nextPiece);
    const intervalRef = useRef<NodeJS.Timer>();
    const pileRef = useRef<Piece[]>([]);
    const level = useMemo(() => Math.floor(lines / 10) + 1, [lines])

    const getPieceRotatedPosition = useCallback((): Coordinates[] => {
        const center = getCenter(pieceRef.current.squares);
        return pieceRef.current.squares.map(position => {
            const distanceFromCenter: Coordinates = {
                x: position.x - center.x,
                y: position.y - center.y
            }
            return ({
                x: Math.ceil(center.x + distanceFromCenter.y),
                y: Math.ceil(center.y - distanceFromCenter.x)
            })
        });
    }, [])

    const getAllObstacles = useCallback((): Coordinates[] => {
        const floor: Coordinates[] = Array.from(
            { length: boardSize.width },
            (_, i,) => (
                {
                    x: boardSize.height + 1,
                    y: i + 1
                }
            ))

        const ceiling: Coordinates[] = Array.from(
            { length: boardSize.width },
            (_, i,) => (
                {
                    x: 0,
                    y: i + 1
                }
            ))

        const rightWall: Coordinates[] = Array.from(
            { length: boardSize.height },
            (_, i,) => (
                {
                    x: i + 1,
                    y: boardSize.width + 1
                }
            ))

        const leftWall: Coordinates[] = Array.from(
            { length: boardSize.height },
            (_, i,) => (
                {
                    x: i + 1,
                    y: 0
                }
            ))

        const obstacles: Coordinates[] = [
            ...floor,
            ...ceiling,
            ...leftWall,
            ...rightWall,
            ...pileRef.current.flatMap(piece => piece.squares)
        ]
        return obstacles;
    }, [boardSize.height, boardSize.width])

    const isCollision = useCallback((position: Coordinates[]) => {
        const obastacles = getAllObstacles()
        const collision = position.some(position =>
            obastacles.some(occupiedPosition => isSamePosition(position, occupiedPosition))
        )
        return collision;
    }, [getAllObstacles])

    const isGameOver = useCallback(() =>
        isCollision(getPieceInitialPosition(nextPiece.definition, boardSize.width)),
        [boardSize.width, isCollision, nextPiece.definition]
    )

    const getCompleteLines = useCallback((): number[] => {
        const squaresByLine = [...pileRef.current.flatMap(p => p.squares), ...pieceRef.current.squares]
            .reduce<Coordinates[][]>((acc, cur, i) => {
                acc[cur.x - 1].push(cur);
                return acc;
            }, Array.from({ length: boardSize.height }, () => []))
        return squaresByLine.filter(squareLine => squareLine.length === boardSize.width).map(line => line[0].x)
    }, [boardSize])

    const popLines = useCallback((linesIndexes: number[]) => {
        setLines(prev => prev + linesIndexes.length)
        setScore(prev => prev + Math.pow(linesIndexes.length, level))
        setPile(prev => prev.map((piece) => ({
            ...piece,
            squares: piece.squares.filter(square => !linesIndexes.some((line: number) => square.x === line))
        })).filter(piece => piece.squares.length)
            .map((piece) => ({
                ...piece,
                squares: piece.squares.map((square) => ({
                    ...square,
                    x: linesIndexes.some((xPosition: number) =>
                        xPosition > square.x) ?
                        square.x + linesIndexes.filter((x: number) => x > square.x).length
                        : square.x
                }))
            }))
        )
    }, [level])

    const endGame = useCallback(() => {
        setGameOver(true)
        clearInterval(intervalRef.current)
        intervalRef.current = undefined
    }, [])

    const dumpPiece = useCallback(() => {
        setPile(prev => [...prev, pieceRef.current]);
        setPiece({
            ...nextPieceRef.current,
            squares: getPieceInitialPosition(nextPieceRef.current.definition, boardSize.width)
        })
        setNextPiece(generatePositionlessPiece())
    }, [boardSize.width])

    const dropPiece = useCallback(() => {
        const positionUnderPiece = pieceRef.current.squares.map(position => ({
            x: position.x + 1,
            y: position.y
        }))

        if (isCollision(positionUnderPiece)) {
            dumpPiece()

            const completeLines = getCompleteLines();
            if (completeLines.length) {
                popLines(completeLines)
            }
        }
        else {
            setPiece(prev => ({ ...prev, squares: positionUnderPiece }))
        }

    }, [dumpPiece, getCompleteLines, isCollision, popLines])

    const handlePieceMove = useCallback((move: PieceMove) => {
        let newPositions: Coordinates[] = [];

        switch (move) {
            case "move-left":
                newPositions = pieceRef.current.squares.map(position => ({
                    x: position.x,
                    y: position.y - 1
                }))
                break;
            case "move-right":
                newPositions = pieceRef.current.squares.map(position => ({
                    x: position.x,
                    y: position.y + 1
                }))
                break;
            case "move-down":
                newPositions = pieceRef.current.squares.map(position => ({
                    x: position.x + 1,
                    y: position.y
                }))
                break;
            case "rotate":
                newPositions = getPieceRotatedPosition();
                break;
            default:
                throw new Error("Unsupported action")
        }
        if (!isCollision(newPositions)) {
            setPiece(prev => ({ ...prev, squares: newPositions }))
        }

    }, [isCollision, getPieceRotatedPosition])

    const keyboardEventHandler: KeyboardEventHandler<HTMLDivElement> = useCallback((event) => {
        switch (event.code) {
            case "ArrowLeft": {
                handlePieceMove("move-left");
                break;
            }
            case "ArrowRight": {
                handlePieceMove("move-right");
                break;
            }
            case "ArrowDown": {
                handlePieceMove("move-down");
                break;
            }
            case "Space": {
                handlePieceMove("rotate");
                break;
            }
        }
    }, [handlePieceMove])

    const setFallInterval = useCallback((interval: number) => {
        clearInterval(intervalRef.current)
        intervalRef.current = setInterval(() => {
            dropPiece();
        }, interval)
        // }
    }, [dropPiece])

    const startGame = useCallback(() => {
        setGameOver(false)
        setPile([]);
        setScore(0)
        setLines(0)
        setFallInterval(baseFallSpeed);
    }, [setFallInterval])

    useEffect(() => {
        pileRef.current = pile;
    }, [pile])

    useEffect(() => {
        pieceRef.current = piece;
    }, [piece])

    useEffect(() => {
        nextPieceRef.current = nextPiece;
    }, [nextPiece])

    useEffect(() => {
        setPiece(prev => ({ ...prev, squares: getPieceInitialPosition(prev.definition, boardSize.width) }))
    }, [boardSize.width])

    useEffect(() => {
        if (isGameOver()) {
            endGame();
        }
    }, [endGame, isGameOver, pile])

    useEffect(() => {
        if (level > 1 && !gameOver) {
            const speedMulitplier = 1 - level / 50
            setFallInterval(baseFallSpeed * speedMulitplier)
        }
    }, [gameOver, level, setFallInterval])

    return {
        keyboardEventHandler,
        startGame,
        piece,
        nextPiece,
        pile,
        gameOver,
        score,
        level,
        lines
    }
}