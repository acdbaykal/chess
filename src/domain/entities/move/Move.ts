import { PieceType } from '../piece/Piece';
import {Square} from '../square/Square';

export type PromotionPieceType =  PieceType.Bishop | PieceType.Knight | PieceType.Queen | PieceType.Rook;  

export enum MoveType {
    ENPASSANT, REGULAR, PROMOTION
}

export interface Move {
    __type__: MoveType,
    from: Square,
    to: Square
}

export interface Promotion extends Move {
    __type__: MoveType.PROMOTION,
    pieceType: PromotionPieceType
}

export interface EnPassant extends Move {
    __type__: MoveType.ENPASSANT
}

export interface RegularMove extends Move {
    __type__: MoveType.REGULAR
}
