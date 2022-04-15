import { sequenceT } from 'fp-ts/lib/Apply';
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';


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
