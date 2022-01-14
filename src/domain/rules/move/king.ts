import { A, Square, _1 } from "../../entities/square/Square";
import {Game} from '../../entities/game/Game';
import {Move} from '../../entities/move/Move';
import {Board} from '../../entities/board/Board';
import {apply as applyTo, flow, pipe} from 'fp-ts/function';
import { toLeft, toLower, toRight, toUpper} from "../../entities/square/transitions";
import { filter as filterList, map as mapList } from 'fp-ts/Array'
import { chain as chainEither, isRight, getOrElse, map as mapEither, filterOrElse, fromOption, flatten as flattenEither } from "fp-ts/lib/Either";
import { createMove } from "../../entities/move/constructors";
import { createSquare } from "../../entities/square/constructors";
import { getCurrentBoard } from "../../entities/game/getters";
import { getPieceColorAt, isOccupiedByColor, isSquareOccupied } from "../../entities/board/getters";
import { PieceColor } from "../../entities/piece/Piece";

const destinationSquareCreators = [
    toLeft(1),
    toRight(1),
    toUpper(1),
    toLower(1)
];

const filterOccupiedDestinations = (board:Board, pieceColor:PieceColor) => filterOrElse<Square, Error>(
    (destination:Square) => !isOccupiedByColor(pieceColor)(board, destination),
    () => Error('The square is alreadu occupied')
);

const getNonCastlingMoves = (board: Board, square: Square):Move[] => pipe(
    destinationSquareCreators,
    mapList(applyTo(square)),
    mapList(destination => pipe(
        getPieceColorAt(board, square),
        fromOption(() => Error('')),
        chainEither(pieceColor => filterOccupiedDestinations(board, pieceColor)(destination))
    )),
    filterList(isRight),
    mapList(getOrElse(() => createSquare(A, _1))),
    mapList(destination => createMove(square, destination))
);

export const getLegalMoves = (game: Game, square: Square) =>  pipe(
    getCurrentBoard(game),
    mapEither(board => getNonCastlingMoves(board, square))
);
