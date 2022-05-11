import { Board } from "./Board";
import { EnPassant, Move, Promotion, RegularMove } from "../move/Move";
import {omit} from 'ramda';
import {toString} from '../square/getters';
import { pipe } from "fp-ts/lib/function";
import { getMoveFrom, getMoveTo, isPromotionMove, getPromotionPieceType, isRegularMove, isEnPassant, getEnPassantTakeSquare } from "../move/getters";
import * as Eth from "fp-ts/lib/Either";
import { getPieceAt, hasPieceAt } from "./getters";
import { Square, _1, _2, _3, _4, _5, _6, _7, _8 } from "../square/Square";
import { Piece } from "../piece/Piece";
import { createPiece } from "../piece/constructors";
import { getPieceColor } from "../piece/getters";
import { MoveHistory } from "../movehistory/MoveHistory";
import { moveToString } from "../move/transition";
import { assert } from "../../../lib/either";
import { boardToString } from "./conversions";

export const removePiece = (board: Board, square:Square): Board => 
    omit([toString(square)], board);

export const setPiece = (board: Board, square: Square, piece: Piece): Board => ({
    ...board,
    [toString(square)]: piece
})


type PrivateApplyMoveFunction<M extends Move> = (move:M) => (board: Board, piece:Piece) => Board

const applyRegularMove:PrivateApplyMoveFunction<RegularMove> = move => (board, piece) => {
    const from = getMoveFrom(move);
    const to = getMoveTo(move);
    
    return pipe(
        board,
        board => removePiece(board, from),
        board => setPiece(board, to, piece)
    );
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
        Eth.map(_board => removePiece(_board, from)),
        Eth.map(_board => setPiece(_board, to, piece)),
        Eth.map(_board => removePiece(_board, take))
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
        Eth.fromOption(() => new Error(`Applying move ${moveToString(move)} is not possible: No piece avalable at given start`)),
        Eth.chain(piece => _applyMove(board, piece))
    )
}

const chainApplyMove = (move: Move) => Eth.chain((b: Board) => applyMove(b, move));

export const applyMoveHistory = (board: Board, moveList: MoveHistory):Eth.Either<Error, Board> =>
   moveList.reduce((currentBoard, move) => pipe(
       currentBoard,
       chainApplyMove(move)
   ), Eth.right<Error,Board>(board));

