import { flipBoard } from '../../src/utils/flipBoard';

describe('flipBoard', () => {
  it('should return a 2d array flipped upside down', () => {
    const matrix: any[][] = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];

    const expected: any[][] = [
      [9, 8, 7],
      [6, 5, 4],
      [3, 2, 1],
    ];

    expect(flipBoard(matrix)).toEqual(expected);
  });
});
