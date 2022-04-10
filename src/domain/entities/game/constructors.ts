import { Board } from "../board/Board";
import { MoveHistory } from "../movehistory/MoveHistory";

export const createGame = (initialBoard: Board, moveHistory: MoveHistory) => ({
    initialBoard,
    moveHistory
});