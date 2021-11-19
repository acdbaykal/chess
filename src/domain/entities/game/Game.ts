import { Board } from "../board/Board";
import { Move } from "../move/Move";

export interface Game {
    initialBoard: Board,
    moves: Move[]

}