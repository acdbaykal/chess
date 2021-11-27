import { getMoves } from "../../move/knight";
import { Move } from "../../../entities/move/Move";
import { A, B, C, D, E, Square, _1, _2, _3, _4, _5 } from "../../../entities/square/Square";
import { createSquare } from "../../../entities/square/constructors";
import { createMove } from "../../../entities/move/constructors";
import { getMoveTo } from "../../../entities/move/getters";
import { getLetterAxis, getNumericAxis, isLeftOf, isUpOf } from "../../../entities/square/getters";

describe('domain/rule/move/knight', () => {
    describe('getMoves', () => {

        // unfortunatelly we must sort the move arrays in order to compare them
        const sortFn = (move1: Move, move2: Move):number => {
            const to1 = getMoveTo(move1);
            const to2 = getMoveTo(move2);
            const sameLetter = getLetterAxis(to1) === getLetterAxis(to2);
            const sameNum = getNumericAxis(to1) === getNumericAxis(to2);
            
            if(sameLetter && sameNum){
                return 0;
            } else if(sameLetter) {
                return isUpOf(to1)(to2) ? -1 : 1; 
            }

            return isLeftOf(to1)(to2) ? -1 : 1;
        }

        it('calculates alll the moves from the given square', () => {
            const test  = (square: Square, expected: Square[]) =>{
                const moves = getMoves(square).sort(sortFn);
                const expectedMoves = expected.map(
                    expectedSquare => createMove(square, expectedSquare)
                ).sort(sortFn);
                expect(moves).toEqual(expectedMoves);
            }

            test(createSquare(B, _3), [
                createSquare(A, _1),
                createSquare(A, _5),
                createSquare(C, _1),
                createSquare(C, _5),
                createSquare(D, _2),
                createSquare(D, _4)
            ]);

            test(createSquare(A, _1), [
                createSquare(C, _2),
                createSquare(B, _3)
            ]);

            test(createSquare(C, _3), [
                createSquare(A, _2),
                createSquare(A, _4),
                createSquare(B, _1),
                createSquare(B, _5),
                createSquare(D, _1),
                createSquare(D, _5),
                createSquare(E, _2),
                createSquare(E, _4),
            ]);
        });
    })
});