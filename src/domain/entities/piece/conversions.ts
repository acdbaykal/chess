import { getPieceColor, getPieceType } from "./getters";
import { Piece, PieceColor, PieceType } from "./Piece";

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

const pieceHierarchy = [
    PieceType.King,
    PieceType.Queen,
    PieceType.Rook,
    PieceType.Bishop,
    PieceType.Knight,
    PieceType.Pawn
];

export const pieceTypeToNumber = (pieceType:PieceType):number => 
    pieceHierarchy.indexOf(pieceType) + 1;
