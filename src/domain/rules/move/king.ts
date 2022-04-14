import { Square, _1, _4 } from "../../entities/square/Square";
import {Game} from '../../entities/game/Game';
import {Move} from '../../entities/move/Move';
import {Board} from '../../entities/board/Board';
import {pipe} from 'fp-ts/function';
import { calcNeighbors} from "../../entities/square/transitions";
import { filter as filterList, map as mapList } from 'fp-ts/Array'
import { map as mapEither } from "fp-ts/lib/Either";
import { createRegularMove } from "../../entities/move/constructors";
import { getCurrentBoard } from "../../entities/game/getters";
import { getPieceColorAt, isOccupiedByColor, isSquareOccupiedByPiece } from "../../entities/board/getters";
import { map as mapOption, getOrElse } from 'fp-ts/Option';
import { PieceColor, PieceType } from "../../entities/piece/Piece";
import { reversePieceColor } from "../../entities/piece/transition";
import { any } from "ramda";
import { createPiece } from "../../entities/piece/constructors";

const isNotOccupiedBySameColor = (board:Board, kingColor: PieceColor) => (square:Square):boolean =>
       !isOccupiedByColor(kingColor)(board, square)

const neighborsKing = (board: Board, kingColor: PieceColor) => (square: Square):boolean =>{
    const oppositeKing = createPiece(reversePieceColor(kingColor), PieceType.King);

    return pipe(
        calcNeighbors(square),
        any(neighbor => isSquareOccupiedByPiece(oppositeKing)(board, neighbor))
    );
};

const getNonCastlingMoves = (board: Board, square: Square):Move[] => pipe(
    getPieceColorAt(board, square),
    mapOption(kingColor => pipe(
        calcNeighbors(square),
        filterList(isNotOccupiedBySameColor(board, kingColor)),
        filterList(neighbor => !neighborsKing(board, kingColor)(neighbor)),
        mapList(destination => createRegularMove(square, destination))
    )),
    getOrElse<Move[]>(() => [])
);

export const getLegalMoves = (game: Game, square: Square) =>  pipe(
    getCurrentBoard(game),
    mapEither(board => getNonCastlingMoves(board, square))
);
