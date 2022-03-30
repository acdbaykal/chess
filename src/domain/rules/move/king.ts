import { A, Square, _1 } from "../../entities/square/Square";
import {Game} from '../../entities/game/Game';
import {Move} from '../../entities/move/Move';
import {Board} from '../../entities/board/Board';
import {apply as applyTo, flow, pipe} from 'fp-ts/function';
import { toLeft, toLower, toRight, toUpper} from "../../entities/square/transitions";
import { filter as filterList, map as mapList } from 'fp-ts/Array'
import { map as mapEither } from "fp-ts/lib/Either";
import { createRegularMove } from "../../entities/move/constructors";
import { createSquare } from "../../entities/square/constructors";
import { getCurrentBoard } from "../../entities/game/getters";
import { getPieceColorAt, isOccupiedByColor } from "../../entities/board/getters";
import { chain as chainOption, map as mapOption, getOrElse } from 'fp-ts/Option';
import { getOrFalse } from "../../../lib/option";

const destinationSquareCreators = [
    toLeft(1),
    toRight(1),
    toUpper(1),
    toLower(1)
];

const isNotOccupiedBySameColor = (board:Board, square:Square) => flow(
    chainOption((destination:Square) => pipe(
        getPieceColorAt(board, square),
        mapOption(pieceColor => !isOccupiedByColor(pieceColor)(board, destination))
    )),
    getOrFalse
);
 
const getNonCastlingMoves = (board: Board, square: Square):Move[] => pipe(
    destinationSquareCreators,
    mapList(applyTo(square)),
    filterList(isNotOccupiedBySameColor(board, square)),
    mapList(getOrElse(() => createSquare(A, _1))),
    mapList(destination => createRegularMove(square, destination))
);

export const getLegalMoves = (game: Game, square: Square) =>  pipe(
    getCurrentBoard(game),
    mapEither(board => getNonCastlingMoves(board, square))
);
