import { _1, _2, _3, _4, _5, _6, _7, _8, A, B, C, D, E, F, G, H, Coordinate, Square } from "./Square";


export const getLetterAxis = (s:Square) => s.letterAxis;
export const getNumericAxis = (s:Square) => s.numericAxis;


const getLetterString = (letterAxis: Coordinate): string => {
    switch(letterAxis) {
        case A: return 'A'
        case B: return 'B'
        case C: return 'C'
        case D: return 'D'
        case E: return 'E'
        case F: return 'F'
        case G : return 'G'
        case H : return 'H'
        default: return `unknown value ${letterAxis}!!`
    }
};

const getNumericString = (numericAxis: Coordinate): string => {
    switch(numericAxis) {
        case _1: return '1'
        case _2: return '2'
        case _3: return '3'
        case _4: return '4'
        case _5: return '5'
        case _6: return '6'
        case _7 : return '7'
        case _8 : return '8'
        default: return `unknown value ${numericAxis}!!`
    }
};

export const toString = (s: Square) => `${getLetterString(s.letterAxis)}${getNumericString(s.numericAxis)}`;
export const squareEquals = (s1: Square) => (s2: Square) =>
    getLetterAxis(s1) ===  getLetterAxis(s2) && getNumericAxis(s1) === getNumericAxis(s2);

/** is a square positionad at the right of another from white's perspactive  */
export const isRightOf = (reference: Square) => (subject: Square): boolean => 
    getLetterAxis(reference) < getLetterAxis(subject);

/** is a square positionad at the left of another from white's perspective  */
export const isLeftOf = (reference: Square) => (subject: Square): boolean => 
    getLetterAxis(reference) > getLetterAxis(subject);

/** is a squre posined futher away from the white player then the reference*/
export const isUpOf = (reference: Square) => (subject: Square): boolean => 
    getNumericAxis(reference) < getNumericAxis(subject);