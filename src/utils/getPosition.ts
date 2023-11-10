import { COLUMN_LENGTH } from '../constants';
import { SIZE } from '../components/Chessboard/Chessboard';

export const getPosition = (index: number, isBoardFlipped: boolean) => {
  'worklet';
  return isBoardFlipped
    ? {
        x: (7 - (index % COLUMN_LENGTH)) * SIZE,
        y: (7 - Math.floor(index / COLUMN_LENGTH)) * SIZE,
      }
    : {
        x: (index % COLUMN_LENGTH) * SIZE,
        y: Math.floor(index / COLUMN_LENGTH) * SIZE,
      };
};
