import { Either, left, right } from "fp-ts/lib/Either";
import { A, Coordinate, Square, _1 } from "./Square";
import {Record} from 'immutable';

const SquareFactory = Record<Square>({
    letterAxis: A,
    numericAxis: _1
})


export const createSquare = (lettAx: Coordinate, numAx:Coordinate): Square => 
    SquareFactory({
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
