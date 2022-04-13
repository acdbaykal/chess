import { flow, pipe } from "fp-ts/lib/function";
import { chain as chainOption , Option, map as mapOption, none, some } from "fp-ts/lib/Option";
import { cond, equals, range } from "ramda";
import { createSquare } from "./constructors";
import { getFile, getRank } from "./getters";
import { A, AlphabeticCoordinate, NumericCoordinate, H, Square, _1, _8, B, C, D, E, F, G, _2, _3, _4, _5, _6, _7 } from "./Square";

const toSingleRight = (sq:Square) => pipe(
    getFile(sq),
    cond<AlphabeticCoordinate, Option<AlphabeticCoordinate>>([
        [equals<AlphabeticCoordinate>(A), () => some(B)],
        [equals<AlphabeticCoordinate>(B), () => some(C)],
        [equals<AlphabeticCoordinate>(C), () => some(D)],
        [equals<AlphabeticCoordinate>(D), () => some(E)],
        [equals<AlphabeticCoordinate>(E), () => some(F)],
        [equals<AlphabeticCoordinate>(F), () => some(G)],
        [equals<AlphabeticCoordinate>(G), () => some(H)],
        [equals<AlphabeticCoordinate>(H), () => none]
    ]),
    mapOption(aplhCoord => createSquare(aplhCoord, getRank(sq)))
); 

const toSingleLeft = (sq:Square) => pipe(
    getFile(sq),
    cond<AlphabeticCoordinate, Option<AlphabeticCoordinate>>([
        [equals<AlphabeticCoordinate>(H), () => some(G)],
        [equals<AlphabeticCoordinate>(G), () => some(F)],
        [equals<AlphabeticCoordinate>(F), () => some(E)],
        [equals<AlphabeticCoordinate>(E), () => some(D)],
        [equals<AlphabeticCoordinate>(D), () => some(C)],
        [equals<AlphabeticCoordinate>(C), () => some(B)],
        [equals<AlphabeticCoordinate>(B), () => some(A)],
        [equals<AlphabeticCoordinate>(A), () => none]
    ]),
    mapOption(aplhCoord => createSquare(aplhCoord, getRank(sq)))
); 

const toSingleUpper = (sq:Square) => pipe(
    getRank(sq),
    cond<NumericCoordinate, Option<NumericCoordinate>>([
        [equals<NumericCoordinate>(_1), () => some(_2)],
        [equals<NumericCoordinate>(_2), () => some(_3)],
        [equals<NumericCoordinate>(_3), () => some(_4)],
        [equals<NumericCoordinate>(_4), () => some(_5)],
        [equals<NumericCoordinate>(_5), () => some(_6)],
        [equals<NumericCoordinate>(_6), () => some(_7)],
        [equals<NumericCoordinate>(_7), () => some(_8)],
        [equals<NumericCoordinate>(_8), () => none]
    ]),
    mapOption(numCoord => createSquare(getFile(sq), numCoord))
); 

const toSingleLower = (sq:Square) => pipe(
    getRank(sq),
    cond<NumericCoordinate, Option<NumericCoordinate>>([
        [equals<NumericCoordinate>(_8), () => some(_7)],
        [equals<NumericCoordinate>(_7), () => some(_6)],
        [equals<NumericCoordinate>(_6), () => some(_5)],
        [equals<NumericCoordinate>(_5), () => some(_4)],
        [equals<NumericCoordinate>(_4), () => some(_3)],
        [equals<NumericCoordinate>(_3), () => some(_2)],
        [equals<NumericCoordinate>(_2), () => some(_1)],
        [equals<NumericCoordinate>(_1), () => none]
    ]),
    mapOption(numCoord => createSquare(getFile(sq), numCoord))
);

type MoveAmount = 1 | 2 | 3 | 4 | 5 | 6 | 7;

const moveTo = (moveSingleStep: (s:Square) => Option<Square>) => (amount: MoveAmount) => (sq: Square): Option<Square> =>
    range(0, amount).reduce(chainOption(moveSingleStep), some(sq));

export const toRight = moveTo(toSingleRight);
export const toLeft = moveTo(toSingleLeft);
export const toUpper = moveTo(toSingleUpper);
export const toLower = moveTo(toSingleLower);

export const toUpRight = flow(
    toSingleUpper,
    chainOption(toSingleRight)
);

export const toUpLeft = flow(
    toSingleUpper,
    chainOption(toSingleLeft)
);

export const toBottomRight = flow(
    toSingleLower,
    chainOption(toSingleRight)
);

export const toBottomLeft = flow(
    toSingleLower,
    chainOption(toSingleLeft)
);
