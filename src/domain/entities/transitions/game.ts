import { append } from "ramda";
import { Game } from "../Game";
import { getMoves } from "../getters/game";
import { Move } from "../Move";

export const addMove = (game:Game, move:Move): Game => {
    const movesList = getMoves(game);
    return {
        ...game,
        moves: append(move, movesList)
    };
}
