import { PieceType } from "../piece/Piece";
import { Square } from "../square/Square";
import { Move, MoveType, Promotion, RegularMove } from "./Move";

export const createRegularMove = (from: Square, to: Square):RegularMove => 
    ({ from,to, __type__: MoveType.REGULAR});

export const createPromotion = (from: Square, to: Square, pieceType: PieceType):Promotion =>
    ({from, to, __type__: MoveType.PROMOTION, pieceType})
    
export const createMoveList = (start: Square) => (destinations: (Square | [Square, PieceType])[]): Move[] =>
    destinations.map(
        dest => dest instanceof Array ? createPromotion(start, dest[0], dest[1]) : createRegularMove(start, dest)
    );
