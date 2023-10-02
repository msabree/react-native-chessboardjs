// test getImage function in src/utils/getImage.ts
import {getImage} from '../../src/utils/getImage';
import {FenPosition} from '../../src/@types';

describe('getImage', () => {
  const testCases = [
    {piece: 'r', expected: {testUri: '../../../src/assets/br.png'}},
    {piece: 'n', expected: {testUri: '../../../src/assets/bn.png'}},
    {piece: 'b', expected: {testUri: '../../../src/assets/bb.png'}},
    {piece: 'q', expected: {testUri: '../../../src/assets/bq.png'}},
    {piece: 'k', expected: {testUri: '../../../src/assets/bk.png'}},
    {piece: 'p', expected: {testUri: '../../../src/assets/bp.png'}},
    {piece: 'R', expected: {testUri: '../../../src/assets/wr.png'}},
    {piece: 'N', expected: {testUri: '../../../src/assets/wn.png'}},
    {piece: 'B', expected: {testUri: '../../../src/assets/wb.png'}},
    {piece: 'Q', expected: {testUri: '../../../src/assets/wq.png'}},
    {piece: 'K', expected: {testUri: '../../../src/assets/wk.png'}},
    {piece: 'P', expected: {testUri: '../../../src/assets/wp.png'}},
    // should never happen
    {piece: 'invalid', expected: {testUri: '../../../src/assets/wp.png'}},
  ];

  testCases.forEach(({piece, expected}) => {
    it(`should return the correct image path for ${piece}`, () => {
      expect(getImage(piece as FenPosition)).toEqual(expected);
    });
  });
});
