import { Board } from "../board/Board";
import { Move } from "../move/Move";

export const createGame = (initialBoard: Board, moves: Move[]) => ({
    initialBoard,
    moves
});