import React, { memo } from 'react';
import { View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import type { PieceRenderObject } from './types';

type Props = {
  pieces: PieceRenderObject;
  pieceType: string;
  size: number;
  square?: string;
  style?: StyleProp<ViewStyle>;
};

/** Renders one piece at `size`. Positioning is the caller's job. */
export const Piece = memo(function Piece({
  pieces,
  pieceType,
  size,
  square,
  style,
}: Props) {
  const render = pieces[pieceType];
  if (!render) return null;
  return (
    <View
      testID={`piece-${pieceType}${square ? `-${square}` : ''}`}
      style={[{ width: size, height: size }, style]}
    >
      {render({ size, square })}
    </View>
  );
});
