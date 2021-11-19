import { append } from "ramda";
import { Game } from "./Game";
import { getMoves } from "./getters";
import { Move } from "../move/Move";

export const addMove = (game:Game, move:Move): Game => {
    const movesList = getMoves(game);
    return {
        ...game,
        moves: append(move, movesList)
    };
}
