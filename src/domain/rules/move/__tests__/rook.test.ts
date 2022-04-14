import { pipe } from "fp-ts/lib/function";
import { createBoardFromList } from "../../../entities/board/constructors";
import { createMoveList } from "../../../entities/move/constructors";
import { sortMoveList } from "../../../entities/move/transition";
import { createPiece } from "../../../entities/piece/constructors";
import { PieceColor, PieceType } from "../../../entities/piece/Piece";
import { reversePieceColor } from "../../../entities/piece/transition";
import { createSquare } from "../../../entities/square/constructors";
import { A, B, C, D, E, F, G, H, Square, _1, _2, _3, _4, _5, _6, _7, _8 } from "../../../entities/square/Square";
import {getLegalMoves} from '../../move/rook';

describe('domain/rules/moves/rook', () => {
    describe('getLegalMoves', () => {
        describe('empty board', () => {
            it('return empty array when a rook can not be found at given square', () => {
                const board = createBoardFromList([]);
                const moveStart = createSquare(D, _5);
                const result = getLegalMoves(board, moveStart);
                expect(result).toEqual([]);
            })
        });

        describe('board with single piece', () => {
            it('returns empty array when the piece at given squatre is not a rook', () => {
                const moveStart = createSquare(D, _5);
                const board = createBoardFromList([
                    [moveStart, createPiece(PieceColor.Black, PieceType.Knight)]
                ]);
                const result = getLegalMoves(board, moveStart);
                expect(result).toEqual([]);
            });
    
    
            it('returns all legal moves until the edeg of the board', () => {
                const test  = (square: Square, expected: Square[]) =>{
                    const board = createBoardFromList([[square, createPiece(PieceColor.White, PieceType.Rook)]]);
                    
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
                    createSquare(D, _1),
                    createSquare(D, _2),
                    createSquare(D, _3),
                    createSquare(D, _4),
                    createSquare(D, _6),
                    createSquare(D, _7),  
                    createSquare(D, _8),
                    createSquare(A, _5),
                    createSquare(B, _5),
                    createSquare(C, _5),
                    createSquare(E, _5),
                    createSquare(F, _5),
                    createSquare(G, _5),
                    createSquare(H, _5),
                ]);
            });
        });
    
        describe('with pieces of the same color on the board', () => {
            const test  = (color: PieceColor) =>{
                const square = createSquare(D, _5);
                const board = createBoardFromList([
                    [square, createPiece(color, PieceType.Rook)],
                    [createSquare(D, _7), createPiece(color, PieceType.Pawn)],
                    [createSquare(D, _1), createPiece(color, PieceType.Knight)],
                    [createSquare(D, _3), createPiece(color, PieceType.Bishop)],
                    [createSquare(D, _4), createPiece(color, PieceType.Queen)],
                    [createSquare(B, _5), createPiece(color, PieceType.Pawn)],
                    [createSquare(G, _5), createPiece(color, PieceType.Pawn)]
                ]);
                
                const moves = pipe(
                    getLegalMoves(board, square),
                    sortMoveList
                );
                const expectedMoves = pipe(
                    [
                        createSquare(D, _6),
                        createSquare(C, _5),
                        createSquare(E, _5),
                        createSquare(F, _5),
                    ],
                    createMoveList(square),
                    sortMoveList
                );
                expect(moves).toEqual(expectedMoves);
            };
    
            it('stops at pice with the same color', () => {
                test(PieceColor.White);
                test(PieceColor.Black);
            });
            
        });
    
        describe('with pieces of the opposite color on the board', () => {
            
            it('includes the pices in the move destionations and stops', () => {
                const test  = (color: PieceColor) => {
                    const square = createSquare(D, _5);
                    const oppositeColor = reversePieceColor(color);
                    const board = createBoardFromList([
                        [square, createPiece(color, PieceType.Rook)],
                        [createSquare(D, _7), createPiece(oppositeColor, PieceType.Pawn)],
                        [createSquare(D, _1), createPiece(oppositeColor, PieceType.Knight)],
                        [createSquare(D, _3), createPiece(oppositeColor, PieceType.Bishop)],
                        [createSquare(D, _4), createPiece(oppositeColor, PieceType.Queen)],
                        [createSquare(B, _5), createPiece(oppositeColor, PieceType.Pawn)],
                        [createSquare(G, _5), createPiece(oppositeColor, PieceType.Pawn)]
                    ]);
                    
                    const moves = pipe(
                        getLegalMoves(board, square),
                        sortMoveList
                    );
                    
                    const expectedMoves = pipe(
                        [
                            createSquare(D, _6),
                            createSquare(D, _7),
                            createSquare(D, _4),
                            createSquare(C, _5),
                            createSquare(B, _5),
                            createSquare(E, _5),
                            createSquare(F, _5),
                            createSquare(G, _5),
                        ],
                        createMoveList(square),
                        sortMoveList
                    );
                    expect(moves).toEqual(expectedMoves);
                };

                test(PieceColor.White);
                test(PieceColor.Black);
            });

            it('includes the square which hosts the oppiste colored king', () => {
                const test = (color: PieceColor) => {
                    const square = createSquare(D, _5);
                    const oppositeColor = reversePieceColor(color);
                    const board = createBoardFromList([
                        [square, createPiece(color, PieceType.Rook)],
                        [createSquare(D, _7), createPiece(oppositeColor, PieceType.King)]
                    ]);

                    const moves = pipe(
                        getLegalMoves(board, square),
                        sortMoveList
                    );

                    const expected = pipe(
                        [
                            createSquare(D, _1),
                            createSquare(D, _2),
                            createSquare(D, _3),
                            createSquare(D, _4),
                            createSquare(D, _6),
                            createSquare(D, _7),
                            createSquare(C, _5),
                            createSquare(B, _5),
                            createSquare(E, _5),
                            createSquare(F, _5),
                            createSquare(G, _5),
                        ],
                        createMoveList(square),
                        sortMoveList
                    );
                    
                    expect(moves).toEqual(expected);
                };
            });
        });
    });
});