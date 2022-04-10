import { Board } from "./Board";
import { Move } from "../move/Move";
import {insert, omit, reduce} from 'ramda';
import {toString} from '../square/getters';
import { flow, pipe } from "fp-ts/lib/function";
import { getMoveFrom, getMoveTo, isPromotionMove, getPromotionPieceType } from "../move/getters";
import * as E from "fp-ts/lib/Either";
import { getPieceAt } from "./getters";
import { Square } from "../square/Square";
import { Piece } from "../piece/Piece";
import { createPiece } from "../piece/constructors";
import { getPieceColor } from "../piece/getters";
import { MoveHistory } from "../movehistory/MoveHistory";

export const removePiece = (board: Board, square:Square): Board => 
    omit([toString(square)], board);

export const setPiece = (board: Board, square: Square, piece: Piece): Board => ({
    ...board,
    [toString(square)]: piece
})

export const applyMove = (board: Board, move: Move): E.Either<Error, Board> => {
    const from = getMoveFrom(move);

    return pipe(
        getPieceAt(board, from),
        E.fromOption(() => new Error('Applying move is not possible: No piece avalable at given square')),
        E.map(piece => {
            const to = getMoveTo(move)

            return pipe(
                board,
                board => removePiece(board, from),
                board => isPromotionMove(move) 
                    ? setPiece(board, to, createPiece(getPieceColor(piece), getPromotionPieceType(move))) 
                    : setPiece(board, to, piece)
            );
        })
    
    );    
};

const chainApplyMove = (move: Move) => E.chain((b: Board) => applyMove(b, move));

export const applyMoveHistory = (board: Board, moveList: MoveHistory):E.Either<Error, Board> =>
   moveList.reduce((currentBoard, move) => pipe(
       currentBoard,
       chainApplyMove(move)
   ), E.right<Error,Board>(board));
