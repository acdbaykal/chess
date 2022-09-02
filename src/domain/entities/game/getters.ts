import * as E from "fp-ts/lib/Either";
import { flow, pipe } from "fp-ts/lib/function";
import { Game } from "./Game";
import { Square } from "../square/Square";
import { getSquaresForPiece, isSquareOccupied } from "../board/getters";
import { getMoveFrom } from "../move/getters";
import { squareEquals } from "../square/getters";
import { applyMoveHistory } from "../board/transitions";
import { Board } from "../board/Board";
import { Piece } from "../piece/Piece";
import { getActiveColor } from "../movehistory/getters";

export const getInitialBoard = (game: Game) => game.initialBoard;
export const getMovesHistory = (game:Game) => game.moveHistory;

export const hasPieceMoved = (game: Game, startingPosition: Square): E.Either<Error, boolean> => {
    const hasPiece = pipe(
        getInitialBoard(game),
        board => isSquareOccupied(board, startingPosition),
    );

    if(!hasPiece){
        return E.left(new Error('No piece available at starting position'))
    }
    
    return pipe(
        getMovesHistory(game),
        moveHist => moveHist.some(flow(
            getMoveFrom,
            squareEquals(startingPosition)
        )),
        E.right
    )
}

export const getCurrentBoard = (game: Game):E.Either<Error, Board> =>{
    const board = getInitialBoard(game);
    const moves = getMovesHistory(game);
    return applyMoveHistory(board, moves);
}

export const getInitialSquaresForPiece = (game: Game, piece:Piece): Square[] => pipe(
    getInitialBoard(game),
    board => getSquaresForPiece(board, piece)
);

export const getActivePlayer = flow(
    getMovesHistory,
    getActiveColor
);  
