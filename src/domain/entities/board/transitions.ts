import { Board } from "./Board";
import { Castling, EnPassant, Move, Promotion, RegularMove } from "../move/Move";
import {omit} from 'ramda';
import {toString} from '../square/getters';
import { pipe } from "fp-ts/lib/function";
import { getMoveFrom, getMoveTo, isPromotionMove, getPromotionPieceType, isRegularMove, isEnPassant, getEnPassantTakeSquare, isCastling, isShortCastling } from "../move/getters";
import * as Eth from "fp-ts/lib/Either";
import { getPieceAt, getPieceTypeAt, hasPieceAt } from "./getters";
import { Square, _1, _2, _3, _4, _5, _6, _7, _8 } from "../square/Square";
import { Piece, PieceType } from "../piece/Piece";
import { createPiece } from "../piece/constructors";
import { getPieceColor, isKing } from "../piece/getters";
import { MoveHistory } from "../movehistory/MoveHistory";
import { moveToString } from "../move/conversions";
import { assert, fromNullable } from "../../../lib/either";
import { boardToString } from "./conversions";
import { toLeft, toRight } from "../square/transitions";
import { isNotNull, Nullable, pipeUntilNull } from "../../../lib/nullable";

export const removePiece = (board: Board, square:Square): Board => 
    omit([toString(square)], board);

export const setPiece = (board: Board, square: Square, piece: Piece): Board => ({
    ...board,
    [toString(square)]: piece
})


type PrivateApplyMoveFunction<M extends Move> = (move:M) => (board: Board, piece:Piece) => Board

const movePiece = (board: Board, piece: Piece, from:Square, to:Square) => pipe(
    removePiece(board, from),
    board => setPiece(board, to, piece)
)

const applyRegularMove:PrivateApplyMoveFunction<RegularMove> = move => (board, piece) => {
    const from = getMoveFrom(move);
    const to = getMoveTo(move);
    
    return movePiece(board, piece, from, to);
}
    
const applyPromotion:PrivateApplyMoveFunction<Promotion> = move => (board, piece) => {
    const from = getMoveFrom(move);
    const to = getMoveTo(move);
    const promotionType = getPromotionPieceType(move);
    const color = getPieceColor(piece);
    const newPiece = createPiece(color, promotionType);

    return pipe(
        board,
        board => removePiece(board, from),
        board => setPiece(board, to, newPiece)
    );
}

const applyEnPassant = (move:EnPassant) => (board:Board, piece:Piece):Eth.Either<Error, Board> => {
    const to = getMoveTo(move);
    const from = getMoveFrom(move);
    const take = getEnPassantTakeSquare(move);

    return pipe(
        board,
        assert(
            (_board) => hasPieceAt(_board, take),
            (_board) => new Error(`Failed to apply en passant move to board: \n There is no piece to take on square ${toString(take)}\n${boardToString(_board)}`)
        ),
        Eth.map(_board => movePiece(_board, piece, from, to)),
        Eth.map(_board => removePiece(_board, take))
    );
}

const findCastlingRookSquare = (board: Board, kingPosition: Square, getNextSquare: (sq: Square) => Nullable<Square>): Nullable<Square> => {
    let currentSquare:Nullable<Square> = kingPosition;
    
    while(true) {
        currentSquare = getNextSquare(currentSquare);

        if(isNotNull(currentSquare)) {
            const isRook = pipeUntilNull(
                getPieceTypeAt(board, currentSquare),
                type => type === PieceType.Rook
            );

            if(isRook) return currentSquare;
            else continue;
        } else {
            return undefined;
        }
    }
} 

const applyCastling = (move:Castling, board:Board, piece: Piece): Eth.Either<Error, Board> => {
    const from = getMoveFrom(move);
    const to = getMoveTo(move);
    const color = getPieceColor(piece);
    
    if(!isKing(piece)) {
        return Eth.left(Error(`Illegal castling move: Piece at ${toString(from)} is not a king`));
    }

    const isShort = isShortCastling(move);

    const rook = createPiece(color, PieceType.Rook);
    
    return pipe(
        movePiece(board, piece, from, to),
        board => pipe(
            Eth.Do,
            Eth.bind('rookPosition', () => pipe(
                isShort
                    ? findCastlingRookSquare(board, from, toRight(1))
                    : findCastlingRookSquare(board, from, toLeft(1)),
                fromNullable(() => Error(`No rook found for castling`))
            )),
            Eth.bind('rookDestination', () => pipe(
                isShort ? toLeft(1)(to) : toRight(1)(to),
                fromNullable(() => Error(`Illegal king destionation for castling ${toString(to)}`))
            )),
            Eth.map(({rookDestination, rookPosition}) => movePiece(board, rook, rookPosition, rookDestination))
        )
    );
} 

const getApplyMoveFunction = (move: Move) => (board: Board, piece:Piece):Eth.Either<Error, Board> => {
    if(isRegularMove(move)) {
        return pipe(
            applyRegularMove(move)(board, piece),
            Eth.right
        );
    } else if(isPromotionMove(move)) {
        return pipe(
            applyPromotion(move)(board, piece),
            Eth.right
        )
    } else if(isEnPassant(move)) {
        return applyEnPassant(move)(board, piece);
    } else if(isCastling(move)) {
        return applyCastling(move, board, piece);
    }

    return Eth.left(new Error(
        `Unknown move type while applying to board: ${JSON.stringify(move)}`
    ));
}

export const applyMove = (board: Board, move: Move): Eth.Either<Error, Board> =>{
    const _applyMove = getApplyMoveFunction(move);
    const from = getMoveFrom(move);

    return pipe(
        getPieceAt(board, from),
        fromNullable(() => new Error(`Applying move ${moveToString(move)} is not possible: No piece avalable at given start`)),
        Eth.chain(piece => _applyMove(board, piece))
    )
}

const chainApplyMove = (move: Move) => Eth.chain((b: Board) => applyMove(b, move));

export const applyMoveHistory = (board: Board, moveList: MoveHistory):Eth.Either<Error, Board> =>
   moveList.reduce((currentBoard, move) => pipe(
       currentBoard,
       chainApplyMove(move)
   ), Eth.right<Error,Board>(board));

