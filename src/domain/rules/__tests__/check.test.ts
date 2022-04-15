import { createBoardFromList } from "../../entities/board/constructors";
import { createGame } from "../../entities/game/constructors";
import { createPiece } from "../../entities/piece/constructors";
import { PieceColor, PieceType } from "../../entities/piece/Piece";
import { reversePieceColor } from "../../entities/piece/transition";
import { createSquare } from "../../entities/square/constructors";
import { B, D, E, F, G, _2, _3, _4, _5, _7 } from "../../entities/square/Square";
import { isInCheck } from '../check';

describe('domain/rules/check', () => {
    describe('isInCheck', () => {
        it('is in check when a bishop points at the enemy king', () => {
            const kingColor= PieceColor.Black;
            const board = createBoardFromList([
                [createSquare(B, _2),  createPiece(kingColor, PieceType.King)],
                [createSquare(G, _7), createPiece(reversePieceColor(kingColor), PieceType.Bishop)]
            ]);
            const game = createGame(board, []);
            const checked = isInCheck(game, kingColor);
            expect(checked).toBe(true);
        });

        it('is not in check when the bishop misses the king', () => {
            const kingColor = PieceColor.Black;
            const board = createBoardFromList([
                [createSquare(B, _3),  createPiece(kingColor, PieceType.King)],
                [createSquare(G, _7), createPiece(reversePieceColor(kingColor), PieceType.Bishop)]
            ])
            const game = createGame(board, []);
            const checked = isInCheck(game, kingColor);
            expect(checked).toBe(false);
        });
        
        it('is in check when a knight points at the enemy king', () => {
            const kingColor = PieceColor.Black;
            const board = createBoardFromList([
                [createSquare(F, _5),  createPiece(kingColor, PieceType.King)],
                [createSquare(G, _7), createPiece(reversePieceColor(kingColor), PieceType.Knight)]
            ]);
            const game = createGame(board, []);
            const checked = isInCheck(game, kingColor);
            expect(checked).toBe(true);
        });

        it('is in check when the queen points at the enemy king', () => {
            const kingColor = PieceColor.Black;
            const board = createBoardFromList([
                [createSquare(B, _2),  createPiece(kingColor, PieceType.King)],
                [createSquare(G, _7), createPiece(reversePieceColor(kingColor), PieceType.Queen)]
            ]);
            const game = createGame(board, []);
            const checked = isInCheck(game, kingColor);
            expect(checked).toBe(true);
        });

        it('is in check when the rook points at the enemy king', () => {
            const kingColor = PieceColor.Black;
            const board = createBoardFromList([
                [createSquare(B, _2),  createPiece(kingColor, PieceType.King)],
                [createSquare(B, _7), createPiece(reversePieceColor(kingColor), PieceType.Rook)]
            ]);
            const game = createGame(board, []);
            const checked = isInCheck(game, kingColor);
            expect(checked).toBe(true);
        });

        it('is in check when the pawn could \'take\' the king', () => {
            const kingColor = PieceColor.Black;
            const board = createBoardFromList([
                [createSquare(E, _5),  createPiece(kingColor, PieceType.King)],
                [createSquare(D, _4), createPiece(reversePieceColor(kingColor), PieceType.Pawn)]
            ]);
            const game = createGame(board, []);
            const checked = isInCheck(game, kingColor);
            expect(checked).toBe(true);
        });
    });
})