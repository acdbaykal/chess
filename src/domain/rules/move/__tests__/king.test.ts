import { A, B, C, Square, _1, _2, _3 } from "../../../entities/square/Square";
import { createSquare, fromString } from "../../../entities/square/constructors";
import { createBoardFromList } from "../../../entities/board/constructors";
import {createGame} from '../../../entities/game/constructors';
import { Piece, PieceColor, PieceType } from "../../../entities/piece/Piece";
import {createPiece} from '../../../entities/piece/constructors';
import {getLegalMoves} from '../king';
import {Move} from '../../../entities/move/Move';
import { pipe } from "fp-ts/lib/function";
import { sortMoveList } from "../../../entities/move/transition";
import { createRegularMove } from "../../../entities/move/constructors";
import { map as mapList } from 'fp-ts/Array';
import {Board} from '../../../entities/board/Board';
import {map as mapEither, right} from 'fp-ts/Either';

describe('domain/rules/moves/king', () => {
    describe('getLegalMoves', () => {
        const testSimpleMoves = (board: Board, kingPosition: Square, destinations: Square[]) => {
            const moves: Move[] = [];
            const game = createGame(board, moves);
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
            it('moves a square left,right, back or forward', () => {
                const kingPosition = createSquare(B, _2);
                
                const destinations = [
                    createSquare(A, _2),
                    createSquare(C, _2),
                    createSquare(B, _1),
                    createSquare(B, _3)
                ];

                testSimpleMovesOnEmptyBoard(kingPosition, destinations);
            ;
            });

            it('does NOT include moves outside of the board', () => {
                const kingPosition = createSquare(A, _1);
                
                const destinations = [
                    createSquare(A, _2),
                    createSquare(B, _1)
                ];

                testSimpleMovesOnEmptyBoard(kingPosition, destinations);
            });

            it('does NOT include moves, which move to a square occupied by piece of the same color', () => {
                const kingPosition = createSquare(B, _2);

                const otherPiecePostions = [createSquare(A, _2), createSquare(B, _3)];

                const destinations = [
                    createSquare(C, _2),
                    createSquare(B, _1)
                ];

                testSimpleMovesOnFilledBoard(otherPiecePostions, kingPosition, PieceColor.Black, destinations);
                testSimpleMovesOnFilledBoard(otherPiecePostions, kingPosition, PieceColor.White, destinations);
            });
        });
    });
});