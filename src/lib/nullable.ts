import { Either } from "fp-ts/lib/Either";
import { getOrUndefined } from "./either";

export type Nullable<N> = N | undefined | null;
type NotNull<NN> = NN extends (undefined | null) ? never : NN; 

export const isNull = <N>(n: Nullable<N>): n is (undefined | null) => n === null || typeof n === 'undefined';
export const isNotNull = <N>(n: Nullable<N>): n is N =>  n !== null && typeof n !== 'undefined';

type UnaryFn<Arg, Result> = (a: NotNull<Arg>) => Nullable<Result>

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

        if(isNull(current)){
            return undefined;
        }

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

export const pipeWithFallback = <
Input, 
Res,
A = unknown, 
B = unknown, 
C = unknown, 
D = unknown, 
E = unknown, 
F = unknown, 
G = unknown, 
H = unknown> (fallback: () => Res, input: Input, ...fns: PipeFunctionArgs<Input, Res, A, B, C, D, E, F, G, H>): Res => {
    const result = pipeUntilNull(input, ...fns);
    return isNull(result) ? fallback() : result;
}


type FlowInitialFn <In extends unknown[], Res> = (...input:In) => Nullable<Res>;  
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

        if(isNull(current)){
            return undefined;
        }

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

export const flowWithFallback = <
Input extends unknown[], 
Res, 
A = unknown, 
B = unknown, 
C = unknown, 
D = unknown, 
E = unknown, 
F = unknown, 
G = unknown, 
H = unknown> (fallback: () => Res, ...fns: FlowFunctionArgs<Input, Res, A, B, C, D, E, F, G, H>) => (...input: Input):Res => {
    const result = flowUntilNull(...fns)(...input);
    return isNotNull(result) ? result : fallback();
}


export const filterNullable = <N>(pred: (arg: N) => boolean) => (n:Nullable<N>): Nullable<N> =>
    isNotNull(n) && pred(n) ? n : undefined;

export const guardNullable = <N>(pred: (arg: N) => boolean) => (n:N): Nullable<N> =>
    pred(n) ? n : undefined;

export const defaultTo = <N>(ifNull: () => N) => (n: Nullable<N>):N =>
    isNull(n) ? ifNull() : n;

export const fromEither = <N>(either: Either<any, N>): Nullable<N> =>
    getOrUndefined(either);

export const mapNullable = <I, O>(map:((i:I) => Nullable<O>)) => (input: Nullable<I>): Nullable<O> =>
    isNull(input) ? undefined : map(input);

export const combineNullables = <N>(...nullableList: Nullable<N>[]): Nullable<N[]> =>
    nullableList.some(isNull) ? undefined : nullableList as N[];

type StringLiteral<T> = T extends `${string & T}` ? T : never;


// {[P in keyof C | StringLiteral<K>] : P extends keyof C ? C[P] : N}
export const bindNullable = <C, K, N>(key: StringLiteral<K>, produce: (c: C) => Nullable<N>) => (collection: C): Nullable<C & {[P in StringLiteral<K>]: N}> => {
    const produced = produce(collection);
    
    return isNull(produced)
        ? undefined
        : ({
            ...(collection as C),
            [key]: produced
        } as C & {[P in StringLiteral<K>]: N})
};
