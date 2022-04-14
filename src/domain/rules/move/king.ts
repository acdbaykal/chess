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
import { getPieceColorAt, isOccupiedByColor } from "../../entities/board/getters";
import { map as mapOption } from 'fp-ts/Option';
import { getOrFalse } from "../../../lib/option";

const isNotOccupiedBySameColor = (board:Board, square:Square) => (destination: Square):boolean =>
    pipe(
        getPieceColorAt(board, square),
        mapOption(pieceColor => !isOccupiedByColor(pieceColor)(board, destination)),
        getOrFalse
    );
 
const getNonCastlingMoves = (board: Board, square: Square):Move[] => pipe(
    calcNeighbors(square),
    filterList(isNotOccupiedBySameColor(board, square)),
    mapList(destination => createRegularMove(square, destination))
);

export const getLegalMoves = (game: Game, square: Square) =>  pipe(
    getCurrentBoard(game),
    mapEither(board => getNonCastlingMoves(board, square))
);
