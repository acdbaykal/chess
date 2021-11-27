import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { createSquare } from "./constructors";
import { getLetterAxis, getNumericAxis } from "./getters";
import { A, Coordinate, H, Square, _1, _8 } from "./Square";

const createOutOfBoardError = () => E.left(Error("Square is outside of board"));

export const toRight = (amount:number) => (sq:Square): E.Either<Error, Square> =>
    pipe(
        getLetterAxis(sq),
        nun => nun + amount,
        newNum => newNum > H ? createOutOfBoardError() : E.right(newNum as Coordinate),
        E.map(letterAxis => createSquare(letterAxis, getNumericAxis(sq)))
    )

export const toLeft = (amount:number) => (sq:Square): E.Either<Error, Square> =>
    pipe(
        getLetterAxis(sq),
        nun => nun - amount,
        newNum => newNum < A ? createOutOfBoardError() : E.right(newNum as Coordinate),
        E.map(letterAxis => createSquare(letterAxis, getNumericAxis(sq)))
    )

export const toUpper = (amount:number) => (sq:Square): E.Either<Error, Square> =>
    pipe(
        getNumericAxis(sq),
        nun => nun + amount,
        newNum => newNum > _8 ? createOutOfBoardError() : E.right(newNum as Coordinate),
        E.map(numAxis => createSquare(getLetterAxis(sq), numAxis))
    )

export const toLower = (amount:number) => (sq:Square): E.Either<Error, Square> =>
    pipe(
        getNumericAxis(sq),
        nun => nun - amount,
        newNum => newNum < _1 ? createOutOfBoardError() : E.right(newNum as Coordinate),
        E.map(numAxis => createSquare(getLetterAxis(sq), numAxis))
    )