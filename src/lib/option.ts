import { getOrElse, Option } from "fp-ts/Option";

export const getOrUndefined = <T>(o:Option<T>) => getOrElse<T | undefined>(() => undefined)(o);

export const getOrFalse = getOrElse<boolean>(() => false);

export const getOrTrue = getOrElse<boolean>(() => true);
