import { pipe } from 'fp-ts/lib/pipeable';
import { createBoardFromList } from '../../../entities/board/constructors';
import { createGame } from '../../../entities/game/constructors';
import { createRegularMove } from '../../../entities/move/constructors';
import { isSameMoveAs } from '../../../entities/move/getters';
import { Move } from '../../../entities/move/Move';
import { createPiece } from '../../../entities/piece/constructors';
import { PieceColor, PieceType } from '../../../entities/piece/Piece';
import { createSquare } from '../../../entities/square/constructors';
import { B, E, Square, _2, _3, _4, _5, _6, _7 } from '../../../entities/square/Square';
import {getLegalMoves} from '../pawn';

describe('domain/rule/move/pawn', () => {
    describe("moving a single square ahead", () => {
        it('includes moving ahead if the squre is not accupied', () => {
            const test = (start:Square, pieceColor: PieceColor, end: Square) => {
                const board = createBoardFromList([
                    [start, createPiece(pieceColor, PieceType.Pawn)]
                ]);
    
                const game = createGame(board, []);
                const legalMoves:Move[] = getLegalMoves(game, start);
                const expected = createRegularMove(
                    start,
                    end
                );
                const forwardMove = legalMoves.find(isSameMoveAs(expected));
                expect(forwardMove).toEqual(expected);
            };

            test(createSquare(E, _3), PieceColor.Black, createSquare(E, _2));
            test(createSquare(B, _3), PieceColor.Black, createSquare(B, _2));
            test(createSquare(E, _3), PieceColor.White, createSquare(E, _4));
        });

        it('does not include forward move if the square is occupied', () => {
            const square = createSquare(B, _3);
            const destination = createSquare(B, _2);
            const board = createBoardFromList([
                [square, createPiece(PieceColor.Black, PieceType.Pawn)],
                [destination, createPiece(PieceColor.Black, PieceType.Knight)]
            ]);

            const game = createGame(board, []);
            const legalMoves:Move[] = getLegalMoves(game, square);
            const nonlegal = createRegularMove(square, destination);
            const forwardMove = legalMoves.find(isSameMoveAs(nonlegal));
            expect(forwardMove).not.toBeDefined();
        });
    });

    describe('moving two squares ahead', () => {
        it('includes moving two squeares ahead, when the pawn is at it\'s home row', () => {
            const test = (pieceColor: PieceColor) => {
                const row = pieceColor === PieceColor.Black ? _7 : _2;
                const destibationRow = pieceColor === PieceColor.Black ? _5 : _4;
                const start = createSquare(B, row);
                const board = createBoardFromList([
                    [start, createPiece(pieceColor, PieceType.Pawn)]
                ]);
                const game = createGame(board, []);
                const destination = createSquare(B, destibationRow);
                const legalMoves:Move[] = getLegalMoves(game, start);
                const expected = createRegularMove(start, destination);
                const forwardMove = legalMoves.find(isSameMoveAs(expected));
                expect(forwardMove).toEqual(expected)
            };

            test(PieceColor.Black);
            test(PieceColor.White);
        });

        it('excludes moving two squeares ahead, when the pawn is NOT at it\'s home row', () => {
            const test = (pieceColor: PieceColor) => {
                const row = _4;
                const destibationRow = pieceColor === PieceColor.Black ? _2 : _6;
                const start = createSquare(B, row);
                const board = createBoardFromList([
                    [start, createPiece(pieceColor, PieceType.Pawn)]
                ]);
                const game = createGame(board, []);
                const destination = createSquare(B, destibationRow);
                const legalMoves:Move[] = getLegalMoves(game, start);
                const nonlegal = createRegularMove(start, destination);
                const forwardMove = legalMoves.find(isSameMoveAs(nonlegal));
                expect(forwardMove).not.toBeDefined();
            };

            test(PieceColor.Black);
            test(PieceColor.White);
        });

        it('exludes moving two squeares ahead, when the destination is occupied', () => {
            const test = (pieceColor: PieceColor) => {
                const row = pieceColor === PieceColor.Black ? _7 : _2;
                const destibationRow = pieceColor === PieceColor.Black ? _5 : _4;
                const destination = createSquare(B, destibationRow);
                const start = createSquare(B, row);
                const board = createBoardFromList([
                    [start, createPiece(pieceColor, PieceType.Pawn)],
                    [destination, createPiece(PieceColor.White, PieceType.Bishop)]
                ]);
                const game = createGame(board, []);

                const legalMoves:Move[] = getLegalMoves(game, start);
                const nonlegal = createRegularMove(start, destination);
                const forwardMove = legalMoves.find(isSameMoveAs(nonlegal));
                expect(forwardMove).not.toBeDefined();
            };

            test(PieceColor.Black);
            test(PieceColor.White);
        });
    });
});