type Predicate<Args extends Array<unknown> = unknown[]> = (...args: Args) => boolean;

export const or = <Args extends Array<unknown>>(...funcList: Predicate<Args>[]) => (...args:Args) =>
  funcList.reduce((acc, func) => acc || func(...args), false);

export const and = <Args extends Array<unknown>>(...funcList: Predicate<Args>[]) => (...args:Args) =>
  funcList.reduce((acc, func) => acc && func(...args), true);

export const not = <Args extends Array<unknown>>(predicate: Predicate<Args>) => (...args: Args) => !predicate(...args); 