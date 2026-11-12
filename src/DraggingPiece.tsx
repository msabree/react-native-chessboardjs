import React from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useChessboardContext } from './ChessboardProvider';
import { Piece } from './Piece';

/**
 * The piece under the finger. Rendered last, outside the clipped board, and
 * moved purely on the UI thread.
 */
export function DraggingPiece() {
  const {
    draggingPiece,
    pieces,
    squareWidth,
    dragX,
    dragY,
    draggingPieceStyle,
    id,
  } = useChessboardContext();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: dragX.value - squareWidth / 2 },
      { translateY: dragY.value - squareWidth / 2 },
    ],
  }));

  if (!draggingPiece) return null;

  return (
    <Animated.View
      testID={`${id}-dragging-piece`}
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          left: 0,
          top: 0,
          zIndex: 1000,
          elevation: 1000,
        },
        animatedStyle,
      ]}
    >
      <View style={draggingPieceStyle}>
        <Piece
          pieces={pieces}
          pieceType={draggingPiece.pieceType}
          size={squareWidth}
        />
      </View>
    </Animated.View>
  );
}
