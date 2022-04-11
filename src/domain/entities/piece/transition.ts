import { getPieceColor, getPieceType } from "./getters";
import { Piece, PieceColor, PieceType } from "./Piece";

export const reversePieceColor = (color:PieceColor) => color === PieceColor.White ? PieceColor.Black : PieceColor.White;

export const pieceToEmoji = (piece: Piece): string => {
    const pieceColor = getPieceColor(piece);
    const pieceType = getPieceType(piece);

    if(pieceColor === PieceColor.Black) {
        switch(pieceType) {
            case PieceType.Queen: return '♕'
            case PieceType.Rook: return '♖'
            case PieceType.Bishop: return '♗'
            case PieceType.Knight: return '♘'
            case PieceType.King: return '♔'
            case PieceType.Pawn: return '♙'
        }
    } else {
        switch(pieceType) {
            case PieceType.Queen: return '♛'
            case PieceType.Rook: return '♜'
            case PieceType.Bishop: return '♝'
            case PieceType.Knight: return '♞'
            case PieceType.King: return '♚'
            case PieceType.Pawn: return '♟'
        }
    }
}