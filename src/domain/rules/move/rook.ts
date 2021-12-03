import { isRook } from "../../entities/piece/getters";
import { toLeft, toLower, toRight, toUpper } from "../../entities/square/transitions";
import { createDestinationGenerator, createGetLegalMoves } from "./helpers";

const destinationGenerators = [
    createDestinationGenerator(toUpper(1)),
    createDestinationGenerator(toLower(1)),
    createDestinationGenerator(toLeft(1)),
    createDestinationGenerator(toRight(1))
];

export const getLegalMoves = createGetLegalMoves(destinationGenerators, isRook);
