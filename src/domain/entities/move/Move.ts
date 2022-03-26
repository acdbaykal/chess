import { PieceType } from '../piece/Piece';
import {Square} from '../square/Square';

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
    pieceType: PieceType
}

export interface RegularMove extends Move {
    __type__: MoveType.REGULAR
}
