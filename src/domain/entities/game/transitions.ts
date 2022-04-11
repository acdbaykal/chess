import { append } from "ramda";
import { Game } from "./Game";
import { getMovesHistory } from "./getters";
import { Move } from "../move/Move";

export const addMove = (game:Game, move:Move): Game => {
    const movesList = getMovesHistory(game);
    return {
        ...game,
        moveHistory: append(move, movesList)
    };
}
