import { isNotNull, isNull } from "../../../../lib/nullable";
import { createPiece } from "../../piece/constructors";
import { equalsToPiece } from "../../piece/getters";
import { Piece, PieceColor, PieceType } from "../../piece/Piece";
import { createSquare } from "../../square/constructors";
import { A, B, C, E, F, _1, _2, _3, _4, _5 } from "../../square/Square";
import {createBoardFromList} from "../constructors";
import { getPieceAt, getPlayerPieces, getPositions, getSquaresForPiece } from "../getters";

describe('domain/entities/board/getters', () => {
    describe('getPieceAt', () => {
        it('gets piece at square', () => {
            const piece = createPiece(PieceColor.Black, PieceType.Bishop);
            const square = createSquare(F, _4);

            const board = createBoardFromList([
                [createSquare(A, _1), createPiece(PieceColor.White, PieceType.King)],
                [createSquare(B, _2), createPiece(PieceColor.Black, PieceType.King)],
                [square, piece]
            ]);

            const result = getPieceAt(board, square);
            expect(isNotNull(result)).toBe(true);
            const equal = equalsToPiece(piece)(result as Piece);
            expect(equal).toBe(true);
        });

        it('returns none when there is no piece present at sqaure', () => {
            const board = createBoardFromList([
                [createSquare(A, _1), createPiece(PieceColor.White, PieceType.King)],
                [createSquare(B, _2), createPiece(PieceColor.Black, PieceType.King)],
                [createSquare(F, _4), createPiece(PieceColor.Black, PieceType.Bishop)]
            ]);

            const result = getPieceAt(board, createSquare(F, _5));
            expect(isNull(result)).toBe(true);
        });
    });

    describe('getSquaresForPiece', () => {
        it('gets all the squares occpied by certain piece', () => {
            const board = createBoardFromList([
                [createSquare(A, _1), createPiece(PieceColor.White, PieceType.King)],
                [createSquare(B, _2), createPiece(PieceColor.Black, PieceType.King)],
                [createSquare(F, _5), createPiece(PieceColor.Black, PieceType.Bishop)],
                [createSquare(F, _4), createPiece(PieceColor.Black, PieceType.Bishop)],
                [createSquare(E, _5), createPiece(PieceColor.White, PieceType.Bishop)],
            ]);

            const squares = getSquaresForPiece(board, createPiece(PieceColor.Black, PieceType.Bishop));
            expect(squares).toHaveLength(2);
            expect(squares[0]).toEqual(createSquare(F, _5));
            expect(squares[1]).toEqual(createSquare(F, _4));
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
});
