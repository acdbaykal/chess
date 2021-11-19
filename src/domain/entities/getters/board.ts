import { Board } from "../Board";
import { Square } from "../Square";
import {Piece} from '../Piece';
import * as SqGetters  from './square'
import * as O from 'fp-ts/Option';
import { flow } from "fp-ts/lib/function";

export const getPieceAt = (board: Board, square: Square): O.Option<Piece> => {
    const key = SqGetters.toString(square);
    return O.fromNullable(board[key]);
}

export const isSquareOccupied = flow(
    getPieceAt,
    O.isSome
);
