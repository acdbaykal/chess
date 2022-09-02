import { map, getOrElse } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { logLeft } from "../../../lib/either";
import { isNull } from "../../../lib/nullable";
import { getPieceAt } from "../../entities/board/getters";
import { Game } from "../../entities/game/Game";
import { getActivePlayer, getCurrentBoard } from "../../entities/game/getters";
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
import * as Check from '../check';
import { getPieceType } from "../../entities/piece/getters";
import { filter } from "fp-ts/lib/Array";
import { addMove } from "../../entities/game/transitions";
import { reversePieceColor } from "../../entities/piece/transition";

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
        map(board => getPieceAt(board, square)),
        map(
            (piece): Move[] =>
                isNull(piece) ? [] : getNoCheckMoves(getPieceType(piece), game, square)
        ),
        map(
            filter(move => {
                const appliedGame = addMove(game, move);
                const currentPlayer = reversePieceColor(getActivePlayer(appliedGame));
                const isInCheck = Check.isInCheck(appliedGame, currentPlayer);
                return !isInCheck;
            })
        ),
        getOrElse(() => [] as Move[])
    )