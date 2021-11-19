export type Coordinate = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7; 

export interface Square {
    letterAxis: Coordinate,
    numericAxis: Coordinate
}
