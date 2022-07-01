export type Nullable<N> = N | undefined | null;

export const isNull = <N>(n: Nullable<N>) => n === null || typeof n === 'undefined';

type UnaryFn<Arg, Result> = (a: Arg) => Nullable<Result>

type FuntionArgs<In, Res,  A, B, C, D, E, F, G, H> = 
    | [
        UnaryFn<In, Res>
    ]
    | [
        UnaryFn<In, A>,
        UnaryFn<A, Res>
    ]
    | [
        UnaryFn<In, A>,
        UnaryFn<A, B>,
        UnaryFn<B, Res>
    ]
    | [
        UnaryFn<In, A>,
        UnaryFn<A, B>,
        UnaryFn<B, C>,
        UnaryFn<C, Res>
    ]
    | [
        UnaryFn<In, A>,
        UnaryFn<A, B>,
        UnaryFn<B, C>,
        UnaryFn<C, D>,
        UnaryFn<D, Res>
    ]
    | [
        UnaryFn<In, A>,
        UnaryFn<A, B>,
        UnaryFn<B, C>,
        UnaryFn<C, D>,
        UnaryFn<D, E>,
        UnaryFn<E, Res>
    ]
    | [
        UnaryFn<In, A>,
        UnaryFn<A, B>,
        UnaryFn<B, C>,
        UnaryFn<C, D>,
        UnaryFn<D, E>,
        UnaryFn<E, F>,
        UnaryFn<F, Res>
    ]
    | [
        UnaryFn<In, A>,
        UnaryFn<A, B>,
        UnaryFn<B, C>,
        UnaryFn<C, D>,
        UnaryFn<D, E>,
        UnaryFn<E, F>,
        UnaryFn<F, G>,
        UnaryFn<G, Res>
    ]
    | [
        UnaryFn<In, A>,
        UnaryFn<A, B>,
        UnaryFn<B, C>,
        UnaryFn<C, D>,
        UnaryFn<D, E>,
        UnaryFn<E, F>,
        UnaryFn<F, G>,
        UnaryFn<G, H>,
        UnaryFn<H, Res>
    ]

export const pipeUntilNull = <
    Input, 
    Res, 
    A = unknown, 
    B = unknown, 
    C = unknown, 
    D = unknown, 
    E = unknown, 
    F = unknown, 
    G = unknown, 
    H = unknown> (input: Input, ...fns: FuntionArgs<Input, Res, A, B, C, D, E, F, G, H>): Nullable<Res> => {
        let current = input;

        for(const fn of fns) {
            // @ts-expect-error
            const interrim = fn(current);

            if(isNull(interrim)){
                return undefined;
            } else {
                // @ts-expect-error
                current = interrim;
                continue;
            }
        }

        return current as unknown as Nullable<Res>;
    }
