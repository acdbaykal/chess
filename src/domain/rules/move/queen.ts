import { isQueen } from "../../entities/piece/getters";
import { toBottomLeft, toBottomRight, toLeft, toLower, toRight, toUpLeft, toUpper, toUpRight } from "../../entities/square/transitions";
import { createDestinationGenerator, createGetLegalMoves } from "./helpers";

const destinationGenerators = [
    createDestinationGenerator(toUpper(1)),
    createDestinationGenerator(toLower(1)),
    createDestinationGenerator(toLeft(1)),
    createDestinationGenerator(toRight(1)),
    createDestinationGenerator(toUpRight),
    createDestinationGenerator(toUpLeft),
    createDestinationGenerator(toBottomLeft),
    createDestinationGenerator(toBottomRight),
];


export const getLegalMoves = createGetLegalMoves(destinationGenerators, isQueen);
