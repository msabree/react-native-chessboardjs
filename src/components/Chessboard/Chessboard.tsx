import React, { useState } from 'react';
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
import { flipBoard } from '../../utils/flipBoard';

const SIZE = Dimensions.get('window').width / COLUMN_LENGTH - MARGIN;

export const Chessboard = ({
  position = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
  boardOrientation = 'white',
  onPieceDrop,
  onSquareClick = () => true,
  customDarkSquareStyle = { backgroundColor: 'black' },
  customLightSquareStyle = { backgroundColor: 'white' },
  customSquareStyles = new Map<string, object>(),
}: ChessBoardProps) => {
  const board: { square: string }[][] = [];
  for (let i = 0; i < COLUMN_LENGTH; i++) {
    const rows = [];
    for (let j = 0; j < ROW_LENGTH; j++) {
      rows.push({ square: `${COLUMN_LABELS[j]}${8 - i}` });
    }
    board.push(rows);
  }

  const [boardState] = useState<FenPosition[][]>(fenTo2dArray(position));

  const squareToHighlight = useSharedValue<number>(-1);
  const boardOriented: {
    square: string;
  }[][] = boardOrientation === 'white' ? board : flipBoard(board);
  const boardStateOriented =
    boardOrientation === 'white' ? boardState : flipBoard(boardState as any);

  return (
    <GestureHandlerRootView>
      {/* Underlay of chessboard */}
      {boardOriented.map((row, index) =>
        row.map((square, idx) => {
          const chessPiecePosition = getPosition(index * COLUMN_LENGTH + idx);
          return (
            <View
              key={square.square}
              style={{
                ...((idx + index) % 2 === 0
                  ? customLightSquareStyle
                  : customDarkSquareStyle),
                ...styles(idx, index, chessPiecePosition).chessSquare,
                ...customSquareStyles.get(square.square),
                // ...customBoardStyle, No board to style
              }}
            />
          );
        })
      )}
      {/* Overlay of chess pieces */}
      {boardStateOriented.map((row: any, index: number) =>
        row.map((square: any, idx: number) => (
          <ChessPiece
            key={`${square}${index}${idx}`}
            board={boardOriented}
            boardState={boardStateOriented}
            row={index}
            col={idx}
            squareToHighlight={squareToHighlight}
            value={square}
            trueIndex={index * COLUMN_LENGTH + idx}
            onPieceDrop={onPieceDrop}
            onSquareClick={onSquareClick}
            position={getPosition(index * COLUMN_LENGTH + idx)}
          />
        ))
      )}
    </GestureHandlerRootView>
  );
};

const styles = (_: number, __: number, position: { x: number; y: number }) =>
  StyleSheet.create({
    chessSquare: {
      position: 'absolute',
      width: SIZE,
      height: SIZE,
      margin: MARGIN * 2,
      transform: [{ translateX: position.x }, { translateY: position.y }],
    },
  });

type ChessBoardProps = {
  position?: string;
  boardOrientation?: 'white' | 'black';
  onPieceDrop: (sourceSquare: Square, targetSquare: Square) => boolean;
  onSquareClick: (square: Square) => boolean;
  customDarkSquareStyle?: object;
  customLightSquareStyle?: object;
  customSquareStyles?: Map<string, object>;
  customBoardStyle?: object;
};
