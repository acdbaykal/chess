import { flow, pipe } from "fp-ts/lib/function";
import { and } from "../../../lib/boolean-logic";
import { createSquare } from "../square/constructors";
import { getFile, getRank, isLeftOf, isRightOf, squareEquals } from "../square/getters";
import { Move, MoveType, EnPassant, Promotion, PromotionPieceType, RegularMove, Castling } from "./Move";

export const getMoveFrom = (move: Move) => move.from;
export const getMoveTo = (move: Move) => move.to;
const getMoveType = (move:Move) => move.__type__;
export const isSameMoveAs = (move1:Move) => (move2:Move):boolean =>
    getMoveType(move1) === getMoveType(move2) &&
    squareEquals(getMoveFrom(move1))(getMoveFrom(move2)) && 
    squareEquals(getMoveTo(move1))(getMoveTo(move2));

const isOfType = <M extends Move>(moveType: MoveType) => (move:Move): move is M =>
    move.__type__ === moveType


export const isRegularMove = isOfType<RegularMove>(MoveType.REGULAR);

export const isPromotionMove = isOfType<Promotion>(MoveType.PROMOTION);

export const isEnPassant = isOfType<EnPassant>(MoveType.ENPASSANT);

export const isCastling = isOfType<Castling>(MoveType.CASTLING);

export const isShortCastling  = and(
    isCastling,
    move => pipe(
        getMoveTo(move),
        isRightOf(getMoveFrom(move))
    )
);

export const isLongCastling  = and(
    isCastling,
    move => pipe(
        getMoveTo(move),
        isLeftOf(getMoveFrom(move))
    )
);

export const getPromotionPieceType = (move: Promotion): PromotionPieceType =>
    move.pieceType;

 export const getMoveFromNumericCoord = flow(
     getMoveFrom,
     getRank
 );

 export const getMoveToNumericCoord = flow(
    getMoveTo,
    getRank
);

export const getEnPassantTakeSquare = (move:EnPassant) => {
    const file = pipe(
        move,
        getMoveTo,
        getFile
    );

    const rank = pipe(
        move,
        getMoveFrom,
        getRank
    );

    return createSquare(file, rank);
}
    