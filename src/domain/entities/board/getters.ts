import { Board } from "./Board";
import { A, createSquare, fromString, Square, _1 } from "../square/Square";
import {Piece} from '../piece/Piece';
import * as SqGetters  from '../square/getters'
import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
import { flow } from "fp-ts/lib/function";
import { equalstoPiece } from "../piece/getters";

export const getPieceAt = (board: Board, square: Square): O.Option<Piece> => {
    const key = SqGetters.toString(square);
    return O.fromNullable(board[key]);
}

export const isSquareOccupied = flow(
    getPieceAt,
    O.isSome
);

export const getSquaresForPiece = (board: Board, piece: Piece): Square[] => {
    const squareStrings = Object.keys(board);
    const isSamePiece = equalstoPiece(piece);
    return squareStrings.filter(key => {
            const currentPice = board[key];
            return isSamePiece(currentPice);
        })
        .map(fromString)
        .filter(E.isRight)
        .map(E.getOrElse(() => createSquare(A, _1)));
}
