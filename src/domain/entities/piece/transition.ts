import { PieceColor } from "./Piece";

export const reversePieceColor = (color:PieceColor) => color === PieceColor.White ? PieceColor.Black : PieceColor.White;
