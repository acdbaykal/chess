import { isNone, isSome } from "fp-ts/lib/Option";
import { getOrUndefined } from "../../../../lib/option";
import { createPiece } from "../../piece/constructors";
import { equalsToPiece } from "../../piece/getters";
import { Piece, PieceColor, PieceType } from "../../piece/Piece";
import { createSquare } from "../../square/constructors";
import { A, B, E, F, _1, _2, _4, _5 } from "../../square/Square";
import {createBoardFromList} from "../constructors";
import { getPieceAt, getSquaresForPiece } from "../getters";

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
            expect(isSome(result)).toBe(true);
            const equal = equalsToPiece(piece)(getOrUndefined(result) as Piece);
            expect(equal).toBe(true);
        });

        it('returns none when there is no piece present at sqaure', () => {
            const board = createBoardFromList([
                [createSquare(A, _1), createPiece(PieceColor.White, PieceType.King)],
                [createSquare(B, _2), createPiece(PieceColor.Black, PieceType.King)],
                [createSquare(F, _4), createPiece(PieceColor.Black, PieceType.Bishop)]
            ]);

            const result = getPieceAt(board, createSquare(F, _5));
            expect(isNone(result)).toBe(true);
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
});
