import { flow, pipe } from "fp-ts/lib/function";
import { any, map } from "ramda";
import { Board } from "../entities/board/Board";
import { isSquareOccupiedByPiece } from "../entities/board/getters";
import { getMoveTo } from "../entities/move/getters";
import { moveToString } from "../entities/move/transition";
import { createPiece } from "../entities/piece/constructors";
import { PieceColor, PieceType } from "../entities/piece/Piece";
import { reversePieceColor } from "../entities/piece/transition";
import { createSquare } from "../entities/square/constructors";
import { G, _7 } from "../entities/square/Square";
import * as B from './move/bishop';
import * as N from './move/knight';

const PIECES = [
    PieceType.Bishop,
    PieceType.Knight
];


export const isInChecked = (board: Board, color:PieceColor) =>
    pipe(
        PIECES,
        map(pieceType => createSquare(reversePieceColor(color, pieceType)))
        
        B.getLegalMoves(board, createSquare(G, _7)),
        moves => (pipe(
            moves.map(moveToString),
            console.log.bind(console)
        ), moves),
        any(flow(
            getMoveTo,
            square => isSquareOccupiedByPiece(createPiece(color, PieceType.King))(board, square)
        ))
    );