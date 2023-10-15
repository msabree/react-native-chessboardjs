// test Chessboard component
import React from 'react';
import Chessboard from '../../src/index';

import renderer from 'react-test-renderer';

jest.useFakeTimers();

jest.mock('react-native', () => {
  return {
    View: () => <></>,
    Dimensions: {
      get: () => {
        return { width: {} };
      },
    },
  };
});

jest.mock('react-native-gesture-handler', () => {
  return {
    GestureHandlerRootView: () => <></>,
    Dimensions: {
      get: () => {
        return { width: {} };
      },
    },
  };
});

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
