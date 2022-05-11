import { map as  mapRight} from "fp-ts/lib/Either";
import { flow, pipe } from "fp-ts/lib/function";
import { any } from "ramda";
import { getOrFalse } from "../../lib/either";
import { isSquareOccupiedByPiece, getPlayerPieces } from "../entities/board/getters";
import { Game } from "../entities/game/Game";
import { getCurrentBoard } from "../entities/game/getters";
import { getMoveTo } from "../entities/move/getters";
import { createPiece } from "../entities/piece/constructors";
import { getPieceType } from "../entities/piece/getters";
import { PieceColor, PieceType } from "../entities/piece/Piece";
import { reversePieceColor } from "../entities/piece/transition";
import * as B from './move/bishop';
import * as N from './move/knight';
import * as Q from './move/queen';
import * as P from './move/pawn';
import * as R from './move/rook';

const getLegalMoves = (pieceType: PieceType) => {
    switch(pieceType) {
        case PieceType.Bishop: return B.getLegalMoves
        case PieceType.Knight: return N.getLegalMoves
        case PieceType.Queen: return Q.getLegalMoves
        case PieceType.Pawn: return P.getLegalMoves
        case PieceType.Rook: return R.getLegalMoves
        default:
            return () => []
    }
};

export const isInCheck = (game: Game, color:PieceColor) =>
    pipe(        
        getCurrentBoard(game),
        mapRight(board => pipe(
            getPlayerPieces(board, reversePieceColor(color)),
            any(
                ([square, piece]) => pipe(
                    getLegalMoves(getPieceType(piece)),
                    _getLegalMoves => _getLegalMoves(game, square),
                    any(flow(
                        getMoveTo,
                        square => isSquareOccupiedByPiece(createPiece(color, PieceType.King))(board, square)
                    ))
                )
            )
        )),
        getOrFalse
    );