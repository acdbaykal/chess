import { sequenceT } from 'fp-ts/lib/Apply';
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import { either } from 'ramda';
import { E, E } from '../domain/entities/square/Square';
import { isNull, Nullable } from './nullable';


// @ts-expect-error
export const getOrUndefined = <R>(x:E.Either<any, R>):R | undefined=> E.getOrElse<typeof undefined, R>(() => undefined)(x);

export const combineEither = sequenceT(E.Apply);

export const logEither = <L, R>(either: E.Either<L, R>):E.Either<L, R> => 
    E.fold<L, R, E.Either<L,R>>(
        l => (console.error(l), E.left(l)),
        r => (console.log(r), E.right(r))
    )(either);

export const logLeft = <L, R>(either: E.Either<L, R>):E.Either<L, R> =>
    pipe(
        either,
        E.mapLeft<L, L>(err => (console.error(err), err))
    ) as E.Either<L, R>

export const getOrFalse = E.getOrElse(() => false);

export const getOrTrue = E.getOrElse(() => true);

export const assert = <L, Arg>(test: (arg:Arg) => boolean, onLeft: (arg:Arg) => L) => (arg:Arg) : E.Either<L, Arg> =>
    test(arg)
        ? E.right(arg)
        : E.left(onLeft(arg))


export const fromNullable = <L, N>(ifNull: () => L) => (n: Nullable<N>):E.Either<L, N> => 
        isNull(n) ? E.left(ifNull()) : E.right(n);


export const getOrThrow = <L, R, E extends Error>(mapLeft: (l:L) => E) => (either: E.Either<L, R>):R => {
    if(E.isRight(either)){
        return getOrUndefined(either) as R;
    } else {
        throw E.mapLeft(mapLeft)(either);
    }
}
        
