import { pipe } from "fp-ts/lib/function";
import { STANDARD_INITIAL_POSITION } from "../../../entities/board/standard";
import { createGame } from "../../../entities/game/constructors";
import { createCastling, createMoveList, createRegularMove } from "../../../entities/move/constructors";
import { sortMoveList } from "../../../entities/move/transition";
import { createMoveHistory } from "../../../entities/movehistory/constructors";
import { createSquare } from "../../../entities/square/constructors";
import { A, B, C, D, E, F, G, H, _1, _2, _3, _4, _5, _6, _7 } from "../../../entities/square/Square";
import {calcAllPossibleMoves} from '../allPossible';

describe('rules/move/allPossible', () => {
    describe('Not in check', () => {
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
            const game  = createGame(STANDARD_INITIAL_POSITION, []);
            const ePawnPosition =  createSquare(E, _2);
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
            
            const game  = createGame(STANDARD_INITIAL_POSITION, createMoveHistory([
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
})