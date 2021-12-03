import { toBottomLeft, toBottomRight, toUpLeft, toUpRight } from "../../entities/square/transitions";
import { createDestinationGenerator, createGetLegalMoves } from "./helpers";

const destinationGenerators = [
    createDestinationGenerator(toUpRight),
    createDestinationGenerator(toUpLeft),
    createDestinationGenerator(toBottomLeft),
    createDestinationGenerator(toBottomRight)
];

export const getLegalMoves = createGetLegalMoves(destinationGenerators)
