import * as E from 'fp-ts/lib/Either';


// @ts-expect-error
export const getOrUndefined = <R>(x:E.Either<any, R>):R | undefined=> E.getOrElse<typeof undefined, R>(() => undefined)(x);