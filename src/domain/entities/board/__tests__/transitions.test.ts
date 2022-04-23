import { left, isLeft, right } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { createEnPassant, createPromotion, createRegularMove } from "../../move/constructors";
import { createPiece } from "../../piece/constructors";
import { PieceColor, PieceType } from "../../piece/Piece";
import { createSquare } from "../../square/constructors";
import { toString } from "../../square/getters";
import { A, B, C, D, E, H, _1, _2, _3, _4, _7, _8 } from "../../square/Square";
import { createBoardFromList } from "../constructors";
import { applyMove, applyMoveHistory, boardToString, getPlayerPieces, getPositions, removePiece, setPiece } from "../transitions";

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

                const move = createEnPassant(createSquare(E, _3), createSquare(D, _2), createSquare(D, _3));
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

                const move = createEnPassant(createSquare(E, _3), createSquare(C, _2), createSquare(C, _3));
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

                const move = createEnPassant(createSquare(B, _3), createSquare(C, _2), createSquare(C, _3));
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

                const move = createEnPassant(createSquare(B, _3), createSquare(C, _2), createSquare(C, _3));
                const expected = left(new Error(`Failed to apply en passant move to board: \n There is no piece to take on square ${toString(createSquare(C, _3))}\n${boardToString(originalBoard)}`))
                const derived = applyMove(originalBoard, move);
                expect(derived).toEqual(expected);
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

    describe('getPosistions', () =>{
        it('returns emoty array when piece can npt be found on the boatd', () => {
            const board = createBoardFromList([
                [createSquare(E, _4), createPiece(PieceColor.Black, PieceType.Pawn)]
            ]);

            const positions = getPositions(board)(createPiece(PieceColor.Black, PieceType.Bishop));
            expect(positions).toEqual([]);
        });

        it('returns all positions of a piece on the board', () => {
            const board = createBoardFromList([
                [createSquare(E, _4), createPiece(PieceColor.Black, PieceType.Pawn)],
                [createSquare(E, _3), createPiece(PieceColor.Black, PieceType.Bishop)],
                [createSquare(E, _2), createPiece(PieceColor.Black, PieceType.Bishop)],
                [createSquare(E, _1), createPiece(PieceColor.White, PieceType.Bishop)]
            ]);

            const positions = getPositions(board)(createPiece(PieceColor.Black, PieceType.Bishop));
            expect(positions).toContainEqual(createSquare(E, _3));
            expect(positions).toContainEqual(createSquare(E, _2));
        });
    });

    describe('getPlayersPieces', () => {
        it('gets [] from empty board', () => {
            const board = createBoardFromList([]);
            const pieces = getPlayerPieces(board, PieceColor.White);
            expect(pieces).toEqual([]);
        });

        it('gets all the pieces and their positiosn', () => {
            const board = createBoardFromList([
                [createSquare(E, _4), createPiece(PieceColor.Black, PieceType.Pawn)],
                [createSquare(E, _3), createPiece(PieceColor.Black, PieceType.Bishop)],
                [createSquare(E, _2), createPiece(PieceColor.Black, PieceType.Bishop)],
                [createSquare(C, _2), createPiece(PieceColor.Black, PieceType.Knight)],
                [createSquare(E, _1), createPiece(PieceColor.White, PieceType.Bishop)]
            ]);

            const pieces = getPlayerPieces(board, PieceColor.Black);

            expect(pieces).toContainEqual([createSquare(E, _4), createPiece(PieceColor.Black, PieceType.Pawn)]);
            expect(pieces).toContainEqual([createSquare(E, _3), createPiece(PieceColor.Black, PieceType.Bishop)]);
            expect(pieces).toContainEqual([createSquare(E, _2), createPiece(PieceColor.Black, PieceType.Bishop)]);
            expect(pieces).toContainEqual([createSquare(C, _2), createPiece(PieceColor.Black, PieceType.Knight)]);
        });
    });
});