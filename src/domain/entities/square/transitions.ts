import { flow, pipe } from "fp-ts/lib/function";
import { chain as chainOption , Option, map as mapOption, none, some } from "fp-ts/lib/Option";
import { createSquare } from "./constructors";
import { getFile, getRank } from "./getters";
import { A, AlphabeticCoordinate, NumericCoordinate, H, Square, _1, _8 } from "./Square";

export const toRight = (amount:number) => (sq:Square): Option<Square> =>
    pipe(
        getFile(sq),
        nun => nun + amount,
        newNum => newNum > H ? none : some(newNum as AlphabeticCoordinate),
        mapOption(letterAxis => createSquare(letterAxis, getRank(sq)))
    )

export const toLeft = (amount:number) => (sq:Square): Option<Square> =>
    pipe(
        getFile(sq),
        nun => nun - amount,
        newNum => newNum < A ? none : some(newNum as AlphabeticCoordinate),
        mapOption(letterAxis => createSquare(letterAxis, getRank(sq)))
    )

export const toUpper = (amount:number) => (sq:Square): Option<Square> =>
    pipe(
        getRank(sq),
        nun => nun + amount,
        newNum => newNum > _8 ? none : some(newNum as NumericCoordinate),
        mapOption(numAxis => createSquare(getFile(sq), numAxis))
    )

export const toLower = (amount:number) => (sq:Square): Option<Square> =>
    pipe(
        getRank(sq),
        nun => nun - amount,
        newNum => newNum < _1 ? none : some(newNum as NumericCoordinate),
        mapOption(numAxis => createSquare(getFile(sq), numAxis))
    )

export const toUpRight = flow(
    toUpper(1),
    chainOption(toRight(1))
);

export const toUpLeft = flow(
    toUpper(1),
    chainOption(toLeft(1))
);

export const toBottomRight = flow(
    toLower(1),
    chainOption(toRight(1))
);

export const toBottomLeft = flow(
    toLower(1),
    chainOption(toLeft(1))
);
