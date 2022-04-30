import { map, sort } from "ramda";
import { PieceType } from "../piece/Piece";
import { squareToNumber, toString } from "../square/getters";
import { createPromotion } from "./constructors";
import { getMoveFrom, getMoveTo, getPromotionPieceType, isPromotionMove } from "./getters";
import { Move, Promotion, RegularMove } from "./Move";
import { pipe } from "fp-ts/lib/function";
import { pieceTypeToNumber } from "../piece/getters";

const map2 = <P, R>(mapFunc : (param:P) => R) => (list: P[][]):R[][] => pipe(list, map(map(mapFunc)));

const compareMoveGeneric = (move1: Move, move2:Move): number => 
    pipe(
        [move1, move2],
        map(move => [getMoveFrom(move), getMoveTo(move)]),
        map2(squareToNumber),
        map(([start, destination]) => start * 100 + destination),
        ([sum1, sum2]) => sum1 - sum2
    );

const calcPromotionScore = (move:Move) => {
    if(!isPromotionMove(move)) {
        return 0;
    }

    return pipe(
        move,
        getPromotionPieceType,
        pieceTypeToNumber
    );   
}

const sortFn = (move1: Move, move2: Move):number => {
    const genericDiff = compareMoveGeneric(move1, move2);

    if(genericDiff !== 0) {
        return genericDiff;
    }

    const promotionScore1 = calcPromotionScore(move1);
    const promotionScore2 = calcPromotionScore(move2);

    return promotionScore1 - promotionScore2;
};

export const sortMoveList = sort(sortFn);

export const mapIntoPromotions = (base: RegularMove): Promotion[] =>
    [
        PieceType.Knight,
        PieceType.Bishop,
        PieceType.Queen,
        PieceType.Rook
    ].map(pieceType => createPromotion(base.from, base.to, pieceType));


export const moveToString = (move:Move): string =>
   [getMoveFrom(move), getMoveTo(move)]
    .map(toString)
    .join(' ﹣> ');
