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
