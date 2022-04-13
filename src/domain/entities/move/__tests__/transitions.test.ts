import { pipe } from 'fp-ts/lib/function';
import { PieceType } from '../../piece/Piece';
import { createSquare } from '../../square/constructors';
import { A, B, C, G, _3, _4, _6, _7 } from '../../square/Square';
import { createPromotion, createRegularMove } from '../constructors';
import { Move } from '../Move';
import { sortMoveList } from '../transition';

describe('domain./enities/move/transitions', () => {
    describe('sortMoves', () => {
        it('sorts two different lists with the same elemnts to the same order', () => {
            const firstList:Move[] = pipe(
                [
                    createRegularMove(createSquare(B, _7), createSquare(C, _4)),
                    createRegularMove(createSquare(G, _6), createSquare(A, _3)),
                    createRegularMove(createSquare(B, _7), createSquare(C, _4)),
                    createPromotion(createSquare(B, _7),createSquare(A, _3), PieceType.Queen),
                    createPromotion(createSquare(B, _7),createSquare(A, _3), PieceType.Knight),
                    createPromotion(createSquare(B, _6),createSquare(A, _3), PieceType.Knight)
                ],
                sortMoveList
            );

            const secondList:Move[] = pipe(
                [
                    createRegularMove(createSquare(G, _6), createSquare(A, _3)),
                    createPromotion(createSquare(B, _7),createSquare(A, _3), PieceType.Queen),
                    createPromotion(createSquare(B, _7),createSquare(A, _3), PieceType.Knight),
                    createRegularMove(createSquare(B, _7), createSquare(C, _4)),
                    createPromotion(createSquare(B, _6),createSquare(A, _3), PieceType.Knight),
                    createRegularMove(createSquare(B, _7), createSquare(C, _4)),
                ],
                sortMoveList
            );

            expect(firstList).toEqual(secondList);
        });
    });
});