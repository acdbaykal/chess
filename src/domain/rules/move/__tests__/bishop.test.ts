import { pipe } from "fp-ts/lib/function";
import { createBoardFromList } from "../../../entities/board/constructors";
import { createMoveList } from "../../../entities/move/constructors";
import { sortMoveList } from "../../../entities/move/transition";
import { createPiece } from "../../../entities/piece/constructors";
import { PieceColor, PieceType } from "../../../entities/piece/Piece";
import { reversePieceColor } from "../../../entities/piece/transition";
import { createSquare } from "../../../entities/square/constructors";
import { A, B, C, D, E, F, G, H, Square, _1, _2, _3, _4, _5, _6, _7, _8 } from "../../../entities/square/Square";
import { getLegalMoves } from "../bishop";

describe('domain/rules/mpves/bishop', () => {
    describe('getLegalMoves', () => {
        describe('empty board', () => {
            it('returns empty list when it can not find the bishop on the given square', () => {
                const board = createBoardFromList([]);
                const moves = getLegalMoves(board, createSquare(D, _5));
                expect(moves).toEqual([]);
            });
        })

        describe('board with only the bishop on', () => {
            it('returns all moves from current position without considering other pices on the board', () => {
                
                const test  = (square: Square, expected: Square[]) =>{
                    const board = createBoardFromList([[square, createPiece(PieceColor.White, PieceType.Bishop)]]);
                    
                    const moves = pipe(
                        getLegalMoves(board, square),
                        sortMoveList
                    );
                    const expectedMoves = pipe(
                        expected,
                        createMoveList(square),
                        sortMoveList
                    );
                    expect(moves).toEqual(expectedMoves);
                };
    
                test(createSquare(D, _5), [
                    createSquare(A, _2),
                    createSquare(B, _3),
                    createSquare(C, _4),
                    createSquare(E, _6),
                    createSquare(F, _7),
                    createSquare(G, _8),
                    createSquare(A, _8),
                    createSquare(B, _7),
                    createSquare(C, _6),
                    createSquare(E, _4),
                    createSquare(F, _3),
                    createSquare(G, _2),
                    createSquare(H, _1)
                ])
            });
        });
    });

    describe('with other pieces on the board', () => {
        it('stops when it encounters a piece with the same color on the board', () => {
            const test = (color: PieceColor) => {
                const board = createBoardFromList([
                    [createSquare(D, _5), createPiece(color, PieceType.Bishop)],
                    [createSquare(B, _3), createPiece(color, PieceType.Pawn)],
                    [createSquare(C, _4), createPiece(color, PieceType.Pawn)],
                    [createSquare(B, _7), createPiece(color, PieceType.Rook)],
                    [createSquare(F, _7), createPiece(color, PieceType.Bishop)],
                    [createSquare(G, _2), createPiece(color, PieceType.Knight)]
                ]);

                const moves = pipe(
                    getLegalMoves(board, createSquare(D, _5)),
                    sortMoveList
                );
                const expected = pipe(
                    [
                        createSquare(C, _6),
                        createSquare(E, _6),
                        createSquare(E, _4),
                        createSquare(F, _3)
                    ],
                    createMoveList(createSquare(D, _5)),
                    sortMoveList
                );
                expect(moves).toEqual(expected);
            };
            test(PieceColor.White);
            test(PieceColor.Black);
        });

        it('stops when it encounters the oppsite color king', () => {
            const test = (color: PieceColor) => {
                const reverseColor = reversePieceColor(color);
                const board = createBoardFromList([
                    [createSquare(D, _5), createPiece(color, PieceType.Bishop)],
                    [createSquare(C, _4), createPiece(reverseColor, PieceType.King)],
                ]);

                const moves = pipe(
                    getLegalMoves(board, createSquare(D, _5)),
                    sortMoveList
                );

                const expected = pipe(
                    [
                        createSquare(A, _8),
                        createSquare(B, _7),
                        createSquare(C, _6),
                        createSquare(E, _4),
                        createSquare(F, _3),
                        createSquare(G, _2),
                        createSquare(H, _1),
                        createSquare(E, _6),
                        createSquare(F, _7),
                        createSquare(G, _8)
                    ],
                    createMoveList(createSquare(D, _5)),
                    sortMoveList
                );

                expect(moves).toEqual(expected);
            };

            test(PieceColor.Black);
            test(PieceColor.White);
        });

        it('stops at and includes a square  with a piece  of the opposite color on it', () => {
            const test = (color: PieceColor) => {
                const oppositeColor = reversePieceColor(color);
                const board = createBoardFromList([
                    [createSquare(D, _5), createPiece(color, PieceType.Bishop)],
                    [createSquare(B, _3), createPiece(oppositeColor, PieceType.Pawn)],
                    [createSquare(C, _4), createPiece(oppositeColor, PieceType.Pawn)],
                    [createSquare(B, _7), createPiece(oppositeColor, PieceType.Rook)],
                    [createSquare(F, _7), createPiece(oppositeColor, PieceType.Bishop)],
                    [createSquare(G, _2), createPiece(oppositeColor, PieceType.Knight)]
                ]);

                const moves = pipe(
                    getLegalMoves(board, createSquare(D, _5)),
                    sortMoveList
                );
                const expected = pipe(
                    [
                        createSquare(C, _4),
                        createSquare(C, _6),
                        createSquare(B, _7),
                        createSquare(E, _6),
                        createSquare(F, _7),
                        createSquare(E, _4),
                        createSquare(F, _3),
                        createSquare(G, _2)
                    ],
                    createMoveList(createSquare(D, _5)),
                    sortMoveList
                );
                expect(moves).toEqual(expected);
            };
            test(PieceColor.White);
            test(PieceColor.Black);
        });
    });
        
});