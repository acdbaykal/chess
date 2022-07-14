
import { flow, pipe } from "fp-ts/lib/function";
import { cond, equals, filter, range, map } from "ramda";
import { isNotNull, mapNullable, Nullable } from "../../../lib/nullable";
import { createSquare } from "./constructors";
import { getFile, getRank } from "./getters";
import { A, AlphabeticCoordinate, NumericCoordinate, H, Square, _1, _8, B, C, D, E, F, G, _2, _3, _4, _5, _6, _7 } from "./Square";

const toSingleRight = (sq:Square) => pipe(
    getFile(sq),
    cond<AlphabeticCoordinate, Nullable<AlphabeticCoordinate>>([
        [equals<AlphabeticCoordinate>(A), () => B],
        [equals<AlphabeticCoordinate>(B), () => C],
        [equals<AlphabeticCoordinate>(C), () => D],
        [equals<AlphabeticCoordinate>(D), () => E],
        [equals<AlphabeticCoordinate>(E), () => F],
        [equals<AlphabeticCoordinate>(F), () => G],
        [equals<AlphabeticCoordinate>(G), () => H],
        [equals<AlphabeticCoordinate>(H), () => undefined]
    ]),
    mapNullable(aplhCoord => createSquare(aplhCoord, getRank(sq)))
); 

const toSingleLeft = (sq:Square) => pipe(
    getFile(sq),
    cond<AlphabeticCoordinate, Nullable<AlphabeticCoordinate>>([
        [equals<AlphabeticCoordinate>(H), () => G],
        [equals<AlphabeticCoordinate>(G), () => F],
        [equals<AlphabeticCoordinate>(F), () => E],
        [equals<AlphabeticCoordinate>(E), () => D],
        [equals<AlphabeticCoordinate>(D), () => C],
        [equals<AlphabeticCoordinate>(C), () => B],
        [equals<AlphabeticCoordinate>(B), () => A],
        [equals<AlphabeticCoordinate>(A), () => undefined]
    ]),
    mapNullable(aplhCoord => createSquare(aplhCoord, getRank(sq)))
); 

const toSingleUpper = (sq:Square) => pipe(
    getRank(sq),
    cond<NumericCoordinate, Nullable<NumericCoordinate>>([
        [equals<NumericCoordinate>(_1), () => _2],
        [equals<NumericCoordinate>(_2), () => _3],
        [equals<NumericCoordinate>(_3), () => _4],
        [equals<NumericCoordinate>(_4), () => _5],
        [equals<NumericCoordinate>(_5), () => _6],
        [equals<NumericCoordinate>(_6), () => _7],
        [equals<NumericCoordinate>(_7), () => _8],
        [equals<NumericCoordinate>(_8), () => undefined]
    ]),
    mapNullable(numCoord => createSquare(getFile(sq), numCoord))
); 

const toSingleLower = (sq:Square) => pipe(
    getRank(sq),
    cond<NumericCoordinate, Nullable<NumericCoordinate>>([
        [equals<NumericCoordinate>(_8), () => _7],
        [equals<NumericCoordinate>(_7), () => _6],
        [equals<NumericCoordinate>(_6), () => _5],
        [equals<NumericCoordinate>(_5), () => _4],
        [equals<NumericCoordinate>(_4), () => _3],
        [equals<NumericCoordinate>(_3), () => _2],
        [equals<NumericCoordinate>(_2), () => _1],
        [equals<NumericCoordinate>(_1), () => undefined]
    ]),
    mapNullable(numCoord => createSquare(getFile(sq), numCoord))
);

export type MoveAmount = 1 | 2 | 3 | 4 | 5 | 6 | 7;

type MoveSingleStepFn = (s:Square) => Nullable<Square>;


const moveTo = (moveSingleStep: MoveSingleStepFn) => (amount: MoveAmount) => (sq: Square): Nullable<Square> =>
    range(0, amount).reduce((acc) => mapNullable(moveSingleStep)(acc), sq as Nullable<Square>)

export const toRight = moveTo(toSingleRight);
export const toLeft = moveTo(toSingleLeft);
export const toUpper = moveTo(toSingleUpper);
export const toLower = moveTo(toSingleLower);

export const toUpRight = flow(
    toSingleUpper,
    mapNullable(toSingleRight)
);

export const toUpLeft = flow(
    toSingleUpper,
    mapNullable(toSingleLeft)
);

export const toBottomRight = flow(
    toSingleLower,
    mapNullable(toSingleRight)
);

export const toBottomLeft = flow(
    toSingleLower,
    mapNullable(toSingleLeft)
);

const NeighborFunctions = [
    toSingleLeft,
    toSingleRight,
    toSingleUpper,
    toSingleLower,
    toUpRight,
    toUpLeft,
    toBottomRight,
    toBottomLeft
];

export const calcNeighbors = (square: Square): Square[] => 
    pipe(
        NeighborFunctions,
        map(fn => fn(square)),
        filter<Nullable<Square>>(isNotNull),
    ) as Square[];
