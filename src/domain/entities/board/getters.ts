import { Board } from "./Board";
import { A, Square, _1 } from "../square/Square";
import {Piece, PieceColor, PieceType} from '../piece/Piece';
import * as SqGetters  from '../square/getters'
import * as E from 'fp-ts/Either';
import { flow } from "fp-ts/lib/function";
import { equalsToPiece, getPieceColor, getPieceType } from "../piece/getters";
import { createSquare, fromString } from "../square/constructors";
import { pipe } from "fp-ts/lib/function";
import { logLeft } from "../../../lib/either";
import { createPiece } from "../piece/constructors";
import { filter, map } from 'ramda';
import { flowUntilNull, flowWithFallback, isNotNull, Nullable } from "../../../lib/nullable";

export const getPieceAt = (board: Board, square: Square): Nullable<Piece> => {
    const key = SqGetters.toString(square);
    return board[key];
}

export const hasPieceAt = flow(
    getPieceAt,
    isNotNull
);

export const getPieceColorAt = flowUntilNull(
    getPieceAt,
    getPieceColor
);

export const getPieceTypeAt = flowUntilNull(
    getPieceAt,
    getPieceType
);

export const isSquareOccupied = hasPieceAt;

export const isSquareOccupiedByPieceType = (type: PieceType) => flowWithFallback(
    () => false,
    getPieceTypeAt,
    _pt => _pt === type
);

export const isSquareOccupiedByPiece = (piece: Piece) => flowWithFallback(
    () => false,
    getPieceAt,
    equalsToPiece(piece)
);

export const getPositions = (board: Board) => (piece: Piece): Square[] =>
    pipe(
        asList(board),
        filter(([, piece_]) => equalsToPiece(piece)(piece_)),
        map(([sqr]) => sqr)
    )

export const getPlayerPieces = (board: Board, player: PieceColor): [Square, Piece][] =>
    pipe(
        asList(board),
        filter(
            flow(
                ([, piece]: [Square, Piece]) => getPieceColor(piece),
                color => player === color
            )
        )
    );

export const isOccupiedByColor = (color:PieceColor) => flowWithFallback(
    () => false,
    getPieceAt,
    getPieceColor,
    c => c === color
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
