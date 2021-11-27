export enum IncludeWhileDecision {
    INCLUDE,
    INCLUDE_LAST,
    STOP
}


type IncludeDecider<E> = (element: E) => IncludeWhileDecision;

export const includeWhile = <E>(decide: IncludeDecider<E>) => (list: E[]):E[] =>{
    const result:E[] = [];


    for(const element of list) {
        const decision = decide(element);

        if(decision === IncludeWhileDecision.STOP) {
            break;
        } else if(decision === IncludeWhileDecision.INCLUDE_LAST) {
            result.push(element);
            break;
        }

        result.push(element);
    }

    return result;
}