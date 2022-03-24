import { createBoardFromList } from '../../../entities/board/constructors';
import { createGame } from '../../../entities/game/constructors';
import { createMove } from '../../../entities/move/constructors';
import { isSameMoveAs } from '../../../entities/move/getters';
import { Move } from '../../../entities/move/Move';
import { createPiece } from '../../../entities/piece/constructors';
import { PieceColor, PieceType } from '../../../entities/piece/Piece';
import { createSquare } from '../../../entities/square/constructors';
import { B, E, Square, _2, _3, _4 } from '../../../entities/square/Square';
import {getLegalMoves} from '../pawn';

describe('domain/rule/move/pawn', () => {
    describe("moving a single square ahead", () => {
        test('it moves includes moving ahead if the squre is not accupied', () => {
            const test = (start:Square, pieceColor: PieceColor, end: Square) => {
                const board = createBoardFromList([
                    [start, createPiece(pieceColor, PieceType.Pawn)]
                ]);
    
                const game = createGame(board, []);
                const legalMoves:Move[] = getLegalMoves(game, start);
                const expected = createMove(
                    start,
                    end
                );
                const forwardMove = legalMoves.find(isSameMoveAs(expected));
                expect(forwardMove).toEqual(expected)
            };

            test(createSquare(E, _3), PieceColor.Black, createSquare(E, _2));
            test(createSquare(B, _3), PieceColor.Black, createSquare(B, _2));
            test(createSquare(E, _3), PieceColor.White, createSquare(E, _4));
        });

        it('does not include forward move if the square is occupied', () => {
            const square = createSquare(B, _3);
            const board = createBoardFromList([
                [square, createPiece(PieceColor.Black, PieceType.Pawn)],
                [createSquare(B, _2), createPiece(PieceColor.Black, PieceType.Knight)]
            ]);

            const game = createGame(board, []);
            const legalMoves:Move[] = getLegalMoves(game, square);
            expect(legalMoves).toHaveLength(0);
        });
    });
});