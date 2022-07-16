import { A, Square, _1, _2 } from "../square/Square";
import { Castling, EnPassant, Move, MoveType, Promotion, PromotionPieceType, RegularMove } from "./Move";
import { Record } from "immutable";
import { createSquare } from "../square/constructors";
import { PieceColor, PieceType } from "../piece/Piece";


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

const EnPassentMoveFactory = Record<EnPassant>({
    from: createSquare(A, _1),
    to: createSquare(A, _2),
    __type__: MoveType.ENPASSANT,
});

const CastlingMoveFactory = Record<Castling>({
    from: createSquare(A, _1),
    to: createSquare(A, _2),
    __type__: MoveType.CASTLING,
});

export const createRegularMove = (from: Square, to: Square):RegularMove => 
    RegularMoveFactory({ from,to, __type__: MoveType.REGULAR});

export const createPromotion = (from: Square, to: Square, pieceType: PromotionPieceType):Promotion =>
    PromotionMoveFactory({from, to, __type__: MoveType.PROMOTION, pieceType})

export const createEnPassant = (from: Square, to: Square): EnPassant =>
    EnPassentMoveFactory({from, to});

export const createCastling = (from: Square, to: Square):Castling =>
    CastlingMoveFactory({from, to});
    
export const createMoveList = (start: Square) => (destinations: (Square | [Square, PromotionPieceType])[]): Move[] =>
    destinations.map(
        dest => dest instanceof Array ? createPromotion(start, dest[0], dest[1]) : createRegularMove(start, dest)
    );


const promotable:PromotionPieceType[] = [
    PieceType.Knight,
    PieceType.Bishop,
    PieceType.Queen,
    PieceType.Rook
];

export const mapIntoPromotions = (base: RegularMove): Promotion[] =>
    promotable.map(pieceType => createPromotion(base.from, base.to, pieceType));
