import { Game } from "../../entities/game/Game";
import { Move, RegularMove } from "../../entities/move/Move";
import { getFile, getRank } from "../../entities/square/getters";
import { AlphabeticCoordinate, Square, _1, _2, _3, _4, _5, _6, _7, _8 } from "../../entities/square/Square";
import {toBottomLeft, toBottomRight, toLeft, toLower, toRight, toUpLeft, toUpper, toUpRight} from '../../entities/square/transitions';
import { map as mapRight, getOrElse as getEitherOrElse} from 'fp-ts/Either';
import { createEnPassant, createRegularMove, mapIntoPromotions } from "../../entities/move/constructors";
import { PieceColor } from "../../entities/piece/Piece";
import { getCurrentBoard, getMovesHistory } from "../../entities/game/getters";
import { getPieceColorAt, isSquareOccupied } from "../../entities/board/getters";
import { flow, pipe } from "fp-ts/function";
import { Board } from "../../entities/board/Board";
import { filter, flatten, map } from "fp-ts/lib/Array";
import { getMoveFrom, getMoveTo, isSameMoveAs } from "../../entities/move/getters";
import { MoveHistory } from "../../entities/movehistory/MoveHistory";
import { getLastMove } from "../../entities/movehistory/getters";
import { logLeft } from "../../../lib/either";
import { createSquare } from "../../entities/square/constructors";
import { reversePieceColor } from "../../entities/piece/transition";
import { appendAll } from "../../../lib/list";
import { bindNullable, combineNullables, defaultTo, filterNullable, flowUntilNull, guardNullable, isNotNull, isNull, mapNullable, Nullable, pipeUntilNull } from "../../../lib/nullable";

const getForwardSquare = (amount: 1 | 2) => (pieceColor: PieceColor) =>
    pieceColor === PieceColor.Black ? toLower(amount) : toUpper(amount);


const getSingleForwardSquare = getForwardSquare(1);
const getDoubleForwardSquare = getForwardSquare(2);

const createDoubleMove = (color: PieceColor, file:AlphabeticCoordinate) => {
    const homeRank = getHomeRank(color);
    const destionationRank = color === PieceColor.Black ? _5 : _4;
    const startSquare = createSquare(file, homeRank);
    const destinationSquare = createSquare(file, destionationRank);
    return createRegularMove(startSquare, destinationSquare);
}

const getHomeRank = (pieceColor: PieceColor) => pieceColor === PieceColor.Black ? _7 : _2;

const isAtHome = (square: Square) => (pieceColor: PieceColor): boolean =>
    getHomeRank(pieceColor) === getRank(square);

const getForwardSingleSquareFromBoard = (square: Square, board:Board) =>
    pipeUntilNull(
        getPieceColorAt(board, square),
        pieceColor => getSingleForwardSquare(pieceColor)(square),
        filterNullable((sq:Square) => !isSquareOccupied(board, sq))
    );

const getBothForwardSquares = (square: Square) => (pieceColor:PieceColor):Nullable<Square[]> => combineNullables(
    getDoubleForwardSquare(pieceColor)(square),
    getSingleForwardSquare(pieceColor)(square)
);

const getForwardDoubleSquareFromBoard = (square: Square, board:Board) =>
    pipeUntilNull(
        getPieceColorAt(board, square),
        guardNullable(isAtHome(square)),
        getBothForwardSquares(square),
        guardNullable<Square[]>(
            ([doubleSq, singleSq]) => !isSquareOccupied(board, doubleSq) && !isSquareOccupied(board, singleSq)
        ),
        ([doubleSq]) => doubleSq
    );

const getWhiteFirstTakeDestination = flow(
    toLeft(1),
    mapNullable(toUpper(1))
);

const getWhiteSecondTakeDestination = flow(
    toRight(1),
    mapNullable(toUpper(1))
);

const getBlackFirstTakeDestination = flow(
    toLeft(1),
    mapNullable(toLower(1))
);

const getBlackSecondTakeDestination = flow(
    toRight(1),
    mapNullable(toLower(1))
);

const getTakingMoves = (square: Square, board: Board):RegularMove[] => {
    return pipe(
        pipeUntilNull(
            getPieceColorAt(board, square),
            pieceColor => 
                pipeUntilNull(
                    pieceColor === PieceColor.White
                        ?[
                            getWhiteFirstTakeDestination(square),
                            getWhiteSecondTakeDestination(square)
                        ]
                        : [
                            getBlackFirstTakeDestination(square),
                            getBlackSecondTakeDestination(square)
                        ],
                    filter(
                        flow(
                            mapNullable((destination: Square) => getPieceColorAt(board, destination)),
                            mapNullable((color:PieceColor) => color !== pieceColor),
                            defaultTo(() => false)
                        )
                    ),
                    map(
                        destination => createRegularMove(square, destination as Square)
                    )
                )
        ),
        defaultTo(() => [] as RegularMove[])
    )
    
    
    
}

const promote = (board:Board) => (move:RegularMove):Move[] => pipe(
    pipeUntilNull(
        getPieceColorAt(board, getMoveFrom(move)),
        pieceColor => pieceColor === PieceColor.Black ? _1 : _8,
        lastRow => pipe(
            getMoveTo(move),
            getRank,
            row => row === lastRow
        ),
        (isLastRow:boolean):Move[] => isLastRow ? mapIntoPromotions(move) as Move[] : [move]
    ),
    defaultTo(() => [] as Move[])
);

const isDoubleMoveAtFile = (color: PieceColor, expectedFile:AlphabeticCoordinate, move:Move) => pipe(
    createDoubleMove(color, expectedFile),
    isSameMoveAs(move)
);

interface LREnopassantDeps {
    toSide: (sq: Square) => Nullable<Square>,
    takeWhenWhite: (sq: Square) => Nullable<Square>,
    takeWhenBlack: (sq: Square) => Nullable<Square>,
};

const lrEnPassant =  (deps: LREnopassantDeps) => (square: Square) => (board:Board, moveHistory: MoveHistory):Nullable<Move> =>{
    const {toSide, takeWhenWhite, takeWhenBlack} = deps;

    return pipeUntilNull(
        {},
        bindNullable('sideFile', (_: {}): Nullable<AlphabeticCoordinate> => pipe(
            toSide(square),
            mapNullable(getFile)
        )),
        bindNullable<{sideFile: AlphabeticCoordinate}, 'lastMove', Move>('lastMove', () => getLastMove(moveHistory)),
        bindNullable<{sideFile: AlphabeticCoordinate, lastMove: Move}, 'pieceColor', PieceColor>('pieceColor', () => getPieceColorAt(board, square)),
        guardNullable<{sideFile: AlphabeticCoordinate, pieceColor:PieceColor, lastMove: Move}>(({sideFile, pieceColor, lastMove}) => 
            isDoubleMoveAtFile(reversePieceColor(pieceColor), sideFile, lastMove)),
        bindNullable<{sideFile: AlphabeticCoordinate, pieceColor:PieceColor, lastMove: Move}, 'destination', Square>('destination', ({pieceColor}) => pieceColor === PieceColor.White ? takeWhenWhite(square) : takeWhenBlack(square)),
        ({destination}) => createEnPassant(square, destination)
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

const enPassant = (square: Square, board:Board, moveHistory:MoveHistory):Move[] => pipe(
    [leftEnPassant(square)(board, moveHistory), rightEnPassant(square)(board, moveHistory)],
    filter(isNotNull)
);

const appendIfNotNull = <M extends Move>(move:Nullable<M>) => (moveList: M[]) => 
    isNull(move) ? moveList : (moveList.push(move), moveList);

const combineMoves = (square:Square) => (boardAndHistory: [Board, MoveHistory]):Move[] => {
    const [board, moveHistory] = boardAndHistory;
    return pipe(
        [],
        appendIfNotNull(pipe(
            getForwardSingleSquareFromBoard(square, board),
            mapNullable(destinationSqr => createRegularMove(square, destinationSqr))
        )),
        appendIfNotNull(pipe(
            getForwardDoubleSquareFromBoard(square, board),
            mapNullable(destinationSqr => createRegularMove(square, destinationSqr))
        )),
        appendAll(...getTakingMoves(square, board)),
        map(promote(board)),
        flatten,
        appendAll(...enPassant(square, board, moveHistory))
    )
};

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
