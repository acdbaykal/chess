import { left, right } from "fp-ts/lib/Either";
import { STANDARD_INITIAL_POSITION } from "../../board/standard";
import { createRegularMove } from "../../move/constructors";
import { createMoveHistory } from "../../movehistory/constructors";
import { MoveHistory } from "../../movehistory/MoveHistory";
import { createSquare } from "../../square/constructors";
import { A, B, C, D, E, F, G, Square, _1, _2, _3, _4, _5, _6, _7, _8 } from "../../square/Square";
import { createGame } from "../constructors";
import { hasPieceMoved } from "../getters";

describe('domain/game/getters', () => {
    describe('hasPieceMoved', () => {
        const moveHistory: MoveHistory = createMoveHistory([
            createRegularMove(createSquare(E, _2), createSquare(E, _4)),
            createRegularMove(createSquare(E, _7), createSquare(E, _5)),
            createRegularMove(createSquare(B, _8), createSquare(C, _6)),
            createRegularMove(createSquare(G, _1), createSquare(F, _3)),
            createRegularMove(createSquare(G, _8), createSquare(F, _6)),
            createRegularMove(createSquare(B, _1), createSquare(C, _3)),
            createRegularMove(createSquare(D, _7), createSquare(D, _6)),
            createRegularMove(createSquare(F, _1), createSquare(B, _5)),
            createRegularMove(createSquare(A, _7), createSquare(A, _6)),
            createRegularMove(createSquare(B, _5), createSquare(C, _6)),
            createRegularMove(createSquare(B, _7), createSquare(C, _6))
        ]);

        const game = createGame(STANDARD_INITIAL_POSITION, moveHistory);

        it('returns right(true) when the piece has moved', () => {
            const test = (sq: Square) => {
                expect(hasPieceMoved(game, sq)).toEqual(right(true));
            };

            test(createSquare(E, _7));
            test(createSquare(E, _2));
            test(createSquare(G, _8));
            test(createSquare(D, _7));
        });

        it('returns right(false) when the piece has not moved', () => {
            const test = (sq: Square) => {
                expect(hasPieceMoved(game, sq)).toEqual(right(false));
            };

            test(createSquare(A, _2));
        });

        it('returns left when initial board doe not contain a piece at given sqaure', () => {
            const test = (sq: Square) => {
                expect(hasPieceMoved(game, sq)).toEqual(left(new Error('No piece available at starting position')));
            };

            test(createSquare(E, _4));
            test(createSquare(B, _5));
        });
    })
})