import { createPiece } from "../piece/constructors";
import { PieceColor, PieceType } from "../piece/Piece";
import { createSquare } from "../square/constructors";
import { A, B, C, D, E, F, G, H, _1, _2, _7, _8 } from "../square/Square";
import { createBoardFromList } from "./constructors";

export const STANDART_INITIAL_POSITION = createBoardFromList([
    [createSquare(A, _1), createPiece(PieceColor.White, PieceType.Rook)],
    [createSquare(B, _1), createPiece(PieceColor.White, PieceType.Knight)],
    [createSquare(C, _1), createPiece(PieceColor.White, PieceType.Bishop)],
    [createSquare(D, _1), createPiece(PieceColor.White, PieceType.Queen)],
    [createSquare(E, _1), createPiece(PieceColor.White, PieceType.King)],
    [createSquare(F, _1), createPiece(PieceColor.White, PieceType.Bishop)],
    [createSquare(G, _1), createPiece(PieceColor.White, PieceType.Knight)],
    [createSquare(H, _1), createPiece(PieceColor.White, PieceType.Rook)],

    [createSquare(B, _2), createPiece(PieceColor.White, PieceType.Pawn)],
    [createSquare(A, _2), createPiece(PieceColor.White, PieceType.Pawn)],
    [createSquare(C, _2), createPiece(PieceColor.White, PieceType.Pawn)],
    [createSquare(D, _2), createPiece(PieceColor.White, PieceType.Pawn)],
    [createSquare(E, _2), createPiece(PieceColor.White, PieceType.Pawn)],
    [createSquare(F, _2), createPiece(PieceColor.White, PieceType.Pawn)],
    [createSquare(G, _2), createPiece(PieceColor.White, PieceType.Pawn)],
    [createSquare(H, _2), createPiece(PieceColor.White, PieceType.Pawn)],

    [createSquare(A, _8), createPiece(PieceColor.Black, PieceType.Rook)],
    [createSquare(B, _8), createPiece(PieceColor.Black, PieceType.Knight)],
    [createSquare(C, _8), createPiece(PieceColor.Black, PieceType.Bishop)],
    [createSquare(D, _8), createPiece(PieceColor.Black, PieceType.Queen)],
    [createSquare(E, _8), createPiece(PieceColor.Black, PieceType.King)],
    [createSquare(F, _8), createPiece(PieceColor.Black, PieceType.Bishop)],
    [createSquare(G, _8), createPiece(PieceColor.Black, PieceType.Knight)],
    [createSquare(H, _8), createPiece(PieceColor.Black, PieceType.Rook)],

    [createSquare(B, _7), createPiece(PieceColor.Black, PieceType.Pawn)],
    [createSquare(A, _7), createPiece(PieceColor.Black, PieceType.Pawn)],
    [createSquare(C, _7), createPiece(PieceColor.Black, PieceType.Pawn)],
    [createSquare(D, _7), createPiece(PieceColor.Black, PieceType.Pawn)],
    [createSquare(E, _7), createPiece(PieceColor.Black, PieceType.Pawn)],
    [createSquare(F, _7), createPiece(PieceColor.Black, PieceType.Pawn)],
    [createSquare(G, _7), createPiece(PieceColor.Black, PieceType.Pawn)],
    [createSquare(H, _7), createPiece(PieceColor.Black, PieceType.Pawn)],
]);