import { Game } from "../../entities/game/Game";
import { Move } from "../../entities/move/Move";
import { getNumericAxis, toString } from "../../entities/square/getters";
import { Square, _2, _4, _5, _7 } from "../../entities/square/Square";
import {toLeft, toLower, toRight, toUpper} from '../../entities/square/transitions';
import { chain as chainEither, map as mapRight, filterOrElse, fold, fromOption, getOrElse, Either} from 'fp-ts/Either';
import { createRegularMove } from "../../entities/move/constructors";
import { PieceColor } from "../../entities/piece/Piece";
import { getCurrentBoard } from "../../entities/game/getters";
import { getPieceColorAt, isSquareOccupied } from "../../entities/board/getters";
import { flow, pipe } from "fp-ts/function";
import { chain as chainOption, map as mapOption, filter as filterOption, fromEither, Option, some} from "fp-ts/lib/Option";
import { Board } from "../../entities/board/Board";
import { flatten, map } from "fp-ts/lib/Array";
import { append, filter } from "ramda";
import { getOrFalse, getOrUndefined } from "../../../lib/option";

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
    destination => [createRegularMove(square, destination)]
);

const getWhiteFirstTakeDestination = flow(
    toLeft(1),
    chainEither(toUpper(1)),
    fromEither
);

const getWhiteSecondTakeDestination = flow(
    toRight(1),
    chainEither(toUpper(1)),
    fromEither
);

const getBlackFirstTakeDestination = flow(
    toLeft(1),
    chainEither(toLower(1)),
    fromEither
);

const getBlackSecondTakeDestination = flow(
    toRight(1),
    chainEither(toLower(1)),
    fromEither
);

const getTakingMoves = (square: Square) => (board: Board):Either<Error, Move[]> => {
    return pipe(
        getPieceColorAt(board, square),
        fromOption(() => Error(`No piece present at square ${toString(square)}`)),
        mapRight(pieceColor => 
            pipe(
                pieceColor === PieceColor.White
                    ?[
                        getWhiteFirstTakeDestination(square),
                        getWhiteSecondTakeDestination(square)
                    ]
                    : [
                        getBlackFirstTakeDestination(square),
                        getBlackSecondTakeDestination(square)
                    ],
                filter(flow (
                    chainOption((destination:Square) => getPieceColorAt(board, destination)),
                    mapOption(color => color !== pieceColor),
                    getOrFalse,
                )),
                map(flow(
                    getOrUndefined,
                    destination => createRegularMove(square, destination as Square)
                ))
            )
        )
    );
}


const combineMoves = (square:Square) => (board: Board) => pipe(
    [
        getForwardSingleSquareFromBoard(square)(board),
        getForwardDoubleSquareFromBoard(square)(board)
    ],
    map(getOrEmpty(square)),
    append(pipe(
        //@ts-expect-error
        getTakingMoves(square)(board),
        getOrElse(() => [])
    )),
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
