import { Board } from "../board/Board";
import { MoveHistory } from "../movehistory/MoveHistory";

export interface Game {
    initialBoard: Board,
    moveHistory: MoveHistory
}