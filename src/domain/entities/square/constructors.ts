import { Either, left, right } from "fp-ts/lib/Either";
import { Coordinate, Square } from "./Square";

export const createSquare = (lettAx: Coordinate, numAx:Coordinate): Square => ({
    letterAxis: lettAx,
    numericAxis: numAx
});

export const fromString = (str:String): Either<Error, Square> => {
    const split = str.split('/').map(Number) as Coordinate[];

    if(split.length === 2 && !isNaN(split[0]) && !isNaN(split[1])) {
        const square = createSquare(split[0], split[1]);
        return right<Error, Square>(square);
    }

    return left<Error, Square>(new Error(`Invalid argument recieved while attempting to create Square: Argument was ${str}`))
}
