import { makeListImmutable } from "../../../lib/immutable-js";
import { Move } from "../move/Move";

export const createMoveHistory = (moves: Move[]) => makeListImmutable(moves);
export const EMPTY_MOVE_HISTORY = createMoveHistory([]);
