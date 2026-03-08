import { COLUMN_LENGTH } from '../constants';

/**
 * Returns { x, y } coordinates for the square at the given index.
 * @param index - Square index (0–63).
 * @param isBoardFlipped - Whether the board is oriented for black.
 * @param squareWidth - Width of one square (e.g. boardWidth / 8).
 */
export const getPosition = (
  index: number,
  isBoardFlipped: boolean,
  squareWidth: number
) => {
  'worklet';
  return isBoardFlipped
    ? {
        x: (7 - (index % COLUMN_LENGTH)) * squareWidth,
        y: (7 - Math.floor(index / COLUMN_LENGTH)) * squareWidth,
      }
    : {
        x: (index % COLUMN_LENGTH) * squareWidth,
        y: Math.floor(index / COLUMN_LENGTH) * squareWidth,
      };
};
