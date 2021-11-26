import { createSquare, fromString } from "../constructors";
import { A, H, _1 } from "../Square";
import {toString, squareEquals} from '../getters';
import { getOrElse, isRight } from "fp-ts/lib/Either";

describe('domain/entities/square', () => {
    describe('fromString', () => {
        it('reverst transformation to string', () => {
            const square = createSquare(H, _1);
            const string = toString(square);
            const result = fromString(string);
            const equals = squareEquals(square);
            const extracted = getOrElse(() => createSquare(A, _1))(result);
            expect(isRight(result)).toBe(true);
            expect(equals(extracted)).toBe(true);
        });
    });
});