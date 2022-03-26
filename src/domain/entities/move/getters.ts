import { is } from "ramda";
import { PieceType } from "../piece/Piece";
import { squareEquals } from "../square/getters";
import { Move, MoveType, Promotion, RegularMove } from "./Move";

export const getMoveFrom = (move: Move) => move.from;
export const getMoveTo = (move: Move) => move.to;
export const isSameMoveAs = (move1:Move) => (move2:Move):boolean =>
    squareEquals(getMoveFrom(move1))(getMoveFrom(move2)) && 
    squareEquals(getMoveTo(move1))(getMoveTo(move2));

export const isRegularMove = (move: Move):move is RegularMove =>
    move.__type__ === MoveType.REGULAR;

export const isPromotionMove = (move: Move):move is Promotion =>
    move.__type__ === MoveType.PROMOTION;

export const getPromotionPieceType = (move: Promotion): PieceType =>
    move.pieceType;