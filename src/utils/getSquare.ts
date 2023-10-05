import { Dimensions } from 'react-native';
import { COLUMN_LENGTH, MARGIN } from '../constants';

const SIZE = Dimensions.get('window').width / COLUMN_LENGTH - MARGIN;

export const getSquare = (x: number, y: number, isBoardFlipped: boolean) => {
  'worklet';
  const row = isBoardFlipped ? 7 - Math.floor(y / SIZE) : Math.floor(y / SIZE);
  const col = isBoardFlipped ? 7 - Math.floor(x / SIZE) : Math.floor(x / SIZE);

  return col + row * COLUMN_LENGTH;
};
