// import { flow, pipe } from "fp-ts/lib/function";
// import { Board, EMPTY_BOARD } from "../../entities/board/Board";
// import { getPieceAt, getSquaresForPiece } from "../../entities/board/getters";
// import { getMoveFrom, getMoveTo } from "../../entities/move/getters";
// import { Move } from "../../entities/move/Move";
// import { isBlackPiece, isKing } from "../../entities/piece/getters";
// import * as O from "fp-ts/Option";
// import * as E from 'fp-ts/Either';
// import { createPiece, Piece, PieceColor, PieceType } from "../../entities/piece/Piece";
// import { getNumericAxis, isLeftOf, isRightOf, squareEquals, toString } from "../../entities/square/getters";
// import { C, createSquare, G, Square, _1, _8 } from "../../entities/square/Square";
// import { Game } from "../../entities/game/Game";
// import { getCurrentBoard, getInitialBoard, getInitialSquaresForPiece, hasPieceMoved } from "../../entities/game/getters";
// import {and} from "../../../lib/boolean-logic";
// import { sequenceS } from "fp-ts/lib/Apply";

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
