import { Either, left, right } from "fp-ts/lib/Either";

export const 
    A = 0,
    B = 1,
    C = 2,
    D = 3,
    E = 4,
    F = 5,
    G = 6,
    H = 7;

export const 
    _1 = 0,
    _2 = 1,
    _3 = 2,
    _4 = 3,
    _5 = 4,
    _6 = 5,
    _7 = 6,
    _8 = 7;

export type Coordinate = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7; 

export interface Square {
    letterAxis: Coordinate,
    numericAxis: Coordinate
}

export const createSquare = (lettAx: Coordinate, numAx:Coordinate): Square => ({
    letterAxis: lettAx,
    numericAxis: numAx
});

export const fromString = (str:String): Either<Error, Square> => {
    const split = str.split('/').map(parseInt) as Coordinate[];

    if(split.length === 2 && !isNaN(split[0]) && !isNaN(split[1])) {
        const square = createSquare(split[0], split[1]);
        return right<Error, Square>(square);
    }

    return left<Error, Square>(new Error(`Invalid argument recieved while attempting to create Square: Argument was ${str}`))
}
