import { _1, _2, _3, _4, _5, _6, _7, _8, A, B, C, D, E, F, G, H, AlphabeticCoordinate, NumericCoordinate, Square } from "./Square";
    
export const getFile = (s:Square) => s.file;
export const getRank = (s:Square) => s.rank;


const getLetterString = (file: AlphabeticCoordinate): string => {
    switch(file) {
        case A: return 'A'
        case B: return 'B'
        case C: return 'C'
        case D: return 'D'
        case E: return 'E'
        case F: return 'F'
        case G : return 'G'
        case H : return 'H'
        default: return `unknown file value ${file}!!`
    }
};

const getNumericString = (rank: NumericCoordinate): string => {
    switch(rank) {
        case _1: return '1'
        case _2: return '2'
        case _3: return '3'
        case _4: return '4'
        case _5: return '5'
        case _6: return '6'
        case _7 : return '7'
        case _8 : return '8'
        default: return `unknown rank vakue ${rank}!!`
    }
};

export const toString = (s: Square) => `${getLetterString(s.file)}${getNumericString(s.rank)}`;
export const squareEquals = (s1: Square) => (s2: Square) =>
    getFile(s1) ===  getFile(s2) && getRank(s1) === getRank(s2);


const numericCoordOrder = [_1, _2, _3, _4, _5, _6, _7, _8];   
const alphabeticCoordOrder = [A, B, C, D, E, F, G, H];

const getFileIndex = (sq: Square) => alphabeticCoordOrder.indexOf(getFile(sq));

/** is a square positionad at the right of another from white's perspactive  */
export const isRightOf = (reference: Square) => (subject: Square): boolean =>
    getFileIndex(reference) < getFileIndex(subject);
    
/** is a square positionad at the left of another from white's perspective  */
export const isLeftOf = (reference: Square) => (subject: Square): boolean => 
    getFileIndex(reference) > getFileIndex(subject);

const getRowIndex = (sq: Square) => numericCoordOrder.indexOf(getRank(sq));

/** is a squre posined futher away from the white player then the reference*/
export const isUpOf = (reference: Square) => (subject: Square): boolean => 
    getRowIndex(reference) < getRowIndex(reference);

const fileTonumber = (file: AlphabeticCoordinate) =>
    alphabeticCoordOrder.indexOf(file) + 1;

const rankToNumber = (rank:NumericCoordinate) =>
    numericCoordOrder.indexOf(rank) + 1;

export const squareToNumber = (sq:Square) => {
    const file = getFile(sq);
    const rank = getRank(sq);
    return fileTonumber(file) * 10 + rankToNumber(rank);
}
