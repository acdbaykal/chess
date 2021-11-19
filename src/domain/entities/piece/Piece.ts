export enum PieceType {
    Bishop = "BISHOP",
    King = "KING",
    Knight = 'Knight',
    Pawn = 'PAWN',
    Queen = 'QUEEN',
    Rook = 'Rook'
}

export enum PieceColor {
    Black = 'BLACK',
    White = 'WHITE'
}

export interface Piece {
    type: PieceType,
    color: PieceColor
}
