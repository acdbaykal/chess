import { Either, left, right, map as mapEither } from "fp-ts/lib/Either";
import { _1, _2, _3, _4, _5, _6, _7, _8, A, B, C, D, E, F, G, H, AlphabeticCoordinate, NumericCoordinate, Square } from "./Square";
import {Record} from 'immutable';
import { pipe } from "fp-ts/lib/function";
import { combineEither } from "../../../lib/either";
import { map } from "fp-ts/lib/Separated";

const SquareFactory = Record<Square>({
    file: A,
    rank: _1
})


export const createSquare = (lettAx: AlphabeticCoordinate, numAx:NumericCoordinate): Square => 
    SquareFactory({
        file: lettAx,
        rank: numAx
    });



const getLetterAxis = (str: String):Either<Error, AlphabeticCoordinate> => {
    switch(str) {
        case 'A': return right(A)
        case 'B': return right(B)
        case 'C': return right(C)
        case 'D': return right(D)
        case 'E': return right(E)
        case 'F': return right(F)
        case 'G' : return right(G)
        case 'H' : return right(H)
        default: return left(Error(`unexpected value for letter axis: ${str}`))
    }
};

const getNumericAxis = (str: String):Either<Error, NumericCoordinate> => {
    switch(str) {
        case '1': return right(_1)
        case '2': return right(_2)
        case '3': return right(_3)
        case '4': return right(_4)
        case '5': return right(_5)
        case '6': return right(_6)
        case '7' : return right(_7)
        case '8' : return right(_8)
        default: return left(Error(`unexpected value for numeric axis: ${str}`))
    }
}

export const fromString = (str:String): Either<Error, Square> => {
    const [letterStr, numericStr] = str.split('');
    const letterAxis = getLetterAxis(letterStr);
    const numericAxis = getNumericAxis(numericStr);

    return pipe(
        combineEither(letterAxis, numericAxis),
        mapEither(([letter, digit]) => createSquare(letter, digit))
    );
}
