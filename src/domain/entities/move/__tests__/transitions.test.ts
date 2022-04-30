import { pipe } from 'fp-ts/lib/function';
import { PieceType } from '../../piece/Piece';
import { createSquare } from '../../square/constructors';
import { A, B, C, D, E, F, G, _3, _4, _5, _6, _7, _8 } from '../../square/Square';
import { createEnPassant, createPromotion, createRegularMove } from '../constructors';
import { Move, Promotion } from '../Move';
import { sortMoveList } from '../transition';

describe('domain./enities/move/transitions', () => {
    describe('sortMoves', () => {
        it('sorts regular moves', () => {
            const firstList:Move[] = pipe(
                [
                    createRegularMove(createSquare(B, _7), createSquare(C, _4)),
                    createRegularMove(createSquare(G, _6), createSquare(A, _3)),
                    createRegularMove(createSquare(B, _7), createSquare(C, _4)),
                    createRegularMove(createSquare(B, _7), createSquare(D, _3)),
                    createRegularMove(createSquare(F, _4), createSquare(D, _3)),
                ],
                sortMoveList
            );

            const secondList:Move[] = pipe(
                [
                    createRegularMove(createSquare(G, _6), createSquare(A, _3)),
                    createRegularMove(createSquare(F, _4), createSquare(D, _3)),
                    createRegularMove(createSquare(B, _7), createSquare(C, _4)),
                    createRegularMove(createSquare(B, _7), createSquare(D, _3)),
                    createRegularMove(createSquare(B, _7), createSquare(C, _4))
                ],
                sortMoveList
            );

            expect(firstList).toEqual(secondList);
        });

        it('sorts promotion moves', () => {
            const firstList: Move[] = pipe(
                [
                    createPromotion(createSquare(G, _7), createSquare(G, _8), PieceType.Queen),
                    createPromotion(createSquare(B, _7), createSquare(B, _8), PieceType.Queen),
                    createPromotion(createSquare(G, _7), createSquare(G, _8), PieceType.Knight),
                    createPromotion(createSquare(G, _7), createSquare(G, _8), PieceType.Bishop),
                    createPromotion(createSquare(B, _7), createSquare(B, _8), PieceType.Queen),
                    createPromotion(createSquare(B, _7), createSquare(A, _8), PieceType.Bishop),
                    createPromotion(createSquare(B, _7), createSquare(B, _8), PieceType.Knight),
                ],
                sortMoveList
            );

            const secondList: Move[] = pipe(
                [
                    createPromotion(createSquare(B, _7), createSquare(B, _8), PieceType.Knight),
                    createPromotion(createSquare(B, _7), createSquare(B, _8), PieceType.Queen),
                    createPromotion(createSquare(B, _7), createSquare(B, _8), PieceType.Queen),
                    createPromotion(createSquare(G, _7), createSquare(G, _8), PieceType.Queen),
                    createPromotion(createSquare(B, _7), createSquare(A, _8), PieceType.Bishop),
                    createPromotion(createSquare(G, _7), createSquare(G, _8), PieceType.Knight),
                    createPromotion(createSquare(G, _7), createSquare(G, _8), PieceType.Bishop),
                ],
                sortMoveList
            );

            expect(firstList).toEqual(secondList);
        });

        it('sorts enpassant moves', () => {
                const firstList:Move[] = pipe(
                    [
                        createEnPassant(createSquare(E, _4), createSquare(F, _3)),
                        createEnPassant(createSquare(E, _4), createSquare(D, _3)),
                        createEnPassant(createSquare(E, _5), createSquare(D, _6)),
                        createEnPassant(createSquare(E, _5), createSquare(F, _6)),
                    ],
                    sortMoveList
                );

                const secondList:Move[] = pipe(
                    [
                        createEnPassant(createSquare(E, _5), createSquare(D, _6)),
                        createEnPassant(createSquare(E, _4), createSquare(F, _3)),
                        createEnPassant(createSquare(E, _5), createSquare(F, _6)),
                        createEnPassant(createSquare(E, _4), createSquare(D, _3))
                    ],
                    sortMoveList
                );

                expect(firstList).toEqual(secondList);
        });

        it('sorts mixed type moves', () => {
            const firstList:Move[] = pipe(
                [
                    createRegularMove(createSquare(B, _7), createSquare(C, _4)),
                    createRegularMove(createSquare(G, _6), createSquare(A, _3)),
                    createRegularMove(createSquare(B, _7), createSquare(C, _4)),
                    createPromotion(createSquare(B, _7),createSquare(A, _3), PieceType.Queen),
                    createPromotion(createSquare(B, _7),createSquare(A, _3), PieceType.Knight),
                    createPromotion(createSquare(B, _6),createSquare(A, _3), PieceType.Knight),
                    createEnPassant(createSquare(E, _4), createSquare(F, _3)),
                    createEnPassant(createSquare(E, _4), createSquare(D, _3))
                ],
                sortMoveList
            );

            const secondList:Move[] = pipe(
                [
                    createPromotion(createSquare(B, _6),createSquare(A, _3), PieceType.Knight),
                    createEnPassant(createSquare(E, _4), createSquare(D, _3)),
                    createRegularMove(createSquare(B, _7), createSquare(C, _4)),
                    createPromotion(createSquare(B, _7),createSquare(A, _3), PieceType.Queen),
                    createEnPassant(createSquare(E, _4), createSquare(F, _3)),
                    createRegularMove(createSquare(G, _6), createSquare(A, _3)),
                    createPromotion(createSquare(B, _7),createSquare(A, _3), PieceType.Knight),
                    createRegularMove(createSquare(B, _7), createSquare(C, _4))
                ],
                sortMoveList
            );

            expect(firstList).toEqual(secondList);
        });
    });
});