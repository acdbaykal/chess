import {MoveHistory} from './MoveHistory';
import {List} from 'immutable';
import { Move } from '../move/Move';
import { none} from 'fp-ts/lib/Option';
import { fromNullable } from 'fp-ts/lib/Option';

export const calcHashCode = (movesHistory: MoveHistory):number =>
    (movesHistory as unknown as List<Move>).hashCode()

export const equals = (movesHistory1: MoveHistory) => (movesHistory2: MoveHistory): boolean =>
    calcHashCode(movesHistory1) === calcHashCode(movesHistory2);


export const getMoveAt = (index: number) => (moveHistory: MoveHistory) =>
    index < 0
        ? none
        : fromNullable(moveHistory[index]);

export const getLastMove = (moveHistory:MoveHistory) => {
    const index = moveHistory.length - 1;
    return getMoveAt(index)(moveHistory);
};

export const getPreviousMove = (moveHistory: MoveHistory) => {
    const index = moveHistory.length - 2;
    return getMoveAt(index)(moveHistory);
};
    