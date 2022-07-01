export type Nullable<N> = N | undefined | null;

export const isNull = <N>(n: Nullable<N>): n is (undefined | null) => n === null || typeof n === 'undefined';
export const isNotNull = <N>(n: Nullable<N>): n is N =>  n !== null && typeof n !== 'undefined';

type UnaryFn<Arg, Result> = (a: Arg) => Nullable<Result>

type PipeFunctionArgs<In, Res,  A, B, C, D, E, F, G, H> = 
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
    H = unknown> (input: Input, ...fns: PipeFunctionArgs<Input, Res, A, B, C, D, E, F, G, H>): Nullable<Res> => {
        let current = input;

        for(const fn of fns) {
            // @ts-expect-error
            current = fn(current);

            if(isNull(current)){
                return undefined;
            } else {
                continue;
            }
        }

        return current as unknown as Nullable<Res>;
    }


type FlowInitialFn <In extends unknown[], Res> = (...input:In) => Res;  
type FlowFunctionArgs<In extends unknown[], Res,  A, B, C, D, E, F, G, H> = 
    | [
        FlowInitialFn<In, Res>
    ]
    | [
        FlowInitialFn<In, A>,
        UnaryFn<A, Res>
    ]
    | [
        FlowInitialFn<In, A>,
        UnaryFn<A, B>,
        UnaryFn<B, Res>
    ]
    | [
        FlowInitialFn<In, A>,
        UnaryFn<A, B>,
        UnaryFn<B, C>,
        UnaryFn<C, Res>
    ]
    | [
        FlowInitialFn<In, A>,
        UnaryFn<A, B>,
        UnaryFn<B, C>,
        UnaryFn<C, D>,
        UnaryFn<D, Res>
    ]
    | [
        FlowInitialFn<In, A>,
        UnaryFn<A, B>,
        UnaryFn<B, C>,
        UnaryFn<C, D>,
        UnaryFn<D, E>,
        UnaryFn<E, Res>
    ]
    | [
        FlowInitialFn<In, A>,
        UnaryFn<A, B>,
        UnaryFn<B, C>,
        UnaryFn<C, D>,
        UnaryFn<D, E>,
        UnaryFn<E, F>,
        UnaryFn<F, Res>
    ]
    | [
        FlowInitialFn<In, A>,
        UnaryFn<A, B>,
        UnaryFn<B, C>,
        UnaryFn<C, D>,
        UnaryFn<D, E>,
        UnaryFn<E, F>,
        UnaryFn<F, G>,
        UnaryFn<G, Res>
    ]
    | [
        FlowInitialFn<In, A>,
        UnaryFn<A, B>,
        UnaryFn<B, C>,
        UnaryFn<C, D>,
        UnaryFn<D, E>,
        UnaryFn<E, F>,
        UnaryFn<F, G>,
        UnaryFn<G, H>,
        UnaryFn<H, Res>
    ]

    export const flowUntilNull = <
    Input extends unknown[], 
    Res, 
    A = unknown, 
    B = unknown, 
    C = unknown, 
    D = unknown, 
    E = unknown, 
    F = unknown, 
    G = unknown, 
    H = unknown> (...fns: FlowFunctionArgs<Input, Res, A, B, C, D, E, F, G, H>) => (...input: Input):Nullable<Res> => {
        const calcInitialFn = fns[0];
        let current = calcInitialFn(...input);
        const remainingFns = fns.slice(1); 

        for(const fn of remainingFns) {
            // @ts-expect-error
            current = fn(current);

            if(isNull(current)){
                return undefined;
            } else {
                continue;
            }
        }

        return current as Res;
    }
