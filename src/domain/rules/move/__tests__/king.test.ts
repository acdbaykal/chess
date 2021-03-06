import { A, B, C, D, E, F, Square, _1, _2, _3, _5 } from "../../../entities/square/Square";
import { createSquare } from "../../../entities/square/constructors";
import { createBoardFromList } from "../../../entities/board/constructors";
import {createGame} from '../../../entities/game/constructors';
import { Piece, PieceColor, PieceType } from "../../../entities/piece/Piece";
import {createPiece} from '../../../entities/piece/constructors';
import {getLegalMoves} from '../king';
import { pipe } from "fp-ts/lib/function";
import { sortMoveList } from "../../../entities/move/transition";
import { createRegularMove } from "../../../entities/move/constructors";
import { map as mapList } from 'fp-ts/Array';
import {Board} from '../../../entities/board/Board';
import {map as mapEither, right} from 'fp-ts/Either';
import { EMPTY_MOVE_HISTORY } from "../../../entities/movehistory/constructors";

describe('domain/rules/moves/king', () => {
    describe('getLegalMoves', () => {
        const testSimpleMoves = (board: Board, kingPosition: Square, destinations: Square[]) => {
            const game = createGame(board, EMPTY_MOVE_HISTORY);
            const legalMoves = pipe(
                getLegalMoves(game, kingPosition),
                mapEither(sortMoveList)
            );

            const expectedMoves = pipe(
                destinations,
                mapList(destination => createRegularMove(kingPosition, destination)),
                sortMoveList,
                right
            );
            expect(legalMoves).toEqual(expectedMoves);
        };

        const testSimpleMovesOnEmptyBoard = (kingPosition: Square, destinations: Square[]) => {
            const board = createBoardFromList([
                [kingPosition, createPiece(PieceColor.Black, PieceType.King)]
            ]);
            testSimpleMoves(board, kingPosition, destinations);
        };

        const testSimpleMovesOnFilledBoard = (otherPiecePositions: Square[], kingPosition: Square, pieceColor: PieceColor, destinations: Square[]) => {
            const partialBoardList:[Square, Piece][] = pipe(
                otherPiecePositions,
                mapList(position => [position, createPiece(pieceColor, PieceType.King)])
            );

            const board = createBoardFromList([
                [kingPosition, createPiece(pieceColor, PieceType.King)],
                ...partialBoardList
            ]);

            testSimpleMoves(board, kingPosition, destinations);
        };


        describe('getLegalMoves', () => {
            it('moves to neigboring squares', () => {
                const kingPosition = createSquare(B, _2);
                
                const destinations = [
                    createSquare(A, _1),
                    createSquare(B, _1),
                    createSquare(C, _1),     

                    createSquare(A, _2),
                    createSquare(C, _2),
                    
                    createSquare(A, _3),
                    createSquare(B, _3),
                    createSquare(C, _3),

                ];

                testSimpleMovesOnEmptyBoard(kingPosition, destinations);
            ;
            });

            it('does NOT include moves outside of the board', () => {
                const kingPosition = createSquare(A, _1);
                
                const destinations = [
                    createSquare(A, _2),
                    createSquare(B, _1),
                    createSquare(B, _2)
                ];

                testSimpleMovesOnEmptyBoard(kingPosition, destinations);
            });

            it('does NOT include moves, which move to a square occupied by piece of the same color', () => {
                const kingPosition = createSquare(B, _2);

                const otherPiecePostions = [createSquare(A, _2), createSquare(B, _3)];

                const destinations = [
                    createSquare(A, _1),
                    createSquare(B, _1),
                    createSquare(C, _1),     

                    createSquare(C, _2),
                    
                    createSquare(A, _3),
                    createSquare(C, _3),
                ];

                testSimpleMovesOnFilledBoard(otherPiecePostions, kingPosition, PieceColor.Black, destinations);
                testSimpleMovesOnFilledBoard(otherPiecePostions, kingPosition, PieceColor.White, destinations);
            });

            it('disallows kings getting next to eachother', () => {
                const kingPosition = createSquare(E, _3);
                const board = createBoardFromList([
                    [kingPosition, createPiece(PieceColor.White, PieceType.King)],
                    [createSquare(E, _5), createPiece(PieceColor.Black, PieceType.King)]
                ]);

                const destinations = [
                    createSquare(D, _3),
                    createSquare(F, _3),
                    createSquare(D, _2),
                    createSquare(E, _2),
                    createSquare(F, _2)
                ];

                testSimpleMoves(board, kingPosition, destinations);
            });
        });
    });
});