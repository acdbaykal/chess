import { Piece } from "../piece/Piece"
import { Square } from "../square/Square"
import { toString } from "../square/getters"
import { Board } from "./Board";
type BoardListEntry = [Square, Piece];
type BoardList = BoardListEntry[];


export const createBoardFromList = (list: BoardList): Board =>
    list.reduce((board:Board, entry: BoardListEntry) => {
        const [square, piece] = entry;
        board[toString(square)] = piece;
        return board;
    }, {});