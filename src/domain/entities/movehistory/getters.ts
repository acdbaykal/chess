import {MoveHistory} from './MoveHistory';
import {List} from 'immutable';
import { Move } from '../move/Move';

export const calcHashCode = (movesHistory: MoveHistory):number =>
    (movesHistory as unknown as List<Move>).hashCode()

export const equals = (movesHistory1: MoveHistory) => (movesHistory2: MoveHistory): boolean =>
    calcHashCode(movesHistory1) === calcHashCode(movesHistory2);
    