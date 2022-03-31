import { Game } from "../../entities/game/Game";
import { Move, RegularMove } from "../../entities/move/Move";
import { getNumericAxis } from "../../entities/square/getters";
import { Square, _1, _2, _4, _5, _7, _8 } from "../../entities/square/Square";
import {toLeft, toLower, toRight, toUpper} from '../../entities/square/transitions';
import { map as mapRight, getOrElse as getEitherOrElse} from 'fp-ts/Either';
import { createRegularMove } from "../../entities/move/constructors";
import { PieceColor } from "../../entities/piece/Piece";
import { getCurrentBoard } from "../../entities/game/getters";
import { getPieceColorAt, isSquareOccupied } from "../../entities/board/getters";
import { flow, pipe } from "fp-ts/function";
import { Apply, chain as chainOption, map as mapOption, filter as filterOption, getOrElse} from "fp-ts/lib/Option";
import { Board } from "../../entities/board/Board";
import { flatten, map } from "fp-ts/lib/Array";
import { append, filter } from "ramda";
import { getOrFalse, getOrUndefined } from "../../../lib/option";
import { sequenceT } from "fp-ts/lib/Apply";
import { getMoveFrom, getMoveTo } from "../../entities/move/getters";
import { mapIntoPromotions } from '../../entities/move/transition';

const combineOption = sequenceT(Apply);

const getForwardSquare = (amount:number) => (pieceColor: PieceColor) =>
    pieceColor === PieceColor.Black ? toLower(amount) : toUpper(amount);


const getSingleForwardSquare = getForwardSquare(1);
const getDoubleForwardSquare = getForwardSquare(2);

const isAtHome = (square: Square) => (pieceColor: PieceColor): boolean =>
    (pieceColor === PieceColor.Black && getNumericAxis(square) === _7) ||
    (pieceColor === PieceColor.White && getNumericAxis(square) === _2)

const getForwardSingleSquareFromBoard = (square: Square) => (board:Board) =>
    pipe(
        getPieceColorAt(board, square),
        mapOption(getSingleForwardSquare),
        chainOption(_getForwardSquare => _getForwardSquare(square)),
        filterOption(sq => !isSquareOccupied(board, sq))
    );

const getBothForwardSquares = (square: Square) => (pieceColor:PieceColor) => combineOption(
    getDoubleForwardSquare(pieceColor)(square),
    getSingleForwardSquare(pieceColor)(square)
);

const getForwardDoubleSquareFromBoard = (square: Square) => (board:Board) =>
    pipe(
        getPieceColorAt(board, square),
        filterOption(isAtHome(square)),
        chainOption(getBothForwardSquares(square)),
        filterOption(
            ([doubleSq, singleSq]) => !isSquareOccupied(board, doubleSq) && !isSquareOccupied(board, singleSq)
        ),
        mapOption(([doubleSq]) => doubleSq)
    );

const getWhiteFirstTakeDestination = flow(
    toLeft(1),
    chainOption(toUpper(1))
);

const getWhiteSecondTakeDestination = flow(
    toRight(1),
    chainOption(toUpper(1))
);

const getBlackFirstTakeDestination = flow(
    toLeft(1),
    chainOption(toLower(1))
);

const getBlackSecondTakeDestination = flow(
    toRight(1),
    chainOption(toLower(1))
);

const getTakingMoves = (square: Square) => (board: Board):RegularMove[] => {
    return pipe(
        getPieceColorAt(board, square),
        mapOption(pieceColor => 
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
        ),
        getOrElse(() => [] as RegularMove[])
    );
}


const wrapOrNoMoves = (square:Square) => flow(
    mapOption((destination:Square) => [createRegularMove(square, destination)]),
    getOrElse(() => [] as RegularMove[])
);

const promote = (board:Board) => (move:RegularMove):Move[] => pipe(
    getPieceColorAt(board, getMoveFrom(move)),
    mapOption(pieceColor => pieceColor === PieceColor.Black ? _1 : _8),
    mapOption(lastRow => pipe(
        getMoveTo(move),
        getNumericAxis,
        row => row === lastRow
    )),
    mapOption((isLastRow:boolean):Move[] => isLastRow ? mapIntoPromotions(move) as Move[] : [move]),
    getOrElse(() => [] as Move[])
)

const combineMoves = (square:Square) => (board: Board):Move[] => pipe(
    [
        getForwardSingleSquareFromBoard(square)(board),
        getForwardDoubleSquareFromBoard(square)(board)
    ],
    map(wrapOrNoMoves(square)),
    append(getTakingMoves(square)(board)),
    flatten,
    map(promote(board)),
    flatten,
)

export const getLegalMoves = (game: Game, square:Square): Move[] => {
    return pipe(
        getCurrentBoard(game),
        // @ts-expect-error
        mapRight(combineMoves(square)),
        getEitherOrElse(() => [])
    );
}
