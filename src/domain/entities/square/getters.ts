import { setPiece } from "../board/transitions";
import { Square } from "./Square";


export const getLetterAxis = (s:Square) => s.letterAxis;
export const getNumericAxis = (s:Square) => s.numericAxis;

export const toString = (s: Square) => `${s.letterAxis}/${s.numericAxis}`;
export const squareEquals = (s1: Square) => (s2: Square) =>
    getLetterAxis(s1) ===  getLetterAxis(s2) && getNumericAxis(s1) === getNumericAxis(s2);

/** is a square positionad at the right of another from white's perspactive  */
export const isRightOf = (reference: Square) => (subject: Square): boolean => 
    getLetterAxis(reference) > getLetterAxis(subject);

/** is a square positionad at the left of another from white's perspactive  */
export const isLeftOf = (reference: Square) => (subject: Square): boolean => 
    getLetterAxis(reference) < getLetterAxis(subject);