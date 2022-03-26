import { sort } from "ramda";
import { PieceType } from "../piece/Piece";
import { getLetterAxis, getNumericAxis, isLeftOf, isUpOf } from "../square/getters";
import { createPromotion, createRegularMove } from "./constructors";
import { getMoveTo } from "./getters";
import { Move, MoveType, Promotion, RegularMove } from "./Move";

const sortFn = (move1: Move, move2: Move):number => {
    const to1 = getMoveTo(move1);
    const to2 = getMoveTo(move2);
    const sameLetter = getLetterAxis(to1) === getLetterAxis(to2);
    const sameNum = getNumericAxis(to1) === getNumericAxis(to2);
    
    if(sameLetter && sameNum){
        return 0;
    } else if(sameLetter) {
        return isUpOf(to1)(to2) ? -1 : 1; 
    }

    return isLeftOf(to1)(to2) ? -1 : 1;
};

export const sortMoveList = sort(sortFn);

export const mapIntoPromotions = (base: RegularMove): Promotion[] =>
    [
        PieceType.Knight,
        PieceType.Bishop,
        PieceType.Queen,
        PieceType.Rook
    ].map(pieceType => createPromotion(base.from, base.to, pieceType));
