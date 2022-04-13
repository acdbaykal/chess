export enum AlphabeticCoordinate {
    A = 0,
    B = 1,
    C = 2,
    D = 3,
    E = 4,
    F = 5,
    G = 6,
    H = 7
}

export enum NumericCoordinate {
    _1 = 0,
    _2 = 1,
    _3 = 2,
    _4 = 3,
    _5 = 4,
    _6 = 5,
    _7 = 6,
    _8 = 7
}

export const 
    A = AlphabeticCoordinate.A,
    B = AlphabeticCoordinate.B,
    C = AlphabeticCoordinate.C,
    D = AlphabeticCoordinate.D,
    E = AlphabeticCoordinate.E,
    F = AlphabeticCoordinate.F,
    G = AlphabeticCoordinate.G,
    H = AlphabeticCoordinate.H;

export const 
    _1 = NumericCoordinate._1,
    _2 = NumericCoordinate._2,
    _3 = NumericCoordinate._3,
    _4 = NumericCoordinate._4,
    _5 = NumericCoordinate._5,
    _6 = NumericCoordinate._6,
    _7 = NumericCoordinate._7,
    _8 = NumericCoordinate._8;

export interface Square {
    file: AlphabeticCoordinate,
    rank: NumericCoordinate
}
