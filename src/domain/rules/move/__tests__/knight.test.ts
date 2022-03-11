import { getLegalMoves, getMoves } from "../../move/knight";
import { A, B, C, D, E, Square, _1, _2, _3, _4, _5 } from "../../../entities/square/Square";
import { createSquare } from "../../../entities/square/constructors";
import { createMoveList } from "../../../entities/move/constructors";
import { createBoardFromList } from "../../../entities/board/constructors";
import { createPiece } from "../../../entities/piece/constructors";
import { PieceColor, PieceType } from "../../../entities/piece/Piece";
import { sortMoveList } from "../../../entities/move/transition";
import { pipe } from "fp-ts/lib/function";
import { reversePieceColor } from "../../../entities/piece/transition";

describe('domain/rule/move/knight', () => {
    describe('getMoves', () => {
        it('calculates all the moves from the given square', () => {
            const test  = (square: Square, expected: Square[]) =>{
                const moves = pipe(
                    getMoves(square),
                    sortMoveList
                );
                
                const expectedMoves = pipe(
                    createMoveList(square)(expected),
                    sortMoveList
                );

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
    });

    describe('getLegalMoves', () => {
        it('eliminates moves where the destination is occupied by a piece of the same color', () => {
            const board = createBoardFromList([
                [createSquare(B, _3), createPiece(PieceColor.White, PieceType.Knight)],
                [createSquare(A, _1), createPiece(PieceColor.White, PieceType.Pawn)],
                [createSquare(C, _1), createPiece(PieceColor.Black, PieceType.Pawn)]
            ]);

            const moves = pipe(
                getLegalMoves(board, createSquare(B, _3)),
                sortMoveList
            );

            const expected = pipe(
                [
                    createSquare(A, _5),
                    createSquare(C, _1),
                    createSquare(C, _5),
                    createSquare(D, _2),
                    createSquare(D, _4)
                ],
                createMoveList(createSquare(B, _3)),
                sortMoveList
            );

            expect(moves).toEqual(expected);
        });

        it('eliminites moves which would land an the opposite king', () => {
            const test = (pieceColor: PieceColor) => {
                const oppositeColor = reversePieceColor(pieceColor);
                const board = createBoardFromList([
                    [createSquare(B, _3), createPiece(pieceColor, PieceType.Knight)],
                    [createSquare(A, _1), createPiece(oppositeColor, PieceType.King)]
                ]);

                const moves = pipe(
                    getLegalMoves(board, createSquare(B, _3)),
                    sortMoveList
                );

                const expected = pipe(
                    [
                        createSquare(A, _5),
                        createSquare(C, _5),
                        createSquare(D, _4),
                        createSquare(D, _2),
                        createSquare(C, _1)
                    ],
                    createMoveList( createSquare(B, _3)),
                    sortMoveList
                );

                expect(moves).toEqual(expected);
            }
        });
    });
});