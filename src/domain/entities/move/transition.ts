import { sort } from "ramda";
import { PieceType } from "../piece/Piece";
import { getLetterAxis, getNumericAxis, isLeftOf, isUpOf } from "../square/getters";
import { createPromotion } from "./constructors";
import { getMoveTo, getPromotionPieceType, isPromotionMove } from "./getters";
import { Move, Promotion, RegularMove } from "./Move";
import {PromotionPieceType} from '../move/Move';

const promotionToValue = (promotion:PromotionPieceType) => {
    switch(promotion) {
        case PieceType.Bishop:
            return 1;
        case PieceType.Knight:
            return 2;
        case PieceType.Queen:
            return 3;
        case PieceType.Rook:
            return 4;
    }
};

const sortFn = (move1: Move, move2: Move):number => {
    const to1 = getMoveTo(move1);
    const to2 = getMoveTo(move2);
    const sameLetter = getLetterAxis(to1) === getLetterAxis(to2);
    const sameNum = getNumericAxis(to1) === getNumericAxis(to2);
    const firstIsPromotion = isPromotionMove(move1);
    const secondIsPromotion = isPromotionMove(move2);

    if(firstIsPromotion && secondIsPromotion){
        const firstPromotion = getPromotionPieceType(move1 as Promotion);
        const secondPromotion = getPromotionPieceType(move2 as Promotion);
        if(firstPromotion !== secondPromotion){
            return promotionToValue(firstPromotion) - promotionToValue(secondPromotion);
        }
    } else if(firstIsPromotion && !secondIsPromotion){
        return -1
    } else if( !firstIsPromotion && secondIsPromotion) {
        return 1;
    }

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
