import React, { memo } from 'react';
import { Text, View } from 'react-native';
import { useChessboardContext } from './ChessboardProvider';

type Props = {
  squareId: string;
  isLightSquare: boolean;
  rowIndex: number;
  columnIndex: number;
};

export const Square = memo(function Square({
  squareId,
  isLightSquare,
  rowIndex,
  columnIndex,
}: Props) {
  const {
    squareWidth,
    squareStyle,
    squareStyles,
    lightSquareStyle,
    darkSquareStyle,
    showNotation,
    chessboardRows,
    lightSquareNotationStyle,
    darkSquareNotationStyle,
    alphaNotationStyle,
    numericNotationStyle,
    squareRenderer,
    currentPosition,
  } = useChessboardContext();

  const notationColor = isLightSquare
    ? lightSquareNotationStyle
    : darkSquareNotationStyle;

  const content = showNotation ? (
    <>
      {columnIndex === 0 && (
        <Text style={[notationColor, numericNotationStyle]}>
          {squareId.slice(1)}
        </Text>
      )}
      {rowIndex === chessboardRows - 1 && (
        <Text style={[notationColor, alphaNotationStyle]}>{squareId[0]}</Text>
      )}
    </>
  ) : null;

  return (
    <View
      testID={`square-${squareId}`}
      style={[
        { width: squareWidth, height: squareWidth },
        squareStyle,
        isLightSquare ? lightSquareStyle : darkSquareStyle,
        squareStyles[squareId],
      ]}
    >
      {squareRenderer
        ? squareRenderer({
            piece: currentPosition[squareId] ?? null,
            square: squareId,
            children: content,
          })
        : content}
    </View>
  );
});
