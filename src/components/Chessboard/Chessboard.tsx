import React, { useEffect, useState } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import ChessPiece from '../ChessPiece/ChessPiece';
import type { FenPosition, Square } from '../../@types';
import { Dimensions, StyleSheet, View } from 'react-native';
import {
  COLUMN_LABELS,
  COLUMN_LENGTH,
  MARGIN,
  ROW_LENGTH,
} from '../../constants';
import { fenTo2dArray, getPosition } from '../../utils';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const SIZE = Dimensions.get('window').width / COLUMN_LENGTH - MARGIN;

const Chessboard = ({
  position = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
  onPieceDrop,
  onSquareClick = (_: Square) => {
    'worklet';
    return true;
  },
  isDraggablePiece = (_: Square) => {
    'worklet';
    return true;
  },
  customDarkSquareStyle = { backgroundColor: 'black' },
  customLightSquareStyle = { backgroundColor: 'white' },
  customSquareStyles = new Map<string, object>(),
  boardOrientation = 'white',
}: ChessBoardProps) => {
  const isBoardFlipped = boardOrientation === 'black';
  const board: { square: string }[][] = [];
  for (let i = 0; i < COLUMN_LENGTH; i++) {
    const rows = [];
    for (let j = 0; j < ROW_LENGTH; j++) {
      rows.push({ square: `${COLUMN_LABELS[j]}${8 - i}` });
    }
    board.push(rows);
  }

  const [boardState, setBoardState] = useState<FenPosition[][]>(
    fenTo2dArray(position)
  );

  const squareToHighlight = useSharedValue<number>(-1);

  useEffect(() => {
    setBoardState(fenTo2dArray(position));
  }, [position]);

  return (
    <GestureHandlerRootView>
      {/* Underlay of chessboard */}
      {board.map((row, index) =>
        row.map((square, idx) => {
          const chessPiecePosition = getPosition(
            index * COLUMN_LENGTH + idx,
            isBoardFlipped
          );
          return (
            <View
              key={square.square}
              style={{
                ...((idx + index) % 2 === 0
                  ? customLightSquareStyle
                  : customDarkSquareStyle),
                ...styles(idx, index, chessPiecePosition).chessSquare,
              }}
            >
              <View
                style={{
                  ...styles(
                    idx,
                    index,
                    getPosition(index * COLUMN_LENGTH + idx, isBoardFlipped)
                  ).chessSquareOverlay,
                  ...customSquareStyles?.get(square.square),
                }}
              />
            </View>
          );
        })
      )}
      {/* Overlay of chess pieces */}
      {boardState.map((row, index) =>
        row.map((square, idx) => (
          <ChessPiece
            key={`${square}${index}${idx}`}
            board={board}
            boardState={boardState}
            row={index}
            col={idx}
            squareToHighlight={squareToHighlight}
            value={square}
            trueIndex={index * COLUMN_LENGTH + idx}
            onPieceDrop={onPieceDrop}
            onSquareClick={onSquareClick}
            isDraggablePiece={isDraggablePiece}
            position={getPosition(index * COLUMN_LENGTH + idx, isBoardFlipped)}
            isBoardFlipped={isBoardFlipped}
          />
        ))
      )}
    </GestureHandlerRootView>
  );
};

export default Chessboard;

const styles = (_: number, __: number, position: { x: number; y: number }) =>
  StyleSheet.create({
    chessSquare: {
      position: 'absolute',
      width: SIZE,
      height: SIZE,
      margin: MARGIN * 2,
      transform: [{ translateX: position.x }, { translateY: position.y }],
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    chessSquareOverlay: {
      position: 'relative',
      width: SIZE,
      height: SIZE,
      margin: MARGIN * 2,
    },
  });

type ChessBoardProps = {
  position?: string;
  onPieceDrop: (sourceSquare: Square, targetSquare: Square) => boolean;
  onSquareClick: (square: Square) => boolean;
  isDraggablePiece: (square: Square) => boolean;
  customDarkSquareStyle?: object;
  customLightSquareStyle?: object;
  customSquareStyles?: Map<string, object>;
  customBoardStyle?: object;
  boardOrientation?: 'black' | 'white';
};
