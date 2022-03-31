import { PieceType } from '../piece/Piece';
import {Square} from '../square/Square';

export type PromotionPieceType =  PieceType.Bishop | PieceType.Knight | PieceType.Queen | PieceType.Rook;  

export enum MoveType {
    REGULAR, PROMOTION
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

export interface RegularMove extends Move {
    __type__: MoveType.REGULAR
}
