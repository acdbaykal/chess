import { Square, _1 } from "../../entities/square/Square";
import { flow, pipe } from "fp-ts/lib/function";
import { getPieceAt, getPieceColorAt, isOccupiedByColor } from "../../entities/board/getters";
import { includeWhile, IncludeWhileDecision } from "../../../lib/list";
import { reversePieceColor } from "../../entities/piece/transition";
import { Board } from "../../entities/board/Board";
import { applyTo, map as mapArray, flatten } from 'ramda';
import { createMoveList } from "../../entities/move/constructors";
import { Move } from "../../entities/move/Move";
import { Piece } from "../../entities/piece/Piece";
import { Game } from "../../entities/game/Game";
import { getCurrentBoard } from "../../entities/game/getters";
import { logLeft } from "../../../lib/either";
import { defaultTo, filterNullable, fromEither, isNull, mapNullable, Nullable, pipeUntilNull, pipeWithFallback } from "../../../lib/nullable";

type NextSquareFn = (sq:Square) => Nullable<Square>;
type DestinationGenerator = (moveStart: Square) => Generator<Square, void, unknown>;

export const createDestinationGenerator = (getNextSquare: NextSquareFn) => {
    return function*(moveStart: Square) {
        let currentMove = moveStart as Nullable<Square>;
        
        while(true){
            currentMove = pipe(
                currentMove,
                mapNullable(getNextSquare)
            );

            if (isNull(currentMove)) {
                break;
            }
           
            yield currentMove;
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

export const decideIfLegal = (board:Board, moveStart: Square) => (sq: Square): IncludeWhileDecision => pipeWithFallback(
    () => IncludeWhileDecision.INCLUDE,
    getPieceColorAt(board, moveStart),
    (pieceColor):IncludeWhileDecision => {
        const oppositePieceColor = reversePieceColor(pieceColor);
        if(isOccupiedByColor(pieceColor)(board, sq)) {
            return IncludeWhileDecision.STOP;
        } else if(isOccupiedByColor(oppositePieceColor)(board, sq)) {
            return IncludeWhileDecision.INCLUDE_LAST;
        } else {
            return IncludeWhileDecision.INCLUDE;
        }
    }
);

export const createGetLegalMoves = 
(destinationGenerators: DestinationGenerator[], isOfType: (p:Piece) => boolean ) => 
    (game: Game, moveStart:Square): Move[] => 
        pipe(
            getCurrentBoard(game),
            logLeft,
            board => fromEither(board),
            mapNullable(
                board => pipeUntilNull(
                    getPieceAt(board, moveStart),
                    filterNullable(isOfType),
                    () => getDestinations(destinationGenerators, moveStart),
                    mapArray(includeWhile(decideIfLegal(board, moveStart))),
                    flatten,
                    createMoveList(moveStart)
                )
            ),
            defaultTo(() => [] as Move[])
        );
