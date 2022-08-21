import { flowUntilNull, isNull } from "../../../lib/nullable"
import { pieceToEmoji } from "../piece/conversions"
import { createSquare } from "../square/constructors"
import { _1, _2, _3, _4, _5, _6, _7, _8, A, B, C, D, E, F, G, H, Square } from "../square/Square"
import { Board } from "./Board"
import { getPieceAt } from "./getters"

const RENDER_ORDER: Square[][] = [
    [
        createSquare(A, _8),
        createSquare(B, _8),
        createSquare(C, _8),
        createSquare(D, _8),
        createSquare(E, _8),
        createSquare(F, _8),
        createSquare(G, _8),
        createSquare(H, _8),
    ],
    [
        createSquare(A, _7),
        createSquare(B, _7),
        createSquare(C, _7),
        createSquare(D, _7),
        createSquare(E, _7),
        createSquare(F, _7),
        createSquare(G, _7),
        createSquare(H, _7),
    ],
    [
        createSquare(A, _6),
        createSquare(B, _6),
        createSquare(C, _6),
        createSquare(D, _6),
        createSquare(E, _6),
        createSquare(F, _6),
        createSquare(G, _6),
        createSquare(H, _6),
    ],
    [
        createSquare(A, _5),
        createSquare(B, _5),
        createSquare(C, _5),
        createSquare(D, _5),
        createSquare(E, _5),
        createSquare(F, _5),
        createSquare(G, _5),
        createSquare(H, _5),
    ],
    [
        createSquare(A, _4),
        createSquare(B, _4),
        createSquare(C, _4),
        createSquare(D, _4),
        createSquare(E, _4),
        createSquare(F, _4),
        createSquare(G, _4),
        createSquare(H, _4),
    ],
    [
        createSquare(A, _3),
        createSquare(B, _3),
        createSquare(C, _3),
        createSquare(D, _3),
        createSquare(E, _3),
        createSquare(F, _3),
        createSquare(G, _3),
        createSquare(H, _3),
    ],
    [
        createSquare(A, _2),
        createSquare(B, _2),
        createSquare(C, _2),
        createSquare(D, _2),
        createSquare(E, _2),
        createSquare(F, _2),
        createSquare(G, _2),
        createSquare(H, _2),
    ],
    [
        createSquare(A, _1),
        createSquare(B, _1),
        createSquare(C, _1),
        createSquare(D, _1),
        createSquare(E, _1),
        createSquare(F, _1),
        createSquare(G, _1),
        createSquare(H, _1),
    ]
]

export const boardToString  = (board:Board  ):string => 
    ['A B C D E F G H'].concat(
        RENDER_ORDER.map(
            line => 
                line.map(
                    sqr => {
                        const piece = getPieceAt(board, sqr);
                        return isNull(piece) ? '•' : pieceToEmoji(piece);
                    }
                ).join(' ')
        )
    )
    .map((lineStr, index) => (index === 0 ? '  ' : `${8 - index + 1} `) + lineStr)
    .join('\n')