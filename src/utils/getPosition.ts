import { Dimensions } from 'react-native';
import { COLUMN_LENGTH, MARGIN } from '../constants';

const SIZE = Dimensions.get('window').width / COLUMN_LENGTH - MARGIN;

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
