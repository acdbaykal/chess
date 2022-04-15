import { Square, _1 } from "../../entities/square/Square";
import * as O from 'fp-ts/Option';
import { flow, pipe } from "fp-ts/lib/function";
import { getOrUndefined } from "../../../lib/option";
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

type NextSquareFn = (sq:Square) => O.Option<Square>;
type DestinationGenerator = (moveStart: Square) => Generator<Square, void, unknown>;

export const createDestinationGenerator = (getNextSquare: NextSquareFn) => {
    return function*(moveStart: Square) {
        let currentMove = O.some<Square>(moveStart);
        
        while(true){
            currentMove = pipe(
                currentMove,
                O.chain(getNextSquare)
            );

            if (O.isNone(currentMove)) {
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
            return IncludeWhileDecision.INCLUDE_LAST;
        } else {
            return IncludeWhileDecision.INCLUDE;
        }
    }),
    O.getOrElse(():IncludeWhileDecision => IncludeWhileDecision.INCLUDE)
);

export const createGetLegalMoves = 
(destinationGenerators: DestinationGenerator[], isOfType: (p:Piece) => boolean ) => 
    (game: Game, moveStart:Square): Move[] => 
        pipe(
            getCurrentBoard(game),
            logLeft,
            O.fromEither,
            O.chain(
                board => pipe(
                    getPieceAt(board, moveStart),
                    O.filter(isOfType),
                    O.map(() => getDestinations(destinationGenerators, moveStart)),
                    O.map(mapArray(includeWhile(decideIfLegal(board, moveStart)))),
                    O.map(flatten),
                    O.map(createMoveList(moveStart))
                )
            ),
            O.getOrElse<Move[]>(() => [])
        );
