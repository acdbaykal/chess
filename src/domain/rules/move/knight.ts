import { flow, pipe } from "fp-ts/lib/function";
import { Square } from "../../entities/square/Square";
import { toRight, toUpper, toLeft, toLower } from "../../entities/square/transitions";
import * as E from 'fp-ts/lib/Either';
import {filter as filterArray, map as mapArray, reduce} from 'ramda';
import { Move } from "../../entities/move/Move";
import { getOrUndefined } from "../../../lib/either";
import { createRegularMove } from "../../entities/move/constructors";
import { Board } from "../../entities/board/Board";
import { getPieceAt, getPieceColorAt } from "../../entities/board/getters";
import * as O from "fp-ts/Option";
import { isKnight } from "../../entities/piece/getters";
import { getMoveFrom, getMoveTo } from "../../entities/move/getters";
import { getOrTrue } from "../../../lib/option";
import {sequenceT} from 'fp-ts/Apply';

const combineOptions = sequenceT(O.Apply);


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
                moves.push(createRegularMove(position, toSquare))
            }
            
            return moves;
        }, [])
    )

const isLegalMove = (board: Board) => (move: Move): boolean => pipe(
    [getMoveFrom(move), getMoveTo(move)],
    mapArray(sq => getPieceColorAt(board, sq)),
    // @ts-expect-error
    options => combineOptions(...options),
    O.map(colors => colors[0] === colors[1]),
    O.map(illegal => !illegal),
    getOrTrue
);

const filterLegalMoves = (board:Board) => filterArray(isLegalMove(board));

export const getLegalMoves = (board: Board, position: Square):Move[] =>
        pipe(
            getPieceAt(board, position),
            O.filter(isKnight),
            O.map(() => getMoves(position)),
            O.map(filterLegalMoves(board)),
            O.getOrElse<Move[]>(() => [])
        );