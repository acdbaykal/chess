import { Square } from "../square/Square";
import { Move } from "./Move";

export const createMove = (from: Square, to: Square):Move => ({from, to});

export const createMoveList = (start: Square) => (destinations: Square[]) =>
    destinations.map(dest => createMove(start, dest))