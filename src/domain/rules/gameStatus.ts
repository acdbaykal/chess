import { pipe } from "fp-ts/lib/function";
import { getOrThrow } from "../../lib/either";
import { Board } from "../entities/board/Board";
import { getPiecesOfColor } from "../entities/board/transitions";
import { Game } from "../entities/game/Game"
import { getActivePlayer, getCurrentBoard } from "../entities/game/getters";
import { GameStatus } from "../entities/gameStatus/GameStatus";
import { PieceColor } from "../entities/piece/Piece";
import { isInCheck } from "./check";
import { calcAllPossibleMoves } from "./move/allPossible";


const hasAnyMovesAvailable = (game: Game, board: Board, activePlayer: PieceColor) => {
    return getPiecesOfColor(activePlayer)(board)
        .some(
            ([square]) => {
                const pieceMoves = calcAllPossibleMoves(game, square);
                return pieceMoves.length > 0;
            }
        )
}

const determineOnlyGameStatus = (game: Game, color: PieceColor): GameStatus => {
    const inCheck = isInCheck(game, color);

    const board = pipe (
        getCurrentBoard(game),
        getOrThrow(err => err)
    );

    if(!inCheck){
        return hasAnyMovesAvailable(game, board, color)
            ? GameStatus.Ongoing
            : GameStatus.Remi;
    } else {
        const isNotChekmate = hasAnyMovesAvailable(game, board, color);

        return isNotChekmate
            ? GameStatus.InCheck
            : GameStatus.Checkmate;
    }
};


export const determineGameStatus = (game: Game) => {
    const color = getActivePlayer(game);
    return [determineOnlyGameStatus(game, color), color];
};