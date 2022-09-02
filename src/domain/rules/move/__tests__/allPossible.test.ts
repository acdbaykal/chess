import { getOrElse, map } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { Board } from "../../../entities/board/Board";
import { boardToString } from "../../../entities/board/conversions";
import { STANDARD_INITIAL_POSITION } from "../../../entities/board/standard";
import { createGame } from "../../../entities/game/constructors";
import { getCurrentBoard } from "../../../entities/game/getters";
import { createCastling, createMoveList, createRegularMove } from "../../../entities/move/constructors";
import { sortMoveList } from "../../../entities/move/transition";
import { createMoveHistory } from "../../../entities/movehistory/constructors";
import { createSquare } from "../../../entities/square/constructors";
import { A, B, C, D, E, F, G, H, _1, _2, _3, _4, _5, _6, _7, _8 } from "../../../entities/square/Square";
import { calcAllPossibleMoves } from '../allPossible';

describe('rules/move/allPossible', () => {

    it('returns all possible moves for a bishop', () => {
        const moveList = createMoveHistory([
            createRegularMove(createSquare(E, _2), createSquare(E, _4)),
            createRegularMove(createSquare(E, _7), createSquare(E, _5))
        ]);

        const game = createGame(STANDARD_INITIAL_POSITION, moveList);

        const possibleMoves = pipe(
            calcAllPossibleMoves(game, createSquare(F, _1)),
            sortMoveList
        );

        expect(possibleMoves).toEqual(pipe(
            [
                createSquare(E, _2),
                createSquare(D, _3),
                createSquare(C, _4),
                createSquare(B, _5),
                createSquare(A, _6)
            ],
            createMoveList(createSquare(F, _1)),
            sortMoveList
        ));
    });

    it('returns all possible moves for a knight', () => {
        const moveList = createMoveHistory([
            createRegularMove(createSquare(E, _2), createSquare(E, _4)),
            createRegularMove(createSquare(E, _7), createSquare(E, _5))
        ]);

        const game = createGame(STANDARD_INITIAL_POSITION, moveList);

        const possibleMoves = pipe(
            calcAllPossibleMoves(game, createSquare(G, _1)),
            sortMoveList
        );

        expect(possibleMoves).toEqual(pipe(
            [
                createSquare(E, _2),
                createSquare(F, _3),
                createSquare(H, _3)
            ],
            createMoveList(createSquare(G, _1)),
            sortMoveList
        ));
    });

    it('returns all possible moves for a queen', () => {
        const moveList = createMoveHistory([
            createRegularMove(createSquare(E, _2), createSquare(E, _4)),
            createRegularMove(createSquare(E, _7), createSquare(E, _5))
        ]);

        const game = createGame(STANDARD_INITIAL_POSITION, moveList);

        const possibleMoves = pipe(
            calcAllPossibleMoves(game, createSquare(D, _1)),
            sortMoveList
        );

        expect(possibleMoves).toEqual(pipe(
            [
                createSquare(E, _2),
                createSquare(F, _3),
                createSquare(G, _4),
                createSquare(H, _5)
            ],
            createMoveList(createSquare(D, _1)),
            sortMoveList
        ));
    });

    it('returns all possible moves for a king', () => {
        const moveList = createMoveHistory([
            createRegularMove(createSquare(E, _2), createSquare(E, _4)),
            createRegularMove(createSquare(E, _7), createSquare(E, _5)),
            createRegularMove(createSquare(F, _2), createSquare(F, _4)),
            createRegularMove(createSquare(E, _5), createSquare(F, _4))
        ]);

        const game = createGame(STANDARD_INITIAL_POSITION, moveList);

        const possibleMoves = pipe(
            calcAllPossibleMoves(game, createSquare(E, _1)),
            sortMoveList
        );

        expect(possibleMoves).toEqual(pipe(
            [
                createSquare(E, _2),
                createSquare(F, _2)
            ],
            createMoveList(createSquare(E, _1)),
            sortMoveList
        ));
    });

    it('returns all possible moves for a rook', () => {
        const moveList = createMoveHistory([
            createRegularMove(createSquare(E, _2), createSquare(E, _4)),
            createRegularMove(createSquare(E, _7), createSquare(E, _5)),
            createRegularMove(createSquare(F, _2), createSquare(F, _4)),
            createRegularMove(createSquare(E, _5), createSquare(F, _4)),
            createRegularMove(createSquare(G, _1), createSquare(F, _3)),
            createRegularMove(createSquare(G, _7), createSquare(G, _5)),
            createRegularMove(createSquare(F, _1), createSquare(C, _4)),
            createRegularMove(createSquare(G, _5), createSquare(G, _4))
        ]);

        const game = createGame(STANDARD_INITIAL_POSITION, moveList);

        const possibleMoves = pipe(
            calcAllPossibleMoves(game, createSquare(H, _1)),
            sortMoveList
        );

        expect(possibleMoves).toEqual(pipe(
            [
                createSquare(G, _1),
                createSquare(F, _1)
            ],
            createMoveList(createSquare(H, _1)),
            sortMoveList
        ));
    });

    it('includes castling for the king when applicable', () => {
        const moveList = createMoveHistory([
            createRegularMove(createSquare(E, _2), createSquare(E, _4)),
            createRegularMove(createSquare(E, _7), createSquare(E, _5)),
            createRegularMove(createSquare(F, _2), createSquare(F, _4)),
            createRegularMove(createSquare(E, _5), createSquare(F, _4)),
            createRegularMove(createSquare(G, _1), createSquare(F, _3)),
            createRegularMove(createSquare(G, _7), createSquare(G, _5)),
            createRegularMove(createSquare(F, _1), createSquare(C, _4)),
            createRegularMove(createSquare(G, _5), createSquare(G, _4))
        ]);

        const kingPosition = createSquare(E, _1);

        const game = createGame(STANDARD_INITIAL_POSITION, moveList);

        const possibleMoves = pipe(
            calcAllPossibleMoves(game, kingPosition),
            sortMoveList
        );

        expect(possibleMoves).toEqual(pipe(
            [
                createRegularMove(kingPosition, createSquare(E, _2)),
                createRegularMove(kingPosition, createSquare(F, _1)),
                createRegularMove(kingPosition, createSquare(F, _2)),
                createCastling(kingPosition, createSquare(G, _1))
            ],
            sortMoveList
        ));
    });

    it('returns all possible moves for the white e pawn', () => {
        const game = createGame(STANDARD_INITIAL_POSITION, []);
        const ePawnPosition = createSquare(E, _2);
        const possibleMoves = pipe(
            calcAllPossibleMoves(game, ePawnPosition),
            sortMoveList
        );

        expect(possibleMoves).toEqual(pipe(
            [
                createRegularMove(ePawnPosition, createSquare(E, _3)),
                createRegularMove(ePawnPosition, createSquare(E, _4))
            ],
            sortMoveList
        ));
    });

    it('returns all possible moves for the black e pawn', () => {
        const ePawnPosition = createSquare(E, _7);

        const game = createGame(STANDARD_INITIAL_POSITION, createMoveHistory([
            createRegularMove(createSquare(E, _2), createSquare(E, _4))
        ]));

        const possibleMoves = pipe(
            calcAllPossibleMoves(game, ePawnPosition),
            sortMoveList
        );

        expect(possibleMoves).toEqual(pipe(
            [
                createRegularMove(ePawnPosition, createSquare(E, _6)),
                createRegularMove(ePawnPosition, createSquare(E, _5))
            ],
            sortMoveList
        ));
    });

    it('filters out moves that would put the black player into check', () => {
        const moveHistory = createMoveHistory([
            createRegularMove(createSquare(E, _2), createSquare(E, _4)),
            createRegularMove(createSquare(E, _7), createSquare(E, _5)),
            createRegularMove(createSquare(D, _1), createSquare(H, _5))
        ]);

        const game = createGame(STANDARD_INITIAL_POSITION, moveHistory);
        const pawnPosition = createSquare(F, _7);

        const possibleMoves = pipe(
            calcAllPossibleMoves(game, pawnPosition),
            sortMoveList
        );

        expect(possibleMoves).toEqual([]);
    });

    it('filters out moves that would put the white player into check', () => {
        const moveHistory = createMoveHistory([
            createRegularMove(createSquare(E, _2), createSquare(E, _4)),
            createRegularMove(createSquare(E, _7), createSquare(E, _5)),
            createRegularMove(createSquare(G, _1), createSquare(E, _2)),
            createRegularMove(createSquare(D, _8), createSquare(H, _4))
        ]);

        const game = createGame(STANDARD_INITIAL_POSITION, moveHistory);
        const pawnPosition = createSquare(F, _2);

        const possibleMoves = pipe(
            calcAllPossibleMoves(game, pawnPosition),
            sortMoveList
        );

        expect(possibleMoves).toEqual([]);
    });

    it('only ioncludes moves that resolve a check for black', () => {
        const moveHistory = createMoveHistory([
            createRegularMove(createSquare(E, _2), createSquare(E, _4)),
            createRegularMove(createSquare(E, _7), createSquare(E, _5)),
            createRegularMove(createSquare(D, _1), createSquare(H, _5)),
            createRegularMove(createSquare(G, _8), createSquare(F, _6)),
            createRegularMove(createSquare(H, _5), createSquare(E, _5))
        ]);

        const game = createGame(STANDARD_INITIAL_POSITION, moveHistory);
        const bishopPosition = createSquare(F, _8);

        const possibleMoves = pipe(
            calcAllPossibleMoves(game, bishopPosition),
            sortMoveList
        );

        expect(possibleMoves).toEqual([
            createRegularMove(bishopPosition, createSquare(E, _7))
        ]);
    });

    it('only includes moves that resolve a check for black king', () => {
        const moveHistory = createMoveHistory([
            createRegularMove(createSquare(E, _2), createSquare(E, _4)),
            createRegularMove(createSquare(E, _7), createSquare(E, _5)),
            createRegularMove(createSquare(D, _1), createSquare(H, _5)),
            createRegularMove(createSquare(G, _8), createSquare(F, _6)),
            createRegularMove(createSquare(H, _5), createSquare(E, _5))
        ]);

        const game = createGame(STANDARD_INITIAL_POSITION, moveHistory);
        const bishopPosition = createSquare(E, _8);

        const possibleMoves = pipe(
            calcAllPossibleMoves(game, bishopPosition),
            sortMoveList
        );

        expect(possibleMoves).toEqual([]);
    });

    it('omits castling while in check', () => {
        const moveHistory = createMoveHistory([
            createRegularMove(createSquare(E, _2), createSquare(E, _4)),
            createRegularMove(createSquare(E, _7), createSquare(E, _5)),
            createRegularMove(createSquare(D, _2), createSquare(D, _3)),
            createRegularMove(createSquare(B, _8), createSquare(C, _6)),
            createRegularMove(createSquare(B, _1), createSquare(C, _3)),
            createRegularMove(createSquare(F, _8), createSquare(B, _4)),
            createRegularMove(createSquare(D, _1), createSquare(H, _5)),
            createRegularMove(createSquare(G, _8), createSquare(F, _6)),
            createRegularMove(createSquare(H, _5), createSquare(E, _5)),
        ]);

        const game = createGame(STANDARD_INITIAL_POSITION, moveHistory);

        console.debug(pipe(
            getCurrentBoard(game),
            map((board: Board) => boardToString(board)),
            getOrElse(() => 'Failed')
        ))
        const bishopPosition = createSquare(E, _8);

        const possibleMoves = pipe(
            calcAllPossibleMoves(game, bishopPosition),
            sortMoveList
        );

        expect(possibleMoves).toEqual([
            createRegularMove(bishopPosition, createSquare(F, _8))
        ]);
    });
});