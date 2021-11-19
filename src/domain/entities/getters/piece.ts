import { Piece, PieceColor, PieceType } from "../Piece";
export const getPieceType = (p: Piece):PieceType => p.type;
export const getPieceColor = (p: Piece):PieceColor => p.color;

const isOfX = <P>(getter: (p: Piece) => P) => (value: P) => (piece: Piece): boolean =>
    getter(piece) === value

export const isOfColor = isOfX(getPieceColor);
export const isBlackPiece = isOfColor(PieceColor.Black);
export const isWhitePiece = isOfColor(PieceColor.White);

export const isOfType = isOfX(getPieceType);
export const isBishop = isOfType(PieceType.Bishop);
export const isKing = isOfType(PieceType.King);
export const isKnight = isOfType(PieceType.Knight);
export const isPawn = isOfType(PieceType.Pawn);
export const isQueen = isOfType(PieceType.Queen);
export const isRook = isOfType(PieceType.Rook); 
