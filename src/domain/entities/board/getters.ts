import { Board } from "./Board";
import { A, Square, _1 } from "../square/Square";
import {Piece, PieceColor, PieceType} from '../piece/Piece';
import * as SqGetters  from '../square/getters'
import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
import { flow } from "fp-ts/lib/function";
import { equalsToPiece, getPieceColor, getPieceType } from "../piece/getters";
import { createSquare, fromString } from "../square/constructors";
import {getOrFalse} from "../../../lib/option";
import { pipe } from "fp-ts/lib/function";
import { logLeft } from "../../../lib/either";
import { createPiece } from "../piece/constructors";

export const getPieceAt = (board: Board, square: Square): O.Option<Piece> => {
    const key = SqGetters.toString(square);
    return O.fromNullable(board[key]);
}

export const getPieceColorAt = flow(
    getPieceAt,
    O.map(getPieceColor)
);

export const isSquareOccupied = flow(
    getPieceAt,
    O.isSome
);

export const isSquareOccupiedByPieceType = (type: PieceType) => flow(
    getPieceAt,
    O.map(getPieceType),
    O.map(_pt => _pt === type),
    getOrFalse
);

export const isSquareOccupiedByPiece = (piece: Piece) => flow(
    getPieceAt,
    O.map(equalsToPiece(piece)),
    getOrFalse
);

export const isOccupiedByColor = (color:PieceColor) => flow(
    getPieceAt,
    O.map(getPieceColor),
    O.map(c => c === color),
    getOrFalse
);

export const getSquaresForPiece = (board: Board, piece: Piece): Square[] => {
    const squareStrings = Object.keys(board);
    const isSamePiece = equalsToPiece(piece);
    return squareStrings.filter(key => {
            const currentPice = board[key];
            return isSamePiece(currentPice);
        })
        .map(fromString)
        .filter(E.isRight)
        .map(E.getOrElse(() => createSquare(A, _1)));
}

export const asList = (board:Board): [Square, Piece][] =>
    Object.entries(board).map(
        ([key, piece]) => pipe(
            fromString(key),
            logLeft,
            E.map(sqr => [sqr, piece] as [Square, Piece]),   
            E.getOrElse(() => [createSquare(A, _1), createPiece(PieceColor.White, PieceType.King)])
        )
    )
