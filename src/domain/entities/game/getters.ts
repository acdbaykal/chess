import * as E from "fp-ts/lib/Either";
import { flow, pipe } from "fp-ts/lib/function";
import { Game } from "./Game";
import { Square } from "../square/Square";
import { isSquareOccupied } from "../board/getters";
import {any} from 'ramda'
import { getMoveFrom } from "../move/getters";
import { squareEquals } from "../square/getters";
import { applyMoveList } from "../board/transitions";
import { Board } from "../board/Board";

export const getInitialBoard = (game: Game) => game.initialBoard;
export const getMoves = (game:Game) => game.moves;

export const hasPieceMoved = (game: Game, startingPosition: Square): E.Either<Error, boolean> => {
    const hasPiece = pipe(
        getInitialBoard(game),
        board => isSquareOccupied(board, startingPosition),
    );

    if(!hasPiece){
        return E.left(new Error('No piece available at starting position'))
    }
    
    return pipe(
        getMoves(game),
        any(flow(
            getMoveFrom,
            squareEquals(startingPosition)
        )),
        E.right
    )
}

export const getCurrentBoard = (game: Game):E.Either<Error, Board> =>{
    const board = getInitialBoard(game);
    const moves = getMoves(game);
    return applyMoveList(board, moves);
}