/**
 * @format
 */

import { getPosition } from '../../src/utils/getPosition';

const squareWidth = 45;

describe('getPosition', () => {
  it('should return the correct position for index 0 (white orientation)', () => {
    expect(getPosition(0, false, squareWidth)).toEqual({ x: 0, y: 0 });
  });

  it('should return the correct position for index 0 (black orientation)', () => {
    expect(getPosition(0, true, squareWidth)).toEqual({
      x: 7 * squareWidth,
      y: 7 * squareWidth,
    });
  });

  it('should return the correct position for index 9 (white orientation)', () => {
    expect(getPosition(9, false, squareWidth)).toEqual({
      x: 1 * squareWidth,
      y: 1 * squareWidth,
    });
  });
});
