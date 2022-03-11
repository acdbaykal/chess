import { Square } from "../../entities/square/Square";
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { flow, pipe } from "fp-ts/lib/function";
import { getOrUndefined } from "../../../lib/either";
import { getPieceAt, getPieceColorAt, isOccupiedByColor } from "../../entities/board/getters";
import { includeWhile, IncludeWhileDecision } from "../../../lib/list";
import { reversePieceColor } from "../../entities/piece/transition";
import { Board } from "../../entities/board/Board";
import { applyTo, map as mapArray, flatten } from 'ramda';
import { getPieceColor, getPieceType, isBishop } from "../../entities/piece/getters";
import { createMoveList } from "../../entities/move/constructors";
import { Move } from "../../entities/move/Move";
import { Piece, PieceType } from "../../entities/piece/Piece";

type NextSquareFn = (sq:Square) => E.Either<Error, Square>;
type DestinationGenerator = (moveStart: Square) => Generator<Square, void, unknown>;

export const createDestinationGenerator = (getNextSquare: NextSquareFn) => {
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
};

const getDestinations = (destinationGenerators: DestinationGenerator[],  moveStart:Square): Square[][] => 
    pipe(
        destinationGenerators,
        mapArray(flow(
            applyTo(moveStart),
            iterator => Array.from(iterator)
        ))
    );

export const decideIfLegal = (board:Board, moveStart: Square) => (sq: Square): IncludeWhileDecision => pipe(
    getPieceColorAt(board, moveStart),
    O.map((pieceColor):IncludeWhileDecision => {
        const oppositePieceColor = reversePieceColor(pieceColor);
        if(isOccupiedByColor(pieceColor)(board, sq)) {
            return IncludeWhileDecision.STOP;
        } else if(isOccupiedByColor(oppositePieceColor)(board, sq)) {
            return pipe(
                getPieceAt(board, sq),
                O.map(getPieceType),
                O.map(pieceType => pieceType === PieceType.King),
                O.map((isKing) => isKing ? IncludeWhileDecision.STOP : IncludeWhileDecision.INCLUDE_LAST),
                O.getOrElse(():IncludeWhileDecision  => IncludeWhileDecision.INCLUDE)
            );
        } else {
            return IncludeWhileDecision.INCLUDE;
        }
    }),
    O.getOrElse(():IncludeWhileDecision => IncludeWhileDecision.INCLUDE)
);

export const createGetLegalMoves = 
(destinationGenerators: DestinationGenerator[], isOfType: (p:Piece) => boolean ) => 
    (board: Board, moveStart:Square): Move[] => 
        pipe(
            getPieceAt(board, moveStart),
            O.filter(isOfType),
            O.map(() => getDestinations(destinationGenerators, moveStart)),
            O.map(mapArray(includeWhile(decideIfLegal(board, moveStart)))),
            O.map(flatten),
            O.map(createMoveList(moveStart)),
            O.getOrElse<Move[]>(() => [])
        );
