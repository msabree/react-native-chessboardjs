/**
 * @format
 */

// test fenTo2dArray function in src/utils/fenTo2dArray.ts
import { fenTo2dArray } from '../../src/utils/fenTo2dArray';
import type { FenPosition } from '../../src/@types';

describe('fenTo2dArray', () => {
  it('should return a 2d array of the fen string', () => {
    const fenString: string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
    const expected: FenPosition[][] = [
      ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
      ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
      ['8', '8', '8', '8', '8', '8', '8', '8'],
      ['8', '8', '8', '8', '8', '8', '8', '8'],
      ['8', '8', '8', '8', '8', '8', '8', '8'],
      ['8', '8', '8', '8', '8', '8', '8', '8'],
      ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
      ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
    ];

    expect(fenTo2dArray(fenString)).toEqual(expected);
  });
});
