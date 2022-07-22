import { flow, pipe } from "fp-ts/lib/function";
import { getOrTrue, logLeft } from "../../../lib/either";
import { Game } from "../../entities/game/Game"
import { getCurrentBoard, getInitialBoard, getMovesHistory, hasPieceMoved } from "../../entities/game/getters";
import { getKingsSquare, getPieceAt, getPositions } from "../../entities/board/getters";
import { createCastling } from "../../entities/move/constructors";
import { getActiveColor } from "../../entities/movehistory/getters";
import { PieceColor, PieceType } from "../../entities/piece/Piece";
import { createSquare } from "../../entities/square/constructors";
import { AlphabeticCoordinate, C, G, Square, _1, _8 } from "../../entities/square/Square";
import { isNotNull, isNull, Nullable } from "../../../lib/nullable";
import { Castling } from "../../entities/move/Move";
import { toSingleLeft, toSingleRight } from "../../entities/square/transitions";
import { createPiece } from "../../entities/piece/constructors";
import { Board } from "../../entities/board/Board";
import {bind, Do as doEither, getOrElse, map} from 'fp-ts/Either'
import {equalsToPiece} from '../../entities/piece/getters';
import { isLeftOf, isRightOf } from "../../entities/square/getters";

type NavigateFn = (sq: Square) => Nullable<Square>;

const createCastlingFn = (navigate: NavigateFn, destinationFile: AlphabeticCoordinate) => 
(game: Game, board: Board, kingColor:PieceColor, kingPosition: Square): Nullable<Castling> => {
    let currentSquare: Nullable<Square> = kingPosition;
    const rook = createPiece(kingColor, PieceType.Rook);
    
    // Make sure there is no piece between the king and the rook
    while(isNotNull(currentSquare = navigate(currentSquare))) {
        const pieceAtSquare = getPieceAt(board, currentSquare);

        if(isNull(pieceAtSquare)){
            continue;
        } else if(equalsToPiece(pieceAtSquare)(rook)){
            const kingDestination = kingColor === PieceColor.White
                ? createSquare(destinationFile, _1)
                : createSquare(destinationFile, _8); 

            return createCastling(kingPosition, kingDestination);
        } else {
            return undefined;
        }
    }
    
    return undefined;
}



const findRookPositions = (initialBoard: Board, color: PieceColor, kingPosition: Square) => {
    const rookPositions = getPositions(initialBoard)(createPiece(color, PieceType.Rook));
    const shortRook = rookPositions.find(isRightOf(kingPosition));
    const longRook = rookPositions.find(isLeftOf(kingPosition));
    return {
        shortRook,
        longRook
    };
}
    

const createLongCastling = createCastlingFn(toSingleLeft, C);
const createShortCastling = createCastlingFn(toSingleRight, G);
const _hasPieceMoved = flow(
    hasPieceMoved,
    getOrTrue
);

const createCastlingWheNotMoved = (game: Game, rookSquare: Nullable<Square>, createCastling: typeof createShortCastling) => {
    return isNotNull(rookSquare) && !_hasPieceMoved(game, rookSquare)
        ? createCastling
        : () => undefined
}

export const getLegalMoves = (game:Game) => {

    const moveHistory = getMovesHistory(game);
    const initialBoard = getInitialBoard(game);
    const kingColor = getActiveColor(moveHistory);
    const initialKingPosition = getKingsSquare(initialBoard, kingColor);

    if(isNull(initialKingPosition)){
        throw new Error(`Illegal board without a ${kingColor} king.`);
    }

    const kingDestination = kingColor === PieceColor.White
        ? createSquare(G, _1)
        : createSquare(G, _8);

    const rookPositions = findRookPositions(initialBoard, kingColor, initialKingPosition);
    const _createShortCastling = createCastlingWheNotMoved(game, rookPositions.shortRook, createShortCastling);

    return pipe(
        doEither,
        bind('hasKingMoved', () => hasPieceMoved(game, initialKingPosition)),
        bind('board', () => getCurrentBoard(game)),
        logLeft,
        map(
            ({hasKingMoved, board}) => hasKingMoved
                ? []
                : [
                    _createShortCastling(game, board, kingColor, initialKingPosition),
                    createLongCastling(game, board, kingColor, initialKingPosition)
                ].filter(isNotNull)
        ),
        getOrElse(() => [] as Castling[]) 
    );
}

// const combineEither = sequenceS(E.Apply);

// const _isCastlingMove = (whiteToSquare: Square, blackToSquare: Square) => (board: Board, move: Move, piece: Piece):boolean => {
//     const from = getMoveFrom(move);
//     const fromRow = getNumericAxis(from);
//     const to = getMoveTo(move);
//     const black = isBlackPiece(piece);
//     const correctFromRow = black ? fromRow === _8 : fromRow === _1;
//     const equalsToDestination = squareEquals(to);
//     const correctColumn = black 
//         ? equalsToDestination(blackToSquare) 
//         : equalsToDestination(whiteToSquare);

//     return correctFromRow && correctColumn;
// }

// const isShortCastlingMove = _isCastlingMove(createSquare(G, _1),  createSquare(G, _8));
// const isLongCastlingMove = _isCastlingMove(createSquare(C, _1),  createSquare(C, _8));

// export const isCastlingMove = (board: Board, move: Move) => {
//     const from = getMoveFrom(move);
//     return pipe(
//         getPieceAt(board, from),
//         O.filter(isKing),
//         O.filter(piece => isShortCastlingMove(board, move, piece)),
//         O.filter(piece => isLongCastlingMove(board, move, piece)),
//         O.isSome
//     );
// }

// const getOrEmptyBoard = E.getOrElse(() => EMPTY_BOARD);

// export const isLegalCastlingMove = (game:Game, move: Move):boolean => {
//     const from = getMoveFrom(move);
//     const currentBoard = getCurrentBoard(game);
//     const currentKing = pipe(
//         currentBoard,
//         E.map(board => getPieceAt(board, from)),
//         E.chain(E.fromOption(() => new Error(`Legal castling / No pice present at current board at ${toString(from)}`))),
//         E.filterOrElse(isKing, () => new Error(`Legal castling / Piece at ${toString(from)} in current board is not a king`)),
//     );

//     const currentKingPosition = pipe(
//        currentKing,
//        E.map(king => getSquaresForPiece(getOrEmptyBoard(currentBoard), king)),
//        E.filterOrElse(sqquares => squareEquals.length === 1, (squares) => new Error(`Legal castling / found ${squares.length} kings on the board`)),
//        E.map(squares => squares[0] as Square)
//     );

//     const kingInitialPosition = pipe(
//        currentKing,
//         E.map(king => getInitialSquaresForPiece(game, king)),
//         E.filterOrElse(sqquares => squareEquals.length === 1, (squares) => new Error(`Legal castling / found ${squares.length} kings on initial board`)),
//         E.map(squares => squares[0] as Square)
//     );


//     const kingHasNotMoved = pipe(
//         kingInitialPosition,
//         E.chain(king => hasPieceMoved(game, king)),
//         E.map(hasMoved => !hasMoved)
//     );

//     const getRookSquares = flow(
//         () => currentKing,
//         E.map(isBlackPiece),
//         E.map(isBlack => isBlack ? createPiece(PieceColor.Black, PieceType.Rook) : createPiece(PieceColor.White, PieceType.Rook)),
//         E.map(rook => getInitialSquaresForPiece(game, rook)),
//         E.filterOrElse(rookSqures => rookSqures.length === 2, rookSquares => new Error(`Legal castling / found ${rookSquares.length} rook(s) on the initial board`)),
//     );

//     return and(
//         () => E.getOrElse(() => false)(kingHasNotMoved),
//         flow(
//             () => combineEither({
//                 rookSquares: getRookSquares(),
//                 kingInitialPosition,
//                 king: currentKing
//             }),
//             E.chain(({rookSquares, kingInitialPosition, king}) => {
//                 let square: Square | undefined = undefined;
//                 const board = getInitialBoard(game);

//                 if(isShortCastlingMove(board, move, king)){
//                     square = rookSquares.find(isRightOf(kingInitialPosition));
//                 } else if (isLongCastlingMove(board, move, king)) {
//                     square = rookSquares.find(isLeftOf(kingInitialPosition));
//                 }

//                 return E.fromNullable(new Error('Unable to find suiting rook for castling move'))(square);
//             }),
//             E.chain(rookSquare => hasPieceMoved(game, rookSquare)),
//             E.map(hasMoved => !hasMoved),
//             E.getOrElse<Error, boolean>(() => false)
//         )
//     )();

// }
    
