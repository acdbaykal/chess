import { left, isLeft, right } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { none, some } from "fp-ts/lib/Option";
import { getOrUndefined } from "../../../../lib/either";
import { createCastling, createEnPassant, createPromotion, createRegularMove } from "../../move/constructors";
import { createPiece } from "../../piece/constructors";
import { PieceColor, PieceType } from "../../piece/Piece";
import { createSquare } from "../../square/constructors";
import { toString } from "../../square/getters";
import { A, B, C, D, E, F, G, H, _1, _2, _3, _4, _7, _8 } from "../../square/Square";
import { Board } from "../Board";
import { createBoardFromList } from "../constructors";
import { boardToString } from "../conversions";
import { getPieceAt } from "../getters";
import { applyMove, applyMoveHistory, removePiece, setPiece } from "../transitions";

describe('domain/entities/board/transitions', () => {
    describe('setPice', () => {
        it('creates new board with given peace at gove position', () => {
            const originalBoard = createBoardFromList([
                [createSquare(A, _2), createPiece(PieceColor.Black, PieceType.Bishop)] 
            ]);

            const derivedBoard = setPiece(originalBoard, createSquare(A, _3), createPiece(PieceColor.White, PieceType.Bishop));
            
            expect(derivedBoard).toEqual(createBoardFromList([
                [createSquare(A, _2), createPiece(PieceColor.Black, PieceType.Bishop)],
                [createSquare(A, _3), createPiece(PieceColor.White, PieceType.Bishop)]
            ]));
            expect(originalBoard).toEqual(createBoardFromList([ // remains unchanged
                [createSquare(A, _2), createPiece(PieceColor.Black, PieceType.Bishop)] 
            ]));
        });
    });

    describe('removePiece', () => {
        it('creates a new board without the a [iece at given square', () => {
            const originalBoard = createBoardFromList([
                [createSquare(A, _2), createPiece(PieceColor.Black, PieceType.Bishop)],
                [createSquare(A, _3), createPiece(PieceColor.White, PieceType.Bishop)]
            ]);

            const derivedBoard = removePiece(originalBoard, createSquare(A, _3));
            expect(derivedBoard).toEqual(createBoardFromList([
                [createSquare(A, _2), createPiece(PieceColor.Black, PieceType.Bishop)] 
            ]));

            expect(originalBoard).toEqual(createBoardFromList([ //remeins unchanged
                [createSquare(A, _2), createPiece(PieceColor.Black, PieceType.Bishop)],
                [createSquare(A, _3), createPiece(PieceColor.White, PieceType.Bishop)]
            ]));
        });
    })

    describe('applyMove', () =>{
        describe('regular move', () => {
            it('attempts to create a new board with given move applied', () => {
                const originalBoard = createBoardFromList([
                    [createSquare(A, _2), createPiece(PieceColor.Black, PieceType.Bishop)] 
                ]);
    
                const move = createRegularMove(createSquare(A, _2), createSquare(A, _3))
                const derivedBoard = applyMove(originalBoard, move);
                const expected = pipe(
                    createBoardFromList([
                        [createSquare(A, _3), createPiece(PieceColor.Black, PieceType.Bishop)] 
                    ]),
                    right
                )
                expect(derivedBoard).toEqual(expected);
                expect(originalBoard).toEqual(createBoardFromList([
                    [createSquare(A, _2), createPiece(PieceColor.Black, PieceType.Bishop)] 
                ]));
            });
    
            it('fails when starting square does not contain a piece', () => {
                const board = createBoardFromList([
                    [createSquare(A, _2), createPiece(PieceColor.Black, PieceType.Bishop)] 
                ]);
    
                const move = createRegularMove(createSquare(A, _3), createSquare(A, _2));
                const fail = applyMove(board, move);
                expect(isLeft(fail)).toBe(true);
            });
        });

        describe('promotion', () => {
            it('applies a promotion move', () => {
                const originalBoard = createBoardFromList([
                    [createSquare(A, _2), createPiece(PieceColor.Black, PieceType.Pawn)] 
                ]);

                const move = createPromotion(createSquare(A, _2), createSquare(A, _1), PieceType.Queen);

                const expected = pipe(
                    createBoardFromList([
                        [createSquare(A, _1), createPiece(PieceColor.Black, PieceType.Queen)]
                    ]),
                    right
                );

                const derivedBoard = applyMove(originalBoard, move);

                expect(derivedBoard).toEqual(expected);
            });
        });

        describe('en passant', () => {
            it('applies en passant move from e3 to d2', () => {
                const originalBoard = createBoardFromList([
                    [createSquare(E, _3), createPiece(PieceColor.Black, PieceType.Pawn)],
                    [createSquare(D, _3), createPiece(PieceColor.White, PieceType.Pawn)] 
                ]);

                const move = createEnPassant(createSquare(E, _3), createSquare(D, _2));
                const expected = pipe(
                    createBoardFromList([
                        [createSquare(D, _2), createPiece(PieceColor.Black, PieceType.Pawn)]
                    ]),
                    right
                );

                const derivedBoard = applyMove(originalBoard, move);
                expect(derivedBoard).toEqual(expected);
            });

            it('applies en passant move from e3 to c2', () => {
                const originalBoard = createBoardFromList([
                    [createSquare(E, _3), createPiece(PieceColor.Black, PieceType.Pawn)],
                    [createSquare(C, _3), createPiece(PieceColor.White, PieceType.Pawn)] 
                ]);

                const move = createEnPassant(createSquare(E, _3), createSquare(C, _2));
                const expected = pipe(
                    createBoardFromList([
                        [createSquare(C, _2), createPiece(PieceColor.Black, PieceType.Pawn)]
                    ]),
                    right
                );

                const derivedBoard = applyMove(originalBoard, move);
                expect(derivedBoard).toEqual(expected);
            });

            it('applies en passant move from b3 to c2', () => {
                const originalBoard = createBoardFromList([
                    [createSquare(B, _3), createPiece(PieceColor.Black, PieceType.Pawn)],
                    [createSquare(C, _3), createPiece(PieceColor.White, PieceType.Pawn)] 
                ]);

                const move = createEnPassant(createSquare(B, _3), createSquare(C, _2));
                const expected = pipe(
                    createBoardFromList([
                        [createSquare(C, _2), createPiece(PieceColor.Black, PieceType.Pawn)]
                    ]),
                    right
                );

                const derivedBoard = applyMove(originalBoard, move);
                expect(derivedBoard).toEqual(expected);
            });

            it('returns left when square that would be taken is empty', () => {
                const originalBoard = createBoardFromList([
                    [createSquare(B, _3), createPiece(PieceColor.Black, PieceType.Pawn)]
                ]);

                const move = createEnPassant(createSquare(B, _3), createSquare(C, _2));
                const expected = left(new Error(`Failed to apply en passant move to board: \n There is no piece to take on square ${toString(createSquare(C, _3))}\n${boardToString(originalBoard)}`))
                const derived = applyMove(originalBoard, move);
                expect(derived).toEqual(expected);
            });
        });

        describe('castling', () => {
            it('applies from and to properties to king', () => {
                const from = createSquare(E, _1);
                const to = createSquare(G, _1);
                const king = createPiece(PieceColor.White, PieceType.King)
                const originalBoard = createBoardFromList([
                    [from, king],
                    [createSquare(H, _1), createPiece(PieceColor.White, PieceType.Rook)]
                ]);

                const move = createCastling(from, to);
                const derivedBoard = pipe(
                    applyMove(originalBoard, move),
                    getOrUndefined
                ) as Board;
                expect(getPieceAt(derivedBoard, to)).toEqual(some(king));
            });

            it('returns left if the piece present at the from square is not a king', () => {
                const from = createSquare(E, _1);
                const to = createSquare(G, _1);
                const originalBoard = createBoardFromList([
                    [from, createPiece(PieceColor.White, PieceType.Queen)]
                ]);
                const move = createCastling(from, to);
                const error = applyMove(originalBoard, move);
                expect(error).toEqual(
                    left(Error(`Illegal castling move: Piece at ${toString(from)} is not a king`))
                );
            });

            describe('short castling', () => {
                it('moves the rook on the right of the king to the square on its left', () =>{
                    const from = createSquare(E, _1);
                    const to = createSquare(G, _1);
                    const king = createPiece(PieceColor.White, PieceType.King);
                    const rook = createPiece(PieceColor.White, PieceType.Rook);
                    const originalBoard = createBoardFromList([
                        [from, king],
                        [createSquare(H, _1), rook]
                    ]);

                    const move = createCastling(from, to);
                    const derivedBoard = pipe(
                        applyMove(originalBoard, move),
                        getOrUndefined
                    ) as Board;

                    expect(getPieceAt(derivedBoard, to)).toEqual(some(king));
                    expect(getPieceAt(derivedBoard, createSquare(F, _1))).toEqual(some(rook));
                });

                it('works with fishers random type of castling', () =>{
                    const from = createSquare(B, _1);
                    const to = createSquare(G, _1);
                    const king = createPiece(PieceColor.White, PieceType.King);
                    const rook = createPiece(PieceColor.White, PieceType.Rook);
                    const originalBoard = createBoardFromList([
                        [from, king],
                        [createSquare(C, _1), rook]
                    ]);

                    const move = createCastling(from, to);
                    const derivedBoard = pipe(
                        applyMove(originalBoard, move),
                        getOrUndefined
                    ) as Board;

                    expect(getPieceAt(derivedBoard, to)).toEqual(some(king));
                    expect(getPieceAt(derivedBoard, createSquare(F, _1))).toEqual(some(rook));
                    expect(getPieceAt(derivedBoard, createSquare(C, _1))).toEqual(none);
                });
            });

            describe('long castling', () => {
                it('moves the rook on the left of the king to the square on its right', () =>{
                    const from = createSquare(E, _1);
                    const to = createSquare(C, _1);
                    const king = createPiece(PieceColor.White, PieceType.King);
                    const rook = createPiece(PieceColor.White, PieceType.Rook);
                    const originalBoard = createBoardFromList([
                        [from, king],
                        [createSquare(A, _1), rook]
                    ]);

                    const move = createCastling(from, to);
                    const derivedBoard = pipe(
                        applyMove(originalBoard, move),
                        getOrUndefined
                    ) as Board;

                    expect(getPieceAt(derivedBoard, to)).toEqual(some(king));
                    expect(getPieceAt(derivedBoard, createSquare(D, _1))).toEqual(some(rook));
                });

                it('works with fishers random type of castling', () =>{
                    const from = createSquare(H, _8);
                    const to = createSquare(C, _8);
                    const king = createPiece(PieceColor.Black, PieceType.King);
                    const rook = createPiece(PieceColor.Black, PieceType.Rook);
                    const originalBoard = createBoardFromList([
                        [from, king],
                        [createSquare(A, _8), rook]
                    ]);

                    const move = createCastling(from, to);
                    const derivedBoard = pipe(
                        applyMove(originalBoard, move),
                        getOrUndefined
                    ) as Board;

                    expect(getPieceAt(derivedBoard, to)).toEqual(some(king));
                    expect(getPieceAt(derivedBoard, createSquare(D, _8))).toEqual(some(rook));
                    expect(getPieceAt(derivedBoard, createSquare(A, _8))).toEqual(none);
                });
            });
        });
    });

    describe('applytMoveList', () => {
        it('creates a new board with all moves applied', () =>{
            const originalBoard = createBoardFromList([
                [createSquare(A, _2), createPiece(PieceColor.Black, PieceType.Bishop)],
                [createSquare(A, _3), createPiece(PieceColor.White, PieceType.Bishop)],
                [createSquare(E, _7), createPiece(PieceColor.White, PieceType.Pawn)]
            ]);
    
            const moveList = [
                createRegularMove(createSquare(A, _2), createSquare(B, _3)),
                createRegularMove(createSquare(A, _3), createSquare(B, _2)),
                createRegularMove(createSquare(B, _3), createSquare(H, _8)),
                createRegularMove(createSquare(B, _2), createSquare(A, _8)),
                createPromotion(createSquare(E, _7), createSquare(E, _8), PieceType.Queen)
            ];

            const derivedBoard = applyMoveHistory(originalBoard, moveList);
            const expected = pipe(
                createBoardFromList([
                    [createSquare(H, _8), createPiece(PieceColor.Black, PieceType.Bishop)],
                    [createSquare(A, _8), createPiece(PieceColor.White, PieceType.Bishop)],
                    [createSquare(E, _8), createPiece(PieceColor.White, PieceType.Queen)]
                ]),
                right
            )
            
            expect(derivedBoard).toEqual(expected);
        });

        it('fails if any move starts from a square wich does not have a piece on', () => {
            const originalBoard = createBoardFromList([
                [createSquare(A, _2), createPiece(PieceColor.Black, PieceType.Bishop)],
            ]);
    
            const moveList = [
                createRegularMove(createSquare(A, _2), createSquare(B, _3)),
                createRegularMove(createSquare(A, _2), createSquare(B, _3)), // Piece at a2 has moved, the calculation should fail
                createRegularMove(createSquare(B, _3), createSquare(H, _8))
            ];

            const fail = applyMoveHistory(originalBoard, moveList);

            expect(isLeft(fail)).toBe(true);
        });
    });
});