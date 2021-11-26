import { getOrElse, Option } from "fp-ts/Option";

export const getOrUndefined = <T>(o:Option<T>) => getOrElse<T | undefined>(() => undefined)(o); 
