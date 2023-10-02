import { Dimensions } from 'react-native';
import { COLUMN_LENGTH, MARGIN } from '../constants';

const SIZE = Dimensions.get('window').width / COLUMN_LENGTH - MARGIN;

export const getPosition = (index: number) => {
  'worklet';
  return {
    x: (index % COLUMN_LENGTH) * SIZE,
    y: Math.floor(index / COLUMN_LENGTH) * SIZE,
  };
};
