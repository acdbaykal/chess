import { createSquare } from "../../square/constructors";
import { A, E, G, _1 } from "../../square/Square";
import { createCastling } from "../constructors";
import { isShortCastling } from "../getters";

describe('domain/entities/move/getters', () => {
    describe('isShortCastling', () => {
        it('returns true when the king moves to the right', () => {
            const from = createSquare(E, _1);
            const to = createSquare(G, _1);
            const move = createCastling(from, to);
            expect(isShortCastling(move)).toBe(true);
        });

        it('returns false when the king moves to the left', () => {
            const from = createSquare(E, _1);
            const to = createSquare(A, _1);
            const move = createCastling(from, to);
            expect(isShortCastling(move)).toBe(false);
        });
    });
});
