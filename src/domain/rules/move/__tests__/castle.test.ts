import { createGame } from "../../../entities/game/constructors";
import { createCastling, createRegularMove } from "../../../entities/move/constructors";
import { createMoveHistory } from "../../../entities/movehistory/constructors";
import { MoveHistory } from "../../../entities/movehistory/MoveHistory";
import { createSquare } from "../../../entities/square/constructors";
import { A, B, C, D, E, F, G, H, _1, _2, _3, _4, _5, _6, _7, _8 } from "../../../entities/square/Square";
import {STANDARD_INITIAL_POSITION} from '../../../entities/board/standard';
import {getLegalMoves} from '../castle';
import { boardToString } from "../../../entities/board/conversions";
import { pipe } from "fp-ts/lib/function";
import { getCurrentBoard } from "../../../entities/game/getters";
import { getOrElse, map } from "fp-ts/lib/Either";
import { getOrUndefined } from "../../../../lib/either";

describe('domain/rules/move/castle', () => {
    it('returns an empty array when the white king has moved', () => {
        const moveHistory: MoveHistory = createMoveHistory([
            createRegularMove(createSquare(E, _2), createSquare(E, _4)),
            createRegularMove(createSquare(E, _7), createSquare(E, _5)),
            createRegularMove(createSquare(G, _1), createSquare(F, _3)),
            createRegularMove(createSquare(B, _8), createSquare(C, _6)),
            createRegularMove(createSquare(B, _1), createSquare(C, _3)),
            createRegularMove(createSquare(G, _8), createSquare(F, _6)),
            createRegularMove(createSquare(F, _1), createSquare(B, _5)),
            createRegularMove(createSquare(A, _7), createSquare(A, _6)),
            createRegularMove(createSquare(B, _5), createSquare(C, _6)),
            createRegularMove(createSquare(B, _7), createSquare(C, _6)),
            createRegularMove(createSquare(E, _1), createSquare(E, _2)),
            createRegularMove(createSquare(F, _8), createSquare(E, _7)),
            createRegularMove(createSquare(E, _2), createSquare(E, _1)),
            createRegularMove(createSquare(C, _8), createSquare(G, _4))
        ]);

        const game = createGame(STANDARD_INITIAL_POSITION, moveHistory);

        const castlingMoves = getLegalMoves(game);

        expect(castlingMoves).toEqual([]);
    });

    it('does not include short castlinbg when there is a piece beween the king and the rook', () => {
        const moveHistory: MoveHistory = createMoveHistory([
            createRegularMove(createSquare(G, _1), createSquare(F, _3)),
            createRegularMove(createSquare(E, _7), createSquare(E, _5))
        ]);

        const game = createGame(STANDARD_INITIAL_POSITION, moveHistory);

        const castlingMoves = getLegalMoves(game);

        expect(castlingMoves).toEqual([]);
    })

    it('returns short castling move for white king when applicable', () => {
        const moveHistory: MoveHistory = createMoveHistory([ 
            createRegularMove(createSquare(E, _2), createSquare(E, _4)),
            createRegularMove(createSquare(E, _7), createSquare(E, _5)),
            createRegularMove(createSquare(G, _1), createSquare(F, _3)),
            createRegularMove(createSquare(B, _8), createSquare(C, _6)),
            createRegularMove(createSquare(B, _1), createSquare(C, _3)),
            createRegularMove(createSquare(G, _8), createSquare(F, _6)),
            createRegularMove(createSquare(F, _1), createSquare(B, _5)),
            createRegularMove(createSquare(A, _7), createSquare(A, _6)),
            createRegularMove(createSquare(B, _5), createSquare(C, _6)),
            createRegularMove(createSquare(B, _7), createSquare(C, _6))
        ]);

        const game = createGame(STANDARD_INITIAL_POSITION, moveHistory);

        const castlingMoves = getLegalMoves(game);
        expect(castlingMoves).toEqual([
            createCastling(createSquare(E, _1), createSquare(G, _1))
        ]);
    });

    it('returns long castling move for white king when applicable', () => {
        const moveHistory: MoveHistory = createMoveHistory([ 
            createRegularMove(createSquare(E, _2), createSquare(E, _4)),
            createRegularMove(createSquare(C, _7), createSquare(C, _5)),
            createRegularMove(createSquare(G, _1), createSquare(F, _3)),
            createRegularMove(createSquare(D, _7), createSquare(D, _6)),
            createRegularMove(createSquare(D, _2), createSquare(D, _4)),
            createRegularMove(createSquare(C, _5), createSquare(D, _4)),
            createRegularMove(createSquare(F, _3), createSquare(D, _4)),
            createRegularMove(createSquare(G, _8), createSquare(F, _6)),
            createRegularMove(createSquare(B, _1), createSquare(C, _3)),
            createRegularMove(createSquare(A, _7), createSquare(A, _6)),
            createRegularMove(createSquare(C, _1), createSquare(G, _5)),
            createRegularMove(createSquare(E, _7), createSquare(E, _6)),
            createRegularMove(createSquare(F, _2), createSquare(F, _4)),
            createRegularMove(createSquare(F, _8), createSquare(E, _7)),
            createRegularMove(createSquare(D, _1), createSquare(F, _3)),
            createRegularMove(createSquare(D, _8), createSquare(C, _7)),
        ]);

        const game = createGame(STANDARD_INITIAL_POSITION, moveHistory);

        const castlingMoves = getLegalMoves(game);
        expect(castlingMoves).toEqual([
            createCastling(createSquare(E, _1), createSquare(C, _1))
        ]);
    });

    it('returns short castling move for white king when applicable', () => {
        const moveHistory: MoveHistory = createMoveHistory([ 
            createRegularMove(createSquare(E, _2), createSquare(E, _4)),
            createRegularMove(createSquare(E, _7), createSquare(E, _5)),
            createRegularMove(createSquare(F, _1), createSquare(C, _4)),
            createRegularMove(createSquare(G, _8), createSquare(F, _6)),
            createRegularMove(createSquare(G, _1), createSquare(F, _3)),
            createRegularMove(createSquare(F, _8), createSquare(C, _5)),
            createRegularMove(createSquare(B, _1), createSquare(C, _3)),

        ]);

        const game = createGame(STANDARD_INITIAL_POSITION, moveHistory);

        const castlingMoves = getLegalMoves(game);
        expect(castlingMoves).toEqual([
            createCastling(createSquare(E, _8), createSquare(G, _8))
        ]);
    });

    it('returns empty array for the black king when the king has moved', () => {
        const moveHistory: MoveHistory = createMoveHistory([ 
            createRegularMove(createSquare(E, _2), createSquare(E, _4)),
            createRegularMove(createSquare(E, _7), createSquare(E, _5)),
            createRegularMove(createSquare(F, _1), createSquare(C, _4)),
            createRegularMove(createSquare(G, _8), createSquare(F, _6)),
            createRegularMove(createSquare(G, _1), createSquare(F, _3)),
            createRegularMove(createSquare(F, _8), createSquare(C, _5)),
            createRegularMove(createSquare(B, _1), createSquare(C, _3)),
            createRegularMove(createSquare(E, _8), createSquare(E, _7)),
            createRegularMove(createSquare(D, _2), createSquare(D, _3)),
            createRegularMove(createSquare(E, _7), createSquare(E, _8)),
            createRegularMove(createSquare(C, _1), createSquare(G, _5))
        ]);

        const game = createGame(STANDARD_INITIAL_POSITION, moveHistory);

        const castlingMoves = getLegalMoves(game);
        expect(castlingMoves).toEqual([]);
    });

    it('does not include short castle when the rook has moved', () => {
        const moveHistory: MoveHistory = createMoveHistory([ 
            createRegularMove(createSquare(E, _2), createSquare(E, _4)),
            createRegularMove(createSquare(E, _7), createSquare(E, _5)),
            createRegularMove(createSquare(H, _2), createSquare(H, _4)),
            createRegularMove(createSquare(B, _8), createSquare(C, _6)),
            createRegularMove(createSquare(H, _1), createSquare(H, _3)),
            createRegularMove(createSquare(D, _7), createSquare(D, _6)),
            createRegularMove(createSquare(H, _3), createSquare(H, _1)),
            createRegularMove(createSquare(G, _8), createSquare(F, _6)),
            createRegularMove(createSquare(F, _1), createSquare(C, _4)),
            createRegularMove(createSquare(F, _6), createSquare(E, _4)),
            createRegularMove(createSquare(G, _1), createSquare(F, _3)),
            createRegularMove(createSquare(F, _8), createSquare(E, _7))
        ]);

        const game = createGame(STANDARD_INITIAL_POSITION, moveHistory);

        const castlingMoves = getLegalMoves(game);
        expect(castlingMoves).toEqual([]);
    });
});