import { A, Square, _1, _2 } from "../square/Square";
import { Move, MoveType, Promotion, PromotionPieceType, RegularMove } from "./Move";
import { Record } from "immutable";
import { createSquare } from "../square/constructors";
import { PieceType } from "../piece/Piece";


const RegularMoveFactory = Record<RegularMove>({
    from: createSquare(A, _1),
    to: createSquare(A, _2),
    __type__: MoveType.REGULAR
});

const PromotionMoveFactory = Record<Promotion>({
    from: createSquare(A, _1),
    to: createSquare(A, _2),
    __type__: MoveType.PROMOTION,
    pieceType: PieceType.Queen
});

export const createRegularMove = (from: Square, to: Square):RegularMove => 
    RegularMoveFactory({ from,to, __type__: MoveType.REGULAR});

export const createPromotion = (from: Square, to: Square, pieceType: PromotionPieceType):Promotion =>
    PromotionMoveFactory({from, to, __type__: MoveType.PROMOTION, pieceType})
    
export const createMoveList = (start: Square) => (destinations: (Square | [Square, PromotionPieceType])[]): Move[] =>
    destinations.map(
        dest => dest instanceof Array ? createPromotion(start, dest[0], dest[1]) : createRegularMove(start, dest)
    );
