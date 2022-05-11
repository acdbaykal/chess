import { Board } from "./Board";
import { EnPassant, Move, Promotion, RegularMove } from "../move/Move";
import {omit} from 'ramda';
import {toString} from '../square/getters';
import { flow, pipe } from "fp-ts/lib/function";
import { getMoveFrom, getMoveTo, isPromotionMove, getPromotionPieceType, isRegularMove, isEnPassant, getEnPassantTakeSquare } from "../move/getters";
import * as Eth from "fp-ts/lib/Either";
import {getOrElse, map as mapOption} from 'fp-ts/lib/Option';
import { getPieceAt, hasPieceAt } from "./getters";
import { A, B, C, D, E, F, G, H, Square, _1, _2, _3, _4, _5, _6, _7, _8 } from "../square/Square";
import { Piece } from "../piece/Piece";
import { createPiece } from "../piece/constructors";
import { getPieceColor } from "../piece/getters";
import { MoveHistory } from "../movehistory/MoveHistory";
import { createSquare } from "../square/constructors";
import { pieceToEmoji } from "../piece/transition";
import { moveToString } from "../move/transition";
import { assert } from "../../../lib/either";

export const removePiece = (board: Board, square:Square): Board => 
    omit([toString(square)], board);

export const setPiece = (board: Board, square: Square, piece: Piece): Board => ({
    ...board,
    [toString(square)]: piece
})


type PrivateApplyMoveFunction<M extends Move> = (move:M) => (board: Board, piece:Piece) => Board

const applyRegularMove:PrivateApplyMoveFunction<RegularMove> = move => (board, piece) => {
    const from = getMoveFrom(move);
    const to = getMoveTo(move);
    
    return pipe(
        board,
        board => removePiece(board, from),
        board => setPiece(board, to, piece)
    );
}
    
const applyPromotion:PrivateApplyMoveFunction<Promotion> = move => (board, piece) => {
    const from = getMoveFrom(move);
    const to = getMoveTo(move);
    const promotionType = getPromotionPieceType(move);
    const color = getPieceColor(piece);
    const newPiece = createPiece(color, promotionType);

    return pipe(
        board,
        board => removePiece(board, from),
        board => setPiece(board, to, newPiece)
    );
}

const applyEnPassant = (move:EnPassant) => (board:Board, piece:Piece):Eth.Either<Error, Board> => {
    const to = getMoveTo(move);
    const from = getMoveFrom(move);
    const take = getEnPassantTakeSquare(move);

    return pipe(
        board,
        assert(
            (_board) => hasPieceAt(_board, take),
            (_board) => new Error(`Failed to apply en passant move to board: \n There is no piece to take on square ${toString(take)}\n${boardToString(_board)}`)
        ),
        Eth.map(_board => removePiece(_board, from)),
        Eth.map(_board => setPiece(_board, to, piece)),
        Eth.map(_board => removePiece(_board, take))
    );
}

const getApplyMoveFunction = (move: Move) => (board: Board, piece:Piece):Eth.Either<Error, Board> => {
    if(isRegularMove(move)) {
        return pipe(
            applyRegularMove(move)(board, piece),
            Eth.right
        );
    } else if(isPromotionMove(move)) {
        return pipe(
            applyPromotion(move)(board, piece),
            Eth.right
        )
    } else if(isEnPassant(move)) {
        return applyEnPassant(move)(board, piece);
    }

    return Eth.left(new Error(
        `Unknown move type while applying to board: ${JSON.stringify(move)}`
    ));
}

export const applyMove = (board: Board, move: Move): Eth.Either<Error, Board> =>{
    const _applyMove = getApplyMoveFunction(move);
    const from = getMoveFrom(move);

    return pipe(
        getPieceAt(board, from),
        Eth.fromOption(() => new Error(`Applying move ${moveToString(move)} is not possible: No piece avalable at given start`)),
        Eth.chain(piece => _applyMove(board, piece))
    )
}

const chainApplyMove = (move: Move) => Eth.chain((b: Board) => applyMove(b, move));

export const applyMoveHistory = (board: Board, moveList: MoveHistory):Eth.Either<Error, Board> =>
   moveList.reduce((currentBoard, move) => pipe(
       currentBoard,
       chainApplyMove(move)
   ), Eth.right<Error,Board>(board));


const RENDER_ORDER: Square[][] = [
    [
        createSquare(A, _8),
        createSquare(B, _8),
        createSquare(C, _8),
        createSquare(D, _8),
        createSquare(E, _8),
        createSquare(F, _8),
        createSquare(G, _8),
        createSquare(H, _8),
    ],
    [
        createSquare(A, _7),
        createSquare(B, _7),
        createSquare(C, _7),
        createSquare(D, _7),
        createSquare(E, _7),
        createSquare(F, _7),
        createSquare(G, _7),
        createSquare(H, _7),
    ],
    [
        createSquare(A, _6),
        createSquare(B, _6),
        createSquare(C, _6),
        createSquare(D, _6),
        createSquare(E, _6),
        createSquare(F, _6),
        createSquare(G, _6),
        createSquare(H, _6),
    ],
    [
        createSquare(A, _5),
        createSquare(B, _5),
        createSquare(C, _5),
        createSquare(D, _5),
        createSquare(E, _5),
        createSquare(F, _5),
        createSquare(G, _5),
        createSquare(H, _5),
    ],
    [
        createSquare(A, _4),
        createSquare(B, _4),
        createSquare(C, _4),
        createSquare(D, _4),
        createSquare(E, _4),
        createSquare(F, _4),
        createSquare(G, _4),
        createSquare(H, _4),
    ],
    [
        createSquare(A, _3),
        createSquare(B, _3),
        createSquare(C, _3),
        createSquare(D, _3),
        createSquare(E, _3),
        createSquare(F, _3),
        createSquare(G, _3),
        createSquare(H, _3),
    ],
    [
        createSquare(A, _2),
        createSquare(B, _2),
        createSquare(C, _2),
        createSquare(D, _2),
        createSquare(E, _2),
        createSquare(F, _2),
        createSquare(G, _2),
        createSquare(H, _2),
    ],
    [
        createSquare(A, _1),
        createSquare(B, _1),
        createSquare(C, _1),
        createSquare(D, _1),
        createSquare(E, _1),
        createSquare(F, _1),
        createSquare(G, _1),
        createSquare(H, _1),
    ]
]

export const boardToString  = (board:Board):string => 
    ['A B C D E F G H'].concat(
        RENDER_ORDER.map(
            line => 
                line.map(
                    flow(
                        sqr => getPieceAt(board, sqr),
                        mapOption(pieceToEmoji),
                        getOrElse(() => '·')
                    )
                ).join(' ')
        )
    )
    .map((lineStr, index) => (index === 0 ? '  ' : `${8 - index + 1} `) + lineStr)
    .join('\n')
