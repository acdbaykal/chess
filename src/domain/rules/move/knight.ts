import { pipe } from "fp-ts/lib/function";
import { Square } from "../../entities/square/Square";
import { toRight, toUpper, toLeft, toLower } from "../../entities/square/transitions";
import {filter as filterArray, map as mapArray, reduce} from 'ramda';
import { Move } from "../../entities/move/Move";
import { createRegularMove } from "../../entities/move/constructors";
import { Board } from "../../entities/board/Board";
import { getPieceAt, getPieceColorAt } from "../../entities/board/getters";
import { isKnight } from "../../entities/piece/getters";
import { getMoveFrom, getMoveTo } from "../../entities/move/getters";
import { Game } from "../../entities/game/Game";
import { getCurrentBoard } from "../../entities/game/getters";
import { logLeft } from "../../../lib/either";
import { combineNullables, defaultTo, flowUntilNull, flowWithFallback, fromEither, guardNullable, isNotNull, Nullable, pipeUntilNull, pipeWithFallback } from "../../../lib/nullable";
import { Either } from "fp-ts/lib/Either";
import { Piece, PieceColor } from "../../entities/piece/Piece";

const moveTransitions = [
    flowUntilNull(toRight(2), toUpper(1)),
    flowUntilNull(toRight(2), toLower(1)),
    flowUntilNull(toLower(2), toRight(1)),
    flowUntilNull(toLower(2), toLeft(1)),
    flowUntilNull(toLeft(2), toLower(1)),
    flowUntilNull(toLeft(2), toUpper(1)),
    flowUntilNull(toUpper(2), toLeft(1)),
    flowUntilNull(toUpper(2), toRight(1))
]

export const getMoves = (position: Square): Move[] => 
    pipe(
        moveTransitions,
        mapArray(transition => transition(position)),
        reduce((moves: Move[], square: Nullable<Square>) => {
            if(isNotNull(square)){
                moves.push(createRegularMove(position, square))
            }
            
            return moves;
        }, [])
    )

const isLegalMove = (board: Board) => (move: Move): boolean => pipe(
    [getMoveFrom(move), getMoveTo(move)],
    mapArray(sq => getPieceColorAt(board, sq)),
    flowWithFallback(
        () => true,
        (pieceColors: Nullable<PieceColor>[]) => combineNullables(...pieceColors),
        colors => colors[0] === colors[1],
        illegal => !illegal,
    )
);

const filterLegalMoves = (board:Board) => filterArray(isLegalMove(board));

export const getLegalMoves = (game: Game, position: Square):Move[] =>
        pipe(
            getCurrentBoard(game),
            logLeft,
            flowUntilNull(
                (board: Either<Error, Board>): Nullable<Board> => fromEither(board),
                (board: Board) => pipeUntilNull<Nullable<Piece>, Move[], Nullable<Piece>, Move[]>(
                    getPieceAt(board, position),
                    guardNullable(isKnight),
                    ():Move[] => getMoves(position),
                    filterLegalMoves(board)
                )
            ),
            defaultTo<Move[]>(() => []),
        );