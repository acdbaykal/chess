import { flow } from "fp-ts/lib/function";
import { getRank, squareEquals } from "../square/getters";
import { Move, MoveType, EnPassant, Promotion, PromotionPieceType, RegularMove } from "./Move";

export const getMoveFrom = (move: Move) => move.from;
export const getMoveTo = (move: Move) => move.to;
export const isSameMoveAs = (move1:Move) => (move2:Move):boolean =>
    squareEquals(getMoveFrom(move1))(getMoveFrom(move2)) && 
    squareEquals(getMoveTo(move1))(getMoveTo(move2));

const isOfType = <M extends Move>(moveType: MoveType) => (move:Move): move is M =>
    move.__type__ === moveType


export const isRegularMove = isOfType<RegularMove>(MoveType.REGULAR);

export const isPromotionMove = isOfType<Promotion>(MoveType.PROMOTION);

export const isEnPassant = isOfType<EnPassant>(MoveType.ENPASSANT);

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

export const getEnPassantTakeSquare = (move:EnPassant) => move.take;
    