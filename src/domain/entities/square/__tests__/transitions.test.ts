import { pipe } from 'fp-ts/lib/function';
import {A, B, C, F, G, H, Square, _1, _2, _3, _4, _5, _6, _8} from '../Square';
import { toLeft, toLower, toRight, toUpper, MoveAmount } from '../transitions';
import { createSquare } from '../constructors';
import { isNull } from '../../../../lib/nullable';

describe('domain/entities/square/transitions', () => {
    describe('toRight', () => {
        it('gets the square on the right of the current', () => {
            const test = (sq:Square, amount: MoveAmount, expected: Square) => {
                const rightSq = pipe(
                    sq, 
                    toRight(amount),
                );
                expect(rightSq).toEqual(expected);
            }

            test(createSquare(A, _1), 1, createSquare(B, _1));
            test(createSquare(A, _2), 1, createSquare(B, _2));
            test(createSquare(A, _1), 2, createSquare(C, _1));
            test(createSquare(C, _2), 3, createSquare(F, _2));
        });

        it('returns undefined when out of board', () => {
            const test = (sq: Square, amount: MoveAmount) => {
                const rightSq = toRight(amount)(sq);
                expect(rightSq).toBeUndefined();
            }

            test(createSquare(H, _1), 1);
            test(createSquare(H, _1), 2);
            test(createSquare(G, _3), 2);
            test(createSquare(G, _3), 3);
            test(createSquare(F, _2), 3);
            test(createSquare(F, _2), 4);
        });
    });

    describe('toLeft', () => {
        it('gets the square on the left of the current', () => {
            const test = (sq:Square, amount: MoveAmount, expected: Square) => {
                const leftSq = pipe(
                    sq, 
                    toLeft(amount)
                );
                expect(leftSq).toEqual(expected);
            }

            test(createSquare(H, _1), 1, createSquare(G, _1));
            test(createSquare(G, _2), 1, createSquare(F, _2));
            test(createSquare(H, _1), 2, createSquare(F, _1));
            test(createSquare(F, _2), 3, createSquare(C, _2));
        });

        it('fails when out of board', () => {
            const test = (sq: Square, amount: MoveAmount) => {
                const leftSq = toLeft(amount)(sq);
                expect(isNull(leftSq)).toBe(true);
            }

            test(createSquare(A, _1), 1);
            test(createSquare(A, _1), 2);
            test(createSquare(B, _3), 2);
            test(createSquare(B, _3), 3);
            test(createSquare(C, _2), 3);
            test(createSquare(C, _2), 4);
        });
    });

    describe('toUpper', () => {
        it('gets the square further away from the white player', () => {
            const test = (sq:Square, amount: MoveAmount, expected: Square) => {
                const upSq = pipe(
                    sq, 
                    toUpper(amount),
                );
                expect(upSq).toEqual(expected);
            }

            test(createSquare(H, _1), 1, createSquare(H, _2));
            test(createSquare(G, _2), 1, createSquare(G, _3));
            test(createSquare(H, _3), 2, createSquare(H, _5));
            test(createSquare(F, _5), 3, createSquare(F, _8));
            test(createSquare(B, _3), 5, createSquare(B, _8));
        });

        it('fails when out of board', () => {
            const test = (sq: Square, amount: MoveAmount) => {
                const upSq = toUpper(amount)(sq);
                expect(isNull(upSq)).toBe(true);
            }

            test(createSquare(B, _3), 6);
            test(createSquare(B, _3), 7);
            test(createSquare(C, _2), 7);
            test(createSquare(C, _2), 7);
        });
    });

    describe('toLower', () => {
        it('gets the square closer to the white player', () => {
            const test = (sq:Square, amount: MoveAmount, expected: Square) => {
                const lowSq = pipe(
                    sq, 
                    toLower(amount),
                );
                expect(lowSq).toEqual(expected);
            }

            test(createSquare(H, _2), 1, createSquare(H, _1));
            test(createSquare(G, _3), 1, createSquare(G, _2));
            test(createSquare(H, _5), 2, createSquare(H, _3));
            test(createSquare(F, _8), 3, createSquare(F, _5));
            test(createSquare(B, _8), 7, createSquare(B, _1));
        });

        it('fails when out of board', () => {
            const test = (sq: Square, amount: MoveAmount) => {
                const lowSq = toLower(amount)(sq);
                expect(isNull(lowSq)).toBe(true);
            }

            test(createSquare(A, _1), 1);
            test(createSquare(B, _3), 3);
            test(createSquare(B, _3), 4);
            test(createSquare(C, _2), 2);
            test(createSquare(C, _2), 4);
        });
    });
});