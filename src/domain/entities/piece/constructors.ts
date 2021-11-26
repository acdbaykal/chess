import { PieceColor, PieceType } from "./Piece";

export const createPiece = (color: PieceColor, type: PieceType) => ({ type, color });