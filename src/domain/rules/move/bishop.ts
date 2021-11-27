import { Move } from "../../entities/move/Move";
import { Square } from "../../entities/square/Square";
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { flow, pipe } from "fp-ts/lib/function";
import { toBottomLeft, toBottomRight, toUpLeft, toUpRight } from "../../entities/square/transitions";
import { applyTo, map as mapArray, flatten } from 'ramda';
import { getOrUndefined } from "../../../lib/either";
import { createMoveList } from "../../entities/move/constructors";
import { getPieceAt, getPieceColorAt, isOccupiedByColor } from "../../entities/board/getters";
import { Board } from "../../entities/board/Board";
import { includeWhile, IncludeWhileDecision } from "../../../lib/list";
import { reversePieceColor } from "../../entities/piece/transition";
import { isBishop } from "../../entities/piece/getters";

type NextSquareFn = (sq:Square) => E.Either<Error, Square>;

const createDestinationGenerator = (getNextSquare: NextSquareFn) => {
    return function*(moveStart: Square) {
        let currentMove = E.right<Error, Square>(moveStart);
        
        while(true){
            currentMove = pipe(
                currentMove,
                E.chain(getNextSquare)
            );

            if(E.isLeft(currentMove)) {
                break;
            }
           
            yield getOrUndefined(currentMove) as Square;
        };
    }
}

const destinationGenerators = [
    createDestinationGenerator(toUpRight),
    createDestinationGenerator(toUpLeft),
    createDestinationGenerator(toBottomLeft),
    createDestinationGenerator(toBottomRight)
];

const getDestinations = (moveStart:Square): Square[][] => 
    pipe(
        destinationGenerators,
        mapArray(flow(
            applyTo(moveStart),
            iterator => Array.from(iterator)
        ))
    );


const decideIfLegal = (board:Board, moveStart: Square) => (sq: Square): IncludeWhileDecision => pipe(
    getPieceColorAt(board, moveStart),
    O.map((pieceColor):IncludeWhileDecision => {
        const oppositePieceColor = reversePieceColor(pieceColor);
        if(isOccupiedByColor(pieceColor)(board, sq)) {
            return IncludeWhileDecision.STOP;
        } else if(isOccupiedByColor(oppositePieceColor)(board, sq)) {
            return IncludeWhileDecision.INCLUDE_LAST;
        } else {
            return IncludeWhileDecision.INCLUDE;
        }
    }),
    O.getOrElse(():IncludeWhileDecision => IncludeWhileDecision.INCLUDE)
)


export const getLegalMoves = (board: Board, moveStart:Square): Move[] => 
    pipe(
        getPieceAt(board, moveStart),
        O.filter(isBishop),
        O.map(() => getDestinations(moveStart)),
        O.map(mapArray(includeWhile(decideIfLegal(board, moveStart)))),
        O.map(flatten),
        O.map(createMoveList(moveStart)),
        O.getOrElse<Move[]>(() => [])
    );