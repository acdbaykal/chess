import { calcHashCode, equals, getMoveAt, getLastMove, getPreviousMove } from "../getters";
import { createRegularMove } from "../../move/constructors";
import { createSquare } from "../../square/constructors";
import { B, C, E, _1, _2, _3, _4, _5, _7 } from "../../square/Square";
import { createMoveHistory} from "../constructors";
import { Move } from "../../move/Move";
import { MoveHistory } from "../MoveHistory";

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

    describe('get move at index', () => {
        const moveHistory = createMoveHistory([
            createRegularMove(
                createSquare(E, _2),
                createSquare(E, _4)
            ),
            createRegularMove(
                createSquare(E, _7),
                createSquare(E, _5)
            ),
            createRegularMove(
                createSquare(B, _1),
                createSquare(C, _3)
            )
        ]);


        it('returns the move at given index', () => {
            
            const test = (index:number, expected: Move) => {
                const move = getMoveAt(index)(moveHistory);
                expect(move).toEqual(expected);
            };

            test(1, createRegularMove(
                createSquare(E, _7),
                createSquare(E, _5)
            ));

            test(2, createRegularMove(
                createSquare(B, _1),
                createSquare(C, _3)
            ));
        });

        it('returns none when index is outof bounds',  ()=> {
            const test = (moveHistory:MoveHistory, index:number) => {
                const move = getMoveAt(index)(moveHistory);
                expect(move).toBeUndefined();
            };

            test(moveHistory, 3);
            test(moveHistory, -1);
            test(createMoveHistory([]), 0);
        });
    });

    describe('get last move', () => {
        it('returns last move', () => {
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

            const lastMove = getLastMove(moveHistory);

            expect(lastMove).toEqual(createRegularMove(
                createSquare(E, _7),
                createSquare(E, _5)
            ));
        });

        it('returns none when empty', () => {
            const moveHistory = createMoveHistory([]);
            const lastMove = getLastMove(moveHistory);
            expect(lastMove).toBeUndefined();
        });
    });

    describe('getPrevious move', () => {
        it('returns the second last move', () => {
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

            const previousMove = getPreviousMove(moveHistory);
            expect(previousMove).toEqual(createRegularMove(
                createSquare(E, _2),
                createSquare(E, _4)
            ));
        });


        it('returns none when empty or with single element', () => {
            const test = (moves: Move[]) => {
                const moveHistory = createMoveHistory(moves);
                const lastMove = getPreviousMove(moveHistory);
                expect(lastMove).toBeUndefined;
            };
            test([]);
            test([
                createRegularMove(
                    createSquare(E, _7),
                    createSquare(E, _5)
                )
            ]);
        });
    });
});