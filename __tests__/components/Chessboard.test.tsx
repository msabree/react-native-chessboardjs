// test Chessboard component
import React from 'react';
import Chessboard from '../../src/index';

import renderer from 'react-test-renderer';

describe('Chessboard', () => {
  it('should render the Chessboard', () => {
    renderer.create(
      <Chessboard
        boardOrientation="white"
        onPieceDrop={() => {
          return true;
        }}
        onSquareClick={() => {
          return true;
        }}
        isDraggablePiece={() => false}
      />
    );
  });
});
