import { Board } from "./Board";
import { Move } from "./Move";

export interface Game {
    initialBoard: Board,
    moves: Move[]

}