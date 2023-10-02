import {Dimensions} from 'react-native';
import {COLUMN_LENGTH, MARGIN} from '../constants';

const SIZE = Dimensions.get('window').width / COLUMN_LENGTH - MARGIN;

export const getSquare = (x: number, y: number) => {
  'worklet';
  const row = Math.floor(y / SIZE);
  const col = Math.floor(x / SIZE);

  return col + row * COLUMN_LENGTH;
};
