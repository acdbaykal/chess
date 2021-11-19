import { Square } from "../Square";

export const toString = (s: Square) => `${s.letterAxis}/${s.numericAxis}`;
export const squareEquals = (s1: Square) => (s2: Square) =>
    s1.letterAxis === s2.letterAxis && s1.numericAxis === s2.numericAxis;