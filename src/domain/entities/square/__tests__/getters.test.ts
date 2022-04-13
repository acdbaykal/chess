import { createSquare } from "../constructors";
import { getFile, getRank, isLeftOf, isRightOf, squareEquals } from "../getters";
import { A, B, C, Square, _1, _2 } from "../Square";

describe('domain/entities/square', () => {
    describe('getFile', () => {
        it('get the alphabetic coordinate', () => {
            const square = createSquare(B, _2);
            const axis = getFile(square);
            expect(axis).toBe(B);
        });
    });

    describe('getRank', () =>{
        it('gets the numeric coordinate', () => {
            const square = createSquare(B, _2);
            const axis = getRank(square);
            expect(axis).toBe(_2);
        });
    });

    describe('squareEquals', () => {
        it('compares two squares', () => {
            const test = (sq1: Square, sq2: Square, expected: boolean) =>{
                const result = squareEquals(sq1)(sq2);
                expect(result).toBe(expected);
            };

            test(createSquare(A, _1), createSquare(A, _1), true);
            test(createSquare(B, _2), createSquare(B, _2), true);
            test(createSquare(A,_1), createSquare(B,_2), false);
        });
    });

    describe('isRightOf', () => {
        it('detemines if the second square is right of the first one from white\'s perspecgtive', () => {
            const test = (sq1: Square, sq2: Square, expected: boolean) =>{
                const result = isRightOf(sq1)(sq2);
                expect(result).toBe(expected);
            };

            test(createSquare(A, _1), createSquare(A, _2), false);
            test(createSquare(A, _1), createSquare(B, _1), true);
            test(createSquare(B, _1), createSquare(A, _1), false);
            test(createSquare(A, _1), createSquare(C, _2), true);
            test(createSquare(C, _1), createSquare(A, _1), false);
        })
    });

    describe('isLeftOf', () => {
        it('detemines if the second square is left of the first one from white\'s perspecgtive', () => {
            const test = (sq1: Square, sq2: Square, expected: boolean) =>{
                const result = isLeftOf(sq1)(sq2);
                expect(result).toBe(expected);
            };

            test(createSquare(A, _1), createSquare(A, _2), false);
            test(createSquare(A, _1), createSquare(B, _1), false);
            test(createSquare(B, _1), createSquare(A, _1), true);
            test(createSquare(A, _1), createSquare(C, _2), false);
            test(createSquare(C, _1), createSquare(A, _1), true);
        })
    });
});