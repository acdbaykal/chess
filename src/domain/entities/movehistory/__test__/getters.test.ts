import { calcHashCode, equals } from "../getters";
import { createRegularMove } from "../../move/constructors";
import { createSquare } from "../../square/constructors";
import { E, _2, _4, _5, _7 } from "../../square/Square";
import { createMoveHistory} from "../constructors";

describe('domain/entities/movehistory', () => {
    describe('calcHashCode', () => {
        it('returns a number for given move history', () => {
            const moveHistory = createMoveHistory([
                createRegularMove(
                    createSquare(E, _2),
                    createSquare(E, _4)
                ),
                createRegularMove(
                    createSquare(E, _7),
                    createSquare(E, _5)
                )
            ]);

            const hash = calcHashCode(moveHistory);
            expect(typeof hash).toBe('number');
        });
    });

    describe('areEqual', () => {
        it('returns true when the list of moves are structurally the same', () => {
            const moveHistory1 = createMoveHistory([
                createRegularMove(
                    createSquare(E, _2),
                    createSquare(E, _4)
                ),
                createRegularMove(
                    createSquare(E, _7),
                    createSquare(E, _5)
                )
            ]);
    
            const moveHistory2 = createMoveHistory([
                createRegularMove(
                    createSquare(E, _2),
                    createSquare(E, _4)
                ),
                createRegularMove(
                    createSquare(E, _7),
                    createSquare(E, _5)
                )
            ]);
    
            expect(equals(moveHistory1)(moveHistory2)).toBe(true);
        });

        it('returns true when the list of moves differ', () => {
            const moveList1 = createMoveHistory([
                createRegularMove(
                    createSquare(E, _2),
                    createSquare(E, _4)
                ),
                createRegularMove(
                    createSquare(E, _7),
                    createSquare(E, _5)
                )
            ]);
    
            const moveList2 = createMoveHistory([
                createRegularMove(
                    createSquare(E, _2),
                    createSquare(E, _4)
                ),
                createRegularMove(
                    createSquare(E, _5),
                    createSquare(E, _7)
                )
            ]);

            expect(equals(moveList1)(moveList2)).toBe(false);
        });
    });
});