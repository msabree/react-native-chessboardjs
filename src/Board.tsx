import React from 'react';
import { View } from 'react-native';
import { useChessboardContext } from './ChessboardProvider';
import { PieceLayer } from './PieceLayer';
import { Square } from './Square';

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

  return (
    // outer view measures available width when boardWidth is not fixed
    <View
      onLayout={(e) => setMeasuredWidth(Math.floor(e.nativeEvent.layout.width))}
      style={{ width: '100%' }}
    >
      {boardWidth > 0 && (
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
      )}
    </View>
  );
}
