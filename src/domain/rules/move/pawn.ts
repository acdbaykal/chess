import { Game } from "../../entities/game/Game";
import { Move } from "../../entities/move/Move";
import { toString } from "../../entities/square/getters";
import { Square } from "../../entities/square/Square";
import {toLower, toUpper} from '../../entities/square/transitions';
import { chain as chainEither, filterOrElse, fold, fromOption } from 'fp-ts/Either';
import { createMove } from "../../entities/move/constructors";
import { PieceColor } from "../../entities/piece/Piece";
import { getCurrentBoard } from "../../entities/game/getters";
import { getPieceColorAt, isSquareOccupied } from "../../entities/board/getters";
import { pipe } from "fp-ts/function";
import { map as mapOption} from "fp-ts/lib/Option";
import { Board } from "../../entities/board/Board";


const getForwardSquare = (pieceColor: PieceColor) => 
    pieceColor === PieceColor.Black ? toLower(1) : toUpper(1);

const getForwardSquareFromBoard = (square: Square) => (board:Board) => {
    console.log(board);
    
    return pipe(
    getPieceColorAt(board, square),
    mapOption(getForwardSquare),
    fromOption(() => Error(`${toString(square)} is not oocupied by a pawn`)),
    chainEither(_getForwardSquare => _getForwardSquare(square)),
    filterOrElse(sq => !isSquareOccupied(board, sq), () => Error('Sqaure is already occupied'))
)}

export const getLegalMoves = (game: Game, square:Square): Move[] => {
    return pipe(
        getCurrentBoard(game),
        chainEither(getForwardSquareFromBoard(square)),
        fold<Error, Square, Move[]>(
            () => [],
            destination => [createMove(square, destination)]
        )
    );
}