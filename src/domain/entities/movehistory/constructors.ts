import { makeListImmutable } from "../../../lib/immutable-js";
import { Move } from "../move/Move";


export const createMoveHistory = (moves: Move[]) => makeListImmutable(moves);
