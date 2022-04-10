import {List} from 'immutable';
import {pipe} from "fp-ts/lib/function"

const createListAdapter = <T>(list: List<T>): ReadonlyArray<T> => 
    // @ts-expect-error
    new Proxy(list, {
        get(target, prop: keyof ReadonlyArray<T>) {
            if(prop === 'length'){
                return target.size
            } else if (prop === 'flat') {
                return target.flatten
            } else {
                // @ts-expect-error
                return target[prop]
            }
        } 
    });

export const makeListImmutable = <T>(mutableList: T[]): ReadonlyArray<T> =>
    pipe(
        mutableList,
        List,
        createListAdapter
    );
