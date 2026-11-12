import React from 'react';
import { View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import { useChessboardContext } from './ChessboardProvider';
import { DraggingPiece } from './DraggingPiece';
import { PieceLayer } from './PieceLayer';
import { Square } from './Square';
import { useBoardGesture } from './useBoardGesture';

export function Board() {
  const {
    id,
    board,
    boardWidth,
    squareWidth,
    chessboardRows,
    boardStyle,
    setMeasuredWidth,
  } = useChessboardContext();
  const gesture = useBoardGesture();

  return (
    // outer view measures available width when boardWidth is not fixed
    <View
      testID={`${id}-container`}
      onLayout={(e) => setMeasuredWidth(Math.floor(e.nativeEvent.layout.width))}
      style={{ width: '100%' }}
    >
      {boardWidth > 0 && (
        <GestureDetector gesture={gesture}>
          <View
            testID={`board-${id}`}
            style={[
              boardStyle,
              { width: boardWidth, height: squareWidth * chessboardRows },
            ]}
          >
            {board.map((row, rowIndex) => (
              <View key={rowIndex} style={{ flexDirection: 'row' }}>
                {row.map((sq, columnIndex) => (
                  <Square
                    key={sq.squareId}
                    squareId={sq.squareId}
                    isLightSquare={sq.isLightSquare}
                    rowIndex={rowIndex}
                    columnIndex={columnIndex}
                  />
                ))}
              </View>
            ))}
            <PieceLayer />
          </View>
        </GestureDetector>
      )}
      {boardWidth > 0 && <DraggingPiece />}
    </View>
  );
}
