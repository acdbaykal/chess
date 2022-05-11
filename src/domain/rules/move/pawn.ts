import { Game } from "../../entities/game/Game";
import { Move, RegularMove } from "../../entities/move/Move";
import { getRank, squareEquals } from "../../entities/square/getters";
import { NumericCoordinate, Square, _1, _2, _3, _4, _5, _6, _7, _8 } from "../../entities/square/Square";
import {toBottomLeft, toBottomRight, toLeft, toLower, toRight, toUpLeft, toUpper, toUpRight} from '../../entities/square/transitions';
import { map as mapRight, getOrElse as getEitherOrElse} from 'fp-ts/Either';
import { createEnPassant, createRegularMove } from "../../entities/move/constructors";
import { PieceColor, PieceType } from "../../entities/piece/Piece";
import { getCurrentBoard, getMovesHistory } from "../../entities/game/getters";
import { getPieceColorAt, isSquareOccupied, isSquareOccupiedByPiece } from "../../entities/board/getters";
import { flow, pipe } from "fp-ts/function";
import { Apply, chain as chainOption, Do as doOption, map as mapOption, filter as filterOption, getOrElse, Option, isSome, bind} from "fp-ts/lib/Option";
import { Board } from "../../entities/board/Board";
import { filter, flatten, map } from "fp-ts/lib/Array";
import { append } from "ramda";
import { getOrFalse, getOrUndefined } from "../../../lib/option";
import { sequenceT } from "fp-ts/lib/Apply";
import { getMoveFrom, getMoveFromNumericCoord, getMoveTo, getMoveToNumericCoord } from "../../entities/move/getters";
import { mapIntoPromotions } from '../../entities/move/transition';
import { createPiece } from "../../entities/piece/constructors";
import { reversePieceColor } from "../../entities/piece/transition";
import { MoveHistory } from "../../entities/movehistory/MoveHistory";
import { getLastMove } from "../../entities/movehistory/getters";
import { logLeft } from "../../../lib/either";

const combineOption = sequenceT(Apply);

const getForwardSquare = (amount: 1 | 2) => (pieceColor: PieceColor) =>
    pieceColor === PieceColor.Black ? toLower(amount) : toUpper(amount);


const getSingleForwardSquare = getForwardSquare(1);
const getDoubleForwardSquare = getForwardSquare(2);

const isAtHome = (square: Square) => (pieceColor: PieceColor): boolean =>
    (pieceColor === PieceColor.Black && getRank(square) === _7) ||
    (pieceColor === PieceColor.White && getRank(square) === _2)

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
        getRank,
        row => row === lastRow
    )),
    mapOption((isLastRow:boolean):Move[] => isLastRow ? mapIntoPromotions(move) as Move[] : [move]),
    getOrElse(() => [] as Move[])
);

const isDoubleMove = (board: Board) => (move:Move) => 
        pipe(
            getMoveTo(move),
            sqr => getPieceColorAt(board, sqr),
            mapOption((color: PieceColor): [NumericCoordinate, NumericCoordinate] => color === PieceColor.Black ? [_7, _5] : [_2, _4]),
            mapOption(
                ([startRow, endRow]: [NumericCoordinate, NumericCoordinate] ) => 
                    getMoveFromNumericCoord(move) === startRow && 
                    getMoveToNumericCoord(move) === endRow
            ),
            getOrFalse
        )

interface LREnopassantDeps {
    toSide: (sq: Square) => Option<Square>,
    takeWhenWhite: (sq: Square) => Option<Square>,
    takeWhenBlack: (sq: Square) => Option<Square>,
};

const lrEnPassant =  (deps: LREnopassantDeps) => (square: Square) => (board:Board, moveHistory: MoveHistory):Option<Move> =>{
    const {toSide, takeWhenWhite, takeWhenBlack} = deps;

    return pipe(
        doOption,
        bind('lastMove', () => getLastMove(moveHistory)),
        filterOption(({lastMove}) => isDoubleMove(board)(lastMove)),
        bind('sideSqr', () => toSide(square)),
        filterOption(({sideSqr, lastMove}) => pipe(
            getMoveTo(lastMove),
            squareEquals(sideSqr)
        )),
        chainOption(({sideSqr}) => pipe(
            getPieceColorAt(board, square),
            chainOption(color => color === PieceColor.White ? takeWhenWhite(square) : takeWhenBlack(square))
        )),
        mapOption(destination => createEnPassant(square, destination))
    );
}
    
const leftEnPassant = lrEnPassant({
    toSide: toLeft(1),
    takeWhenBlack: toBottomLeft,
    takeWhenWhite: toUpLeft
});

const rightEnPassant = lrEnPassant({
    toSide: toRight(1),
    takeWhenBlack: toBottomRight,
    takeWhenWhite: toUpRight
});

const enPassant = (square: Square) => (board:Board, moveHistory:MoveHistory):Move[] => pipe(
    [leftEnPassant(square)(board, moveHistory), rightEnPassant(square)(board, moveHistory)],
    filter(isSome),
    map(wrappedMove => getOrUndefined(wrappedMove) as Move)
);

const combineMoves = (square:Square) => (boardAndHistory: [Board, MoveHistory]):Move[] => {
    const [board, moveHistory] = boardAndHistory;
    return pipe(
        [
            getForwardSingleSquareFromBoard(square)(board),
            getForwardDoubleSquareFromBoard(square)(board)
        ],
        map(wrapOrNoMoves(square)),
        append(getTakingMoves(square)(board)),
        append(enPassant(square)(board, moveHistory)),
        flatten,
        map(promote(board)),
        flatten,
    )
}

export const getLegalMoves = (game: Game, square:Square): Move[] => {
    return pipe(
        getCurrentBoard(game),
        mapRight(board => [board, getMovesHistory(game)]),
        // @ts-expect-error
        mapRight(combineMoves(square)),
        logLeft,
        getEitherOrElse(() => [])
    );
}
