import React, { memo, useLayoutEffect, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useChessboardContext } from './ChessboardProvider';
import { Piece } from './Piece';
import type { PieceRenderObject, PositionDataType } from './types';
import {
  getPositionUpdates,
  getPromotionUpdates,
  getSquareOrigin,
} from './utils';

type Offset = { dx: number; dy: number } | null;

/**
 * All pieces are siblings in one absolute layer above the squares, so a
 * raised piece can paint over the whole board.
 *
 * Moves animate by rendering the new position straight away and sliding each
 * moved piece in from its old square on the UI thread.
 */
export function PieceLayer() {
  const {
    currentPosition,
    pieces,
    squareWidth,
    chessboardRows,
    chessboardColumns,
    boardOrientation,
    draggingPiece,
    draggingPieceGhostStyle,
    showAnimations,
    animationDurationInMs,
    lastDropRef,
  } = useChessboardContext();

  const prev = useRef<PositionDataType>(currentPosition);
  const version = useRef(0);

  // target square -> where it slid in from (px offset), for this position
  const offsets = useMemo(() => {
    const from = prev.current;
    prev.current = currentPosition;
    version.current += 1;
    if (!showAnimations || from === currentPosition || !squareWidth) {
      return {} as Record<string, Offset>;
    }
    const updates = {
      ...getPositionUpdates(from, currentPosition),
      ...getPromotionUpdates(from, currentPosition, chessboardRows),
    };
    // the user already dragged this piece there
    const drop = lastDropRef.current;
    if (drop && updates[drop.source] === drop.target) {
      delete updates[drop.source];
      lastDropRef.current = null;
    }
    const out: Record<string, Offset> = {};
    for (const [source, target] of Object.entries(updates)) {
      const a = getSquareOrigin(
        source,
        squareWidth,
        chessboardRows,
        chessboardColumns,
        boardOrientation
      );
      const b = getSquareOrigin(
        target,
        squareWidth,
        chessboardRows,
        chessboardColumns,
        boardOrientation
      );
      out[target] = { dx: a.x - b.x, dy: a.y - b.y };
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPosition]);

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
          <AnimatedPiece
            key={square}
            pieces={pieces}
            pieceType={pieceType}
            square={square}
            size={squareWidth}
            left={x}
            top={y}
            from={offsets[square] ?? null}
            version={version.current}
            duration={animationDurationInMs}
            style={
              !draggingPiece?.isSparePiece && draggingPiece?.position === square
                ? draggingPieceGhostStyle
                : undefined
            }
          />
        );
      })}
    </View>
  );
}

type AnimatedPieceProps = {
  pieces: PieceRenderObject;
  pieceType: string;
  square: string;
  size: number;
  left: number;
  top: number;
  from: Offset;
  version: number;
  duration: number;
  style?: StyleProp<ViewStyle>;
};

const AnimatedPiece = memo(function AnimatedPiece({
  pieces,
  pieceType,
  square,
  size,
  left,
  top,
  from,
  version,
  duration,
  style,
}: AnimatedPieceProps) {
  const tx = useSharedValue(from?.dx ?? 0);
  const ty = useSharedValue(from?.dy ?? 0);

  useLayoutEffect(() => {
    if (!from) return;
    tx.value = from.dx;
    ty.value = from.dy;
    tx.value = withTiming(0, { duration });
    ty.value = withTiming(0, { duration });
    // run once per position change that moved this piece
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { translateY: ty.value }],
  }));

  return (
    <Animated.View
      testID={`slot-${square}`}
      style={[
        { position: 'absolute', left, top, zIndex: from ? 1 : 0 },
        animatedStyle,
      ]}
    >
      <Piece
        pieces={pieces}
        pieceType={pieceType}
        square={square}
        size={size}
        style={style}
      />
    </Animated.View>
  );
});
