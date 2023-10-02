/**
 * @format
 */

// test getPosition function in src/utils/getPosition.ts
import {getPosition} from '../../src/utils/getPosition';

describe('getPosition', () => {
  it('should return the correct position for index 0', () => {
    expect(getPosition(0)).toEqual({x: 0, y: 0});
  });
});
