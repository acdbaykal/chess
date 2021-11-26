import { isLeft, right } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { createMove } from "../../move/constructors";
import { createPiece } from "../../piece/constructors";
import { PieceColor, PieceType } from "../../piece/Piece";
import { createSquare } from "../../square/constructors";
import { A, B, H, _2, _3, _8 } from "../../square/Square";
import { createBoardFromList } from "../constructors";
import { applyMove, applyMoveList, removePiece, setPiece } from "../transitions";

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
        it('attempts to create a new board with given move applied', () => {
            const originalBoard = createBoardFromList([
                [createSquare(A, _2), createPiece(PieceColor.Black, PieceType.Bishop)] 
            ]);

            const move = createMove(createSquare(A, _2), createSquare(A, _3))
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

            const move = createMove(createSquare(A, _3), createSquare(A, _2));
            const fail = applyMove(board, move);
            expect(isLeft(fail)).toBe(true);
        });
    });

    describe('applytMoveList', () => {
        it('creates a new board with all mpves applied', () =>{
            const originalBoard = createBoardFromList([
                [createSquare(A, _2), createPiece(PieceColor.Black, PieceType.Bishop)],
                [createSquare(A, _3), createPiece(PieceColor.White, PieceType.Bishop)]
            ]);
    
            const moveList = [
                createMove(createSquare(A, _2), createSquare(B, _3)),
                createMove(createSquare(A, _3), createSquare(B, _2)),
                createMove(createSquare(B, _3), createSquare(H, _8)),
                createMove(createSquare(B, _2), createSquare(A, _8))
            ];

            const derivedBoard = applyMoveList(originalBoard, moveList);
            const expected = pipe(
                createBoardFromList([
                    [createSquare(H, _8), createPiece(PieceColor.Black, PieceType.Bishop)],
                    [createSquare(A, _8), createPiece(PieceColor.White, PieceType.Bishop)]
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
                createMove(createSquare(A, _2), createSquare(B, _3)),
                createMove(createSquare(A, _2), createSquare(B, _3)), // Piece at a2 has moved, the calculation should fail
                createMove(createSquare(B, _3), createSquare(H, _8))
            ];

            const fail = applyMoveList(originalBoard, moveList);

            expect(isLeft(fail)).toBe(true);
        });
    });
});