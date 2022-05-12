import { getMoveFrom, getMoveTo } from "./getters";
import { Move } from "./Move";

export const moveToString = (move:Move): string =>
   [getMoveFrom(move), getMoveTo(move)]
    .map(toString)
    .join(' ﹣> ');
    