import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useChessboardContext } from './ChessboardProvider';
import { Piece } from './Piece';
import { getSquareOrigin } from './utils';

/**
 * All pieces are siblings in one absolute layer above the squares, so a
 * raised piece can paint over the whole board (the old bug).
 */
export function PieceLayer() {
  const {
    currentPosition,
    pieces,
    squareWidth,
    chessboardRows,
    chessboardColumns,
    boardOrientation,
  } = useChessboardContext();

  if (!squareWidth) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {Object.entries(currentPosition).map(([square, { pieceType }]) => {
        const { x, y } = getSquareOrigin(
          square,
          squareWidth,
          chessboardRows,
          chessboardColumns,
          boardOrientation
        );
        return (
          <Piece
            key={square}
            pieces={pieces}
            pieceType={pieceType}
            square={square}
            size={squareWidth}
            style={{ position: 'absolute', left: x, top: y }}
          />
        );
      })}
    </View>
  );
}
