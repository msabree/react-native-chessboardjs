import React, { useContext, useEffect } from "react";
import type { ReactNode } from "react";
import { Pressable } from "react-native";
import { G, Svg } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

import { useChessboard } from "../context/chessboard-context";
import { Coords, CustomPieceFn, Piece as Pc, Square } from "../types";
import { ChessboardDnDContext } from "./DnDRoot";

type PieceProps = {
  isPremovedPiece?: boolean;
  piece: Pc;
  square: Square;
  squares: { [square in Square]?: Coords };
};

export function Piece({
  isPremovedPiece = false,
  piece,
  square,
  squares,
}: PieceProps) {
  const {
    animationDuration,
    arePiecesDraggable,
    boardWidth,
    boardOrientation,
    chessPieces,
    currentPosition,
    deletePieceFromSquare,
    dropOffBoardAction,
    id,
    isDraggablePiece,
    isWaitingForAnimation,
    onPieceClick,
    onSquareClick,
    onPieceDragBegin,
    onPieceDragEnd,
    onPieceDropOffBoard,
    onPromotionCheck,
    positionDifferences,
  } = useChessboard();

  const { dragState } = useContext(ChessboardDnDContext);
  
  const dragSquare = dragState.activeId?.toString()?.split('-')[0];
  const dragPiece = dragState.activeId?.toString()?.split('-')[1];
  const isDragging = dragState.isDragging && dragPiece === piece && dragSquare === square;

  // Use Reanimated shared values for smooth animations
  const zIndex = useSharedValue(5);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  // Handle drag lifecycle via state changes
  useEffect(() => {
    if (isDragging) {
      onPieceDragBegin(piece, square);
      zIndex.value = 10; // Highest z-index when dragging
    } else {
      onPieceDragEnd(piece, square);
      zIndex.value = 5;
    }
  }, [isDragging, piece, square, onPieceDragBegin, onPieceDragEnd]);

  // Animate piece movement
  useEffect(() => {
    const removedPiece = positionDifferences.removed?.[square];
    if (!positionDifferences.added || !removedPiece) return;

    const newSquare = (Object.entries(positionDifferences.added) as [Square, Pc][]).find(
      ([s, p]) => p === removedPiece || onPromotionCheck(square, s, removedPiece)
    );

    if (isWaitingForAnimation && newSquare && !isPremovedPiece) {
      const squareWidth = boardWidth / 8;
      const sourceSq = square;
      const targetSq = newSquare[0];

      translateX.value = withSpring(
        (boardOrientation === "black" ? -1 : 1) *
        (targetSq.charCodeAt(0) - sourceSq.charCodeAt(0)) *
        squareWidth,
        { damping: 15, stiffness: 150 }
      );
      translateY.value = withSpring(
        (boardOrientation === "black" ? -1 : 1) *
        (Number(sourceSq[1]) - Number(targetSq[1])) *
        squareWidth,
        { damping: 15, stiffness: 150 }
      );
      zIndex.value = 6;
    }
  }, [positionDifferences, isWaitingForAnimation, isPremovedPiece, boardWidth, boardOrientation, square, onPromotionCheck]);

  // Reset transform
  useEffect(() => {
    if (squares[square]) {
      translateX.value = withSpring(0, { damping: 15, stiffness: 150 });
      translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
    }
  }, [currentPosition, squares, square]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      zIndex: zIndex.value,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={() => {
          onPieceClick(piece, square)
          onSquareClick(square, piece)
        }}
      >
      {typeof chessPieces[piece] === "function" ? (
        (chessPieces[piece] as CustomPieceFn)({
          squareWidth: boardWidth / 8,
          isDragging: dragState.isDragging ?? false,
          square,
        })
      ) : (
        <Svg
          viewBox="0 0 45 45"
          width={boardWidth / 8}
          height={boardWidth / 8}
          style={{ 
            // Improve crispness on high DPI screens
            transform: [{ scale: 1 }],
          }}
          preserveAspectRatio="xMidYMid meet"
        >
          <G>{chessPieces[piece] as ReactNode}</G>
        </Svg>
      )}
      </Pressable>
    </Animated.View>
  );
}
