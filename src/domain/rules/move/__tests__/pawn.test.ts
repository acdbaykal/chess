import { pipe } from 'fp-ts/lib/function';
import { createBoardFromList } from '../../../entities/board/constructors';
import { createGame } from '../../../entities/game/constructors';
import { createPromotion, createRegularMove } from '../../../entities/move/constructors';
import { isSameMoveAs } from '../../../entities/move/getters';
import { Move } from '../../../entities/move/Move';
import { sortMoveList } from '../../../entities/move/transition';
import { EMPTY_MOVE_HISTORY } from '../../../entities/movehistory/constructors';
import { createPiece } from '../../../entities/piece/constructors';
import { PieceColor, PieceType } from '../../../entities/piece/Piece';
import { createSquare } from '../../../entities/square/constructors';
import { A, B, C, D, E, F, Square, _1, _2, _3, _4, _5, _6, _7, _8 } from '../../../entities/square/Square';
import {getLegalMoves} from '../pawn';

describe('domain/rule/move/pawn', () => {
    describe("moving a single square ahead", () => {
        it('includes moving ahead if the squre is not accupied', () => {
            const test = (start:Square, pieceColor: PieceColor, end: Square) => {
                const board = createBoardFromList([
                    [start, createPiece(pieceColor, PieceType.Pawn)]
                ]);
    
                const game = createGame(board, EMPTY_MOVE_HISTORY);
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

            const game = createGame(board, EMPTY_MOVE_HISTORY);
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
                const game = createGame(board, EMPTY_MOVE_HISTORY);
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
                const game = createGame(board, EMPTY_MOVE_HISTORY);
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
                const game = createGame(board, EMPTY_MOVE_HISTORY);

                const legalMoves:Move[] = getLegalMoves(game, start);
                const nonlegal = createRegularMove(start, destination);
                const forwardMove = legalMoves.find(isSameMoveAs(nonlegal));
                expect(forwardMove).not.toBeDefined();
            };

            test(PieceColor.Black);
            test(PieceColor.White);
        });

        it('excludes moving two squares when the sqaure inbetween is occupied', () => {
            const test = (pieceColor: PieceColor) => {
                const column = B;
                const row = pieceColor === PieceColor.Black ? _7 : _2;
                const inbetweenRow = pieceColor === PieceColor.Black ? _6 : _3;
                const destibationRow = pieceColor === PieceColor.Black ? _5 : _4;
                const destination = createSquare(B, destibationRow);
                const inbetweenSquare = createSquare(column, inbetweenRow);
                const start = createSquare(column, row);
                const board = createBoardFromList([
                    [start, createPiece(pieceColor, PieceType.Pawn)],
                    [inbetweenSquare, createPiece(PieceColor.White, PieceType.Bishop)]
                ]);
                const game = createGame(board, EMPTY_MOVE_HISTORY);

                const legalMoves:Move[] = getLegalMoves(game, start);
                const nonlegal = createRegularMove(start, destination);
                const forwardMove = legalMoves.find(isSameMoveAs(nonlegal));
                expect(forwardMove).not.toBeDefined();
            };

            test(PieceColor.Black);
            test(PieceColor.White);
        });
    });

    describe('taking', () => {
        it('includes (regular) taking moves for white', () => {

            const test = (start: Square, firstTake:Square, secondTake: Square) => {
                const board = createBoardFromList([
                    [start, createPiece(PieceColor.White, PieceType.Pawn)],
                    [firstTake, createPiece(PieceColor.Black, PieceType.Pawn)],
                    [secondTake, createPiece(PieceColor.Black, PieceType.Pawn)]
                ]);
                const game = createGame(board, EMPTY_MOVE_HISTORY);
    
                const legalMoves = getLegalMoves(game, start);
                const firstExpected = legalMoves.find(isSameMoveAs(
                    createRegularMove(start, firstTake)
                ));
                const secondExpected = legalMoves.find(isSameMoveAs(
                    createRegularMove(start, secondTake)
                ));
                expect(firstExpected).toBeDefined();
                expect(secondExpected).toBeDefined();
            };

            test(
                createSquare(E, _4),
                createSquare(D, _5),
                createSquare(F, _5)
            );

            test(
                createSquare(B, _3),
                createSquare(A, _4),
                createSquare(C, _4)
            );
        });

        it('includes (regular) taking moves for black', () => {
            const test = (start: Square, firstTake:Square, secondTake: Square) => {
                const board = createBoardFromList([
                    [start, createPiece(PieceColor.Black, PieceType.Pawn)],
                    [firstTake, createPiece(PieceColor.White, PieceType.Pawn)],
                    [secondTake, createPiece(PieceColor.White, PieceType.Pawn)]
                ]);
                const game = createGame(board, EMPTY_MOVE_HISTORY);
    
                const legalMoves = getLegalMoves(game, start);
                const firstExpected = legalMoves.find(isSameMoveAs(
                    createRegularMove(start, firstTake)
                ));
                const secondExpected = legalMoves.find(isSameMoveAs(
                    createRegularMove(start, secondTake)
                ));
                expect(firstExpected).toBeDefined();
                expect(secondExpected).toBeDefined();
            };

            test(
                createSquare(E, _5),
                createSquare(D, _4),
                createSquare(F, _4)
            );

            test(
                createSquare(B, _4),
                createSquare(A, _3),
                createSquare(C, _3)
            );
        });

        it('only takes opposite colored pieces', () => {
            const start = createSquare(E, _5);
            const board = createBoardFromList([
                [start, createPiece(PieceColor.Black, PieceType.Pawn)],
                [createSquare(D, _4), createPiece(PieceColor.White, PieceType.Pawn)],
                [createSquare(F, _4), createPiece(PieceColor.Black, PieceType.Pawn)]
            ]);
            const game = createGame(board, EMPTY_MOVE_HISTORY);

            const legalMoves = getLegalMoves(game, start);
            const firstExpected = legalMoves.find(isSameMoveAs(
                createRegularMove(start, createSquare(D, _4))
            ));
            const secondExpected = legalMoves.find(isSameMoveAs(
                createRegularMove(start, createSquare(F, _4))
            ));
            expect(firstExpected).toBeDefined();
            expect(secondExpected).not.toBeDefined();
        });

        it('only includes sqaures with pieces on them', () => {
            const start = createSquare(E, _5);
            const board = createBoardFromList([
                [start, createPiece(PieceColor.Black, PieceType.Pawn)]
            ]);
            const game = createGame(board, EMPTY_MOVE_HISTORY);

            const legalMoves = getLegalMoves(game, start);
            const firstExpected = legalMoves.find(isSameMoveAs(
                createRegularMove(start, createSquare(D, _4))
            ));
            const secondExpected = legalMoves.find(isSameMoveAs(
                createRegularMove(start, createSquare(F, _4))
            ));
            expect(firstExpected).not.toBeDefined();
            expect(secondExpected).not.toBeDefined();
        });
    });

    describe('promotion', () => {
        it('promotes pawn when the pawn would arive at last row', () => {
            const test = (pieceColor: PieceColor) => {
                const row = pieceColor === PieceColor.Black ? _2 : _7;
                const destinationRow = pieceColor === PieceColor.Black ? _1 : _8;
                const oppositeColor = pieceColor === PieceColor.Black ? PieceColor.White : PieceColor.Black;
                const start = createSquare(B, row);
                const board = createBoardFromList([
                    [start, createPiece(pieceColor, PieceType.Pawn)],
                    [createSquare(A, destinationRow), createPiece(oppositeColor, PieceType.Knight)],
                    [createSquare(C, destinationRow), createPiece(oppositeColor, PieceType.Knight)]
                ]);

                const game = createGame(board, EMPTY_MOVE_HISTORY);
                const legalMoves = pipe(
                    getLegalMoves(game, start),
                    sortMoveList
                );

                const expected = pipe(
                    [
                        createPromotion(start, createSquare(A, destinationRow), PieceType.Bishop),
                        createPromotion(start, createSquare(C, destinationRow), PieceType.Bishop),
                        createPromotion(start, createSquare(B, destinationRow), PieceType.Bishop),
                        
                        createPromotion(start, createSquare(A, destinationRow), PieceType.Knight),
                        createPromotion(start, createSquare(C, destinationRow), PieceType.Knight),
                        createPromotion(start, createSquare(B, destinationRow), PieceType.Knight),
                        
                        createPromotion(start, createSquare(A, destinationRow), PieceType.Queen),
                        createPromotion(start, createSquare(C, destinationRow), PieceType.Queen),
                        createPromotion(start, createSquare(B, destinationRow), PieceType.Queen),
                        
                        createPromotion(start, createSquare(A, destinationRow), PieceType.Rook),
                        createPromotion(start, createSquare(C, destinationRow), PieceType.Rook),
                        createPromotion(start, createSquare(B, destinationRow), PieceType.Rook)
                    ],
                    sortMoveList
                );

                expect(legalMoves).toEqual(expected);
            };

            test(PieceColor.Black);
            test(PieceColor.White);
        });
    });
});