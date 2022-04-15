import { createBoardFromList } from "../../entities/board/constructors";
import { createPiece } from "../../entities/piece/constructors";
import { PieceColor, PieceType } from "../../entities/piece/Piece";
import { reversePieceColor } from "../../entities/piece/transition";
import { createSquare } from "../../entities/square/constructors";
import { B, F, G, _2, _3, _5, _7 } from "../../entities/square/Square";
import {isInChecked} from '../check';

describe('domain/rules/check', () => {
    describe('domain/rules/check', () => {
        it('is in check when a bishop points at the enemy king', () => {
            const kingColor= PieceColor.Black;
            const board = createBoardFromList([
                [createSquare(B, _2),  createPiece(kingColor, PieceType.King)],
                [createSquare(G, _7), createPiece(reversePieceColor(kingColor), PieceType.Bishop)]
            ])
            const checked = isInChecked(board, kingColor);
            expect(checked).toBe(true);
        });

        it('is not in check when the bishop misses the king', () => {
            const kingColor= PieceColor.Black;
            const board = createBoardFromList([
                [createSquare(B, _3),  createPiece(kingColor, PieceType.King)],
                [createSquare(G, _7), createPiece(reversePieceColor(kingColor), PieceType.Bishop)]
            ])
            const checked = isInChecked(board, kingColor);
            expect(checked).toBe(false);
        });
        
        it('is in check when a knight points at the enemy king', () => {
            const kingColor= PieceColor.Black;
            const board = createBoardFromList([
                [createSquare(F, _5),  createPiece(kingColor, PieceType.King)],
                [createSquare(G, _7), createPiece(reversePieceColor(kingColor), PieceType.Knight)]
            ])
            const checked = isInChecked(board, kingColor);
            expect(checked).toBe(true);
        });

    });
})