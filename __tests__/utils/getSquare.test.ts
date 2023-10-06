// test getSquares function in src/utils/getSquares.ts
import { getSquare } from '../../src/utils/getSquare';

describe('getSquare', () => {
  it('should return the correct square for 0,0 coordinates', () => {
    expect(getSquare(0, 0, false)).toEqual(0);
  });
});
