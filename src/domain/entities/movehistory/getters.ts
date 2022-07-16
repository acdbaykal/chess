import {MoveHistory} from './MoveHistory';
import {List} from 'immutable';
import { Move } from '../move/Move';
import { Nullable } from '../../../lib/nullable';
import { PieceColor } from '../piece/Piece';

export const calcHashCode = (movesHistory: MoveHistory):number =>
    (movesHistory as unknown as List<Move>).hashCode()

export const equals = (movesHistory1: MoveHistory) => (movesHistory2: MoveHistory): boolean =>
    calcHashCode(movesHistory1) === calcHashCode(movesHistory2);


export const getMoveAt = (index: number) => (moveHistory: MoveHistory): Nullable<Move> =>
    index < 0
        ? undefined
        : moveHistory[index];

export const getLastMove = (moveHistory:MoveHistory) => {
    const index = moveHistory.length - 1;
    return getMoveAt(index)(moveHistory);
};

export const getPreviousMove = (moveHistory: MoveHistory) => {
    const index = moveHistory.length - 2;
    return getMoveAt(index)(moveHistory);
};

export const getActiveColor = (moveHistory: MoveHistory) =>
    moveHistory.length % 2 === 0
        ? PieceColor.White
        : PieceColor.Black;
    