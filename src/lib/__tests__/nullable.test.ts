import { flowUntilNull, pipeUntilNull } from "../nullable";

describe('lib/nullable', () => {
    describe('pipeUntilNull', () => {
        it('pipes two functions', () => {
            const result = pipeUntilNull<number, number, number, number>(
                0,
                n => n + 1,
                n => n * 2
            )
            expect(result).toBe(2);
        });

        it('pipes three functions', () => {
            const result = pipeUntilNull<number, number, number, number>(
                0,
                n => n + 1,
                n => n * 2,
                n => n * 3,
            )
            expect(result).toBe(6);
        });

        it('returns undefined when a function returns null', () => {
            const result = pipeUntilNull<number, number, number, number, number>(
                0,
                n => n + 1,
                n => n * 2,
                () => null,
                n => n * 3,
            )
            expect(result).toBe(undefined);
        })


        it('returns undefined when a function returns undefined', () => {
            const result = pipeUntilNull<number, number, number, number, number>(
                0,
                n => n + 1,
                n => n * 2,
                () => undefined,
                n => n * 3,
            )
            expect(result).toBe(undefined);
        })
    });

    describe('flowUntilNull', () => {
        it('pipes a single doubling function', () => {
            const result = flowUntilNull<[number], number, number>(
                n => n * 2
            )(2);

            expect(result).toBe(4);
        });

        it('pipes a single square function', () => {
            const result = flowUntilNull<[number], number, number>(
                n => n * n
            )(3);

            expect(result).toBe(9);
        });

        it('pipes with  multiple start values', () => {
            const result = flowUntilNull<[number, number], number, number>(
                (n, m) => n * m
            )(3, 2);

            expect(result).toBe(6);
        });

        it('pipes two functions', () => {
            const result = flowUntilNull<[number], number, number, number>(
                n => n + 2,
                n => n * n
            )(3);

            expect(result).toBe(25);
        });

        it('returns undefined when a step returns null', () => {
            const result = flowUntilNull<[number], number, number, number>(
                n => n + 2,
                () => null,
                n => n * n
            )(3);

            expect(result).toBe(undefined);
        });
    });
});