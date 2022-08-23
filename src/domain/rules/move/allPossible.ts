import { map, getOrElse } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { logLeft } from "../../../lib/either";
import { isNull } from "../../../lib/nullable";
import { getPieceTypeAt } from "../../entities/board/getters";
import { Game } from "../../entities/game/Game";
import { getCurrentBoard } from "../../entities/game/getters";
import { Move } from "../../entities/move/Move";
import { PieceType } from "../../entities/piece/Piece";
import { Square, _1, _2, _3, _4, _5, _6 } from "../../entities/square/Square";
import * as Bishop from '../move/bishop';
import * as Knight from '../move/knight';
import * as Queen from '../move/queen';
import * as King from '../move/king';
import * as Castling from '../move/castle';
import * as Rook from '../move/rook';
import * as Pawn from '../move/pawn';

const getNoCheckMoves = (pieceType: PieceType, game: Game, square: Square) => {
    switch(pieceType){
        case PieceType.Pawn:
            return Pawn.getLegalMoves(game, square);
        case PieceType.Bishop:
            return Bishop.getLegalMoves(game, square);
        case PieceType.Knight:
            return Knight.getLegalMoves(game, square);
        case PieceType.Queen:
            return Queen.getLegalMoves(game, square);
        case PieceType.King:
            const castlingMoves = Castling.getLegalMoves(game);
            const kingMoves = getOrElse(() => [] as Move[])(King.getLegalMoves(game, square));
            return [
                ...castlingMoves,
                ...kingMoves
            ];
        case PieceType.Rook:
            return Rook.getLegalMoves(game, square);
        default:
            return [];
    }
}

export const calcAllPossibleMoves = (game: Game, square: Square): Move[] =>
    pipe(
        getCurrentBoard(game),
        logLeft,
        map(board => getPieceTypeAt(board, square)),
        map(
            (pieceType): Move[] =>
                isNull(pieceType) ? [] : getNoCheckMoves(pieceType, game, square)
        ),
        getOrElse(() => [] as Move[])
    )