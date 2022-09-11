import { createBoardFromList } from "../../entities/board/constructors";
import { STANDARD_INITIAL_POSITION } from "../../entities/board/standard";
import { createGame } from "../../entities/game/constructors";
import { GameStatus } from "../../entities/gameStatus/GameStatus";
import { createRegularMove } from "../../entities/move/constructors";
import { createMoveHistory } from "../../entities/movehistory/constructors";
import { createPiece } from "../../entities/piece/constructors";
import { PieceColor, PieceType } from "../../entities/piece/Piece";
import { createSquare } from "../../entities/square/constructors";
import { A, B, C, D, E, F, G, H, _1, _2, _3, _4, _5, _6, _7, _8 } from "../../entities/square/Square";
import {determineGameStatus} from '../gameStatus';

describe('domain/rules/gameStatus', () => {
    it('determines when it is white\'s turn and the game is still ungoing', () => {
        const game = createGame(STANDARD_INITIAL_POSITION, createMoveHistory([]));
        const gameStatus = determineGameStatus(game);
        expect(gameStatus).toEqual([GameStatus.Ongoing, PieceColor.White]);
    });

    it('determines when it is black\'s turn and the game is still ungoing', () => {
        const game = createGame(STANDARD_INITIAL_POSITION, createMoveHistory([
            createRegularMove(createSquare(E, _2), createSquare(E, _4))
        ]));
        const gameStatus = determineGameStatus(game);
        expect(gameStatus).toEqual([GameStatus.Ongoing, PieceColor.Black]);
    });

    it('determines chekmate while it is black\'s move', () => {
        const game = createGame(STANDARD_INITIAL_POSITION, createMoveHistory([
            createRegularMove(createSquare(E, _2), createSquare(E, _4)),
            createRegularMove(createSquare(E, _7), createSquare(E, _5)),
            createRegularMove(createSquare(D, _1), createSquare(H, _5)),
            createRegularMove(createSquare(B, _8), createSquare(C, _6)),
            createRegularMove(createSquare(F, _1), createSquare(C, _4)),
            createRegularMove(createSquare(G, _8), createSquare(F, _6)),
            createRegularMove(createSquare(H, _5), createSquare(F, _7)),
        ]));

        const gameStatus = determineGameStatus(game);
        expect(gameStatus).toEqual([GameStatus.Checkmate, PieceColor.Black]);
    });

    it('determines chekmate while it is whites\'s move', () => {
        const game = createGame(STANDARD_INITIAL_POSITION, createMoveHistory([
            createRegularMove(createSquare(E, _2), createSquare(E, _4)),
            createRegularMove(createSquare(E, _7), createSquare(E, _5)),
            createRegularMove(createSquare(B, _1), createSquare(C, _3)),
            createRegularMove(createSquare(F, _8), createSquare(C, _5)),
            createRegularMove(createSquare(B, _2), createSquare(B, _3)),
            createRegularMove(createSquare(D, _8), createSquare(H, _4)),
            createRegularMove(createSquare(C, _1), createSquare(B, _2)),
            createRegularMove(createSquare(H, _4), createSquare(F, _2)),
        ]));

        const gameStatus = determineGameStatus(game);
        expect(gameStatus).toEqual([GameStatus.Checkmate, PieceColor.White]);
    });

    it('determines in check when checked but not checkmated for white', () => {
        const game = createGame(STANDARD_INITIAL_POSITION, createMoveHistory([
            createRegularMove(createSquare(E, _2), createSquare(E, _4)),
            createRegularMove(createSquare(E, _7), createSquare(E, _5)),
            createRegularMove(createSquare(F, _2), createSquare(F, _4)),
            createRegularMove(createSquare(D, _8), createSquare(H, _4))
        ]));

        const gameStatus = determineGameStatus(game);
        expect(gameStatus).toEqual([GameStatus.InCheck, PieceColor.White]);
    });

    it('determines remi when not on check but no move arae availeble', () => {
        const initialBoard = createBoardFromList([
            [createSquare(B, _8), createPiece(PieceColor.Black, PieceType.King)],
            [createSquare(D, _7), createPiece(PieceColor.White, PieceType.King)],
            [createSquare(C, _6), createPiece(PieceColor.White, PieceType.Queen)]
        ]);

        const game = createGame(initialBoard, createMoveHistory([
            createRegularMove(createSquare(C, _6), createSquare(C, _7)),
            createRegularMove(createSquare(B, _8), createSquare(A, _8)),
            createRegularMove(createSquare(D, _7), createSquare(C, _6))
        ]));

        const gameStatus = determineGameStatus(game);
        expect(gameStatus).toEqual([GameStatus.Remi, PieceColor.Black]);
    });
});