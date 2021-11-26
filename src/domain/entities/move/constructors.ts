import { Square } from "../square/Square";
import { Move } from "./Move";

export const createMove = (from: Square, to: Square):Move => ({from, to});