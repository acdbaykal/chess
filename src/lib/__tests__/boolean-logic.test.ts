import { and } from "../boolean-logic";

describe('boolean-logic', () => {
    describe('and', () => {
        it('returns true when all agragtes return true', () => {
            const result = and<[number]>(
                num => num === 1,
                num => num + 1 === 2
            )(1);

            expect(result).toBe(true);
        })

        it('returns false when any aggrate returns false', () => {
            const result = and<[]>(
                () => true,
                () => false
            )();

            expect(result).toBe(false);
        });
    });
});