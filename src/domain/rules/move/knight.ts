import { flow, pipe } from "fp-ts/lib/function";
import { Square } from "../../entities/square/Square";
import { toRight, toUpper, toLeft, toLower } from "../../entities/square/transitions";
import * as E from 'fp-ts/lib/Either';
import {map as mapArray, reduce} from 'ramda';
import { Move } from "../../entities/move/Move";
import { getOrUndefined } from "../../../lib/either";
import { createMove } from "../../entities/move/constructors";

const moveTransitions = [
    flow(toRight(2), E.chain(toUpper(1))),
    flow(toRight(2), E.chain(toLower(1))),
    flow(toLower(2), E.chain(toRight(1))),
    flow(toLower(2), E.chain(toLeft(1))),
    flow(toLeft(2), E.chain(toLower(1))),
    flow(toLeft(2), E.chain(toUpper(1))),
    flow(toUpper(2), E.chain(toLeft(1))),
    flow(toUpper(2), E.chain(toRight(1)))
]

export const getMoves = (position: Square): Move[] => 
    pipe(
        moveTransitions,
        mapArray(transition => transition(position)),
        reduce((moves: Move[], square: E.Either<Error, Square>) => {
            if(E.isRight(square)){
                const toSquare = getOrUndefined(square) as Square;
                moves.push(createMove(position, toSquare))
            }
            
            return moves;
        }, [])
    )