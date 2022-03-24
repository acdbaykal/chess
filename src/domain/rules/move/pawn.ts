import { Game } from "../../entities/game/Game";
import { Move } from "../../entities/move/Move";
import { getNumericAxis, toString } from "../../entities/square/getters";
import { Square, _2, _7 } from "../../entities/square/Square";
import {toLower, toUpper} from '../../entities/square/transitions';
import { chain as chainEither, map as mapRight, filterOrElse, fold, fromOption, getOrElse, Either } from 'fp-ts/Either';
import { createMove } from "../../entities/move/constructors";
import { PieceColor } from "../../entities/piece/Piece";
import { getCurrentBoard } from "../../entities/game/getters";
import { getPieceColorAt, isSquareOccupied } from "../../entities/board/getters";
import { flow, pipe } from "fp-ts/function";
import { map as mapOption, filter as filterOption} from "fp-ts/lib/Option";
import { Board } from "../../entities/board/Board";
import { flatten, map } from "fp-ts/lib/Array";

const getForwardSquare = (amount:number) => (pieceColor: PieceColor) =>
    pieceColor === PieceColor.Black ? toLower(amount) : toUpper(amount);


const getSingleForwardSquare = getForwardSquare(1);
const getDoubleForwardSqure = getForwardSquare(2);

const isAtHome = (square: Square) => (pieceColor: PieceColor): boolean =>
    (pieceColor === PieceColor.Black && getNumericAxis(square) === _7) ||
    (pieceColor === PieceColor.White && getNumericAxis(square) === _2)

const getForwardSingleSquareFromBoard = (square: Square) => (board:Board) =>
    pipe(
        getPieceColorAt(board, square),
        mapOption(getSingleForwardSquare),
        fromOption(() => Error(`${toString(square)} is not oocupied by a pawn`)),
        chainEither(_getForwardSquare => _getForwardSquare(square)),
        filterOrElse(sq => !isSquareOccupied(board, sq), () => Error('Sqaure is already occupied'))
    );

const getForwardDoubleSquareFromBoard = (square: Square) => (board:Board) =>
    pipe(
        getPieceColorAt(board, square),
        filterOption(isAtHome(square)),
        mapOption(getDoubleForwardSqure),
        fromOption(() => Error(`${toString(square)} is not oocupied by a pawn or is not home row`)),
        chainEither(_getForwardSquare => _getForwardSquare(square)),
        filterOrElse(sq => !isSquareOccupied(board, sq), () => Error('Sqaure is already occupied'))
    );


const getOrEmpty = (square:Square) => fold<Error, Square, Move[]>(
    () => [],
    destination => [createMove(square, destination)]
);

const combineMoves = (square:Square) => flow(
    (board: Board): Either<Error, Square>[] => [
        getForwardSingleSquareFromBoard(square)(board),
        getForwardDoubleSquareFromBoard(square)(board)
    ],
    map(getOrEmpty(square)),
    flatten
)

export const getLegalMoves = (game: Game, square:Square): Move[] => {
    return pipe(
        getCurrentBoard(game),
        // @ts-expect-error
        mapRight(combineMoves(square)),
        getOrElse(() => [])
    );
}
