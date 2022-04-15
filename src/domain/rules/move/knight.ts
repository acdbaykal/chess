import { flow, pipe } from "fp-ts/lib/function";
import { Square } from "../../entities/square/Square";
import { toRight, toUpper, toLeft, toLower } from "../../entities/square/transitions";
import {filter as filterArray, map as mapArray, reduce} from 'ramda';
import { Move } from "../../entities/move/Move";
import { getOrUndefined } from "../../../lib/option";
import { createRegularMove } from "../../entities/move/constructors";
import { Board } from "../../entities/board/Board";
import { getPieceAt, getPieceColorAt } from "../../entities/board/getters";
import * as O from "fp-ts/Option";
import { isKnight } from "../../entities/piece/getters";
import { getMoveFrom, getMoveTo } from "../../entities/move/getters";
import { getOrTrue } from "../../../lib/option";
import {sequenceT} from 'fp-ts/Apply';
import { Game } from "../../entities/game/Game";
import { getCurrentBoard } from "../../entities/game/getters";
import { logLeft } from "../../../lib/either";

const combineOptions = sequenceT(O.Apply);


const moveTransitions = [
    flow(toRight(2), O.chain(toUpper(1))),
    flow(toRight(2), O.chain(toLower(1))),
    flow(toLower(2), O.chain(toRight(1))),
    flow(toLower(2), O.chain(toLeft(1))),
    flow(toLeft(2), O.chain(toLower(1))),
    flow(toLeft(2), O.chain(toUpper(1))),
    flow(toUpper(2), O.chain(toLeft(1))),
    flow(toUpper(2), O.chain(toRight(1)))
]

export const getMoves = (position: Square): Move[] => 
    pipe(
        moveTransitions,
        mapArray(transition => transition(position)),
        reduce((moves: Move[], square: O.Option<Square>) => {
            if(O.isSome(square)){
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

export const getLegalMoves = (game: Game, position: Square):Move[] =>
        pipe(
            getCurrentBoard(game),
            logLeft,
            O.fromEither,
            O.chain(
                (board:Board) => pipe(
                    getPieceAt(board, position),
                    O.filter(isKnight),
                    O.map(() => getMoves(position)),
                    O.map(filterLegalMoves(board))
                )
            ),
            O.getOrElse<Move[]>(() => [])
        );