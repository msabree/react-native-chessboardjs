import React, { useRef } from "react";
import type { ReactNode } from "react";
import { Animated, Pressable } from "react-native";
import { G, Svg } from "react-native-svg";

import { useChessboard } from "../context/chessboard-context";
import { CustomPieceFn, PromotionPieceOption } from "../types";

type Props = {
  option: PromotionPieceOption;
};

export function PromotionOption({ option }: Props) {
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0.67)).current; // 0.67 is approximately 'aa' in hex

  const {
    boardWidth,
    chessPieces,
    customDarkSquareStyle,
    customLightSquareStyle,
    handleSetPosition,
    onPromotionPieceSelect,
    promoteFromSquare,
    promoteToSquare,
    promotionDialogVariant,
  } = useChessboard();

  const backgroundColor = (): string | undefined => {
    switch (option[1]) {
      case "Q":
        return customDarkSquareStyle.backgroundColor;
      case "R":
        return customLightSquareStyle.backgroundColor;
      case "N":
        return promotionDialogVariant === "default"
          ? customLightSquareStyle.backgroundColor
          : customDarkSquareStyle.backgroundColor;
      case "B":
        return promotionDialogVariant === "default"
          ? customDarkSquareStyle.backgroundColor
          : customLightSquareStyle.backgroundColor;
      default:
        return undefined;
    }
  };

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.67,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Pressable
      onPress={() => {
        if (
          onPromotionPieceSelect(
            option,
            promoteFromSquare ?? undefined,
            promoteToSquare ?? undefined
          )
        )
          handleSetPosition(promoteFromSquare!, promoteToSquare!, option, true);
      }}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      testID={`piece-${option}`}
    >
      <Animated.View
        style={{
          backgroundColor: backgroundColor(),
          borderRadius: 4,
          opacity: opacityAnim,
        }}
      >
        {typeof chessPieces[option] === "function" ? (
          <Animated.View
            style={{
              transform: [{ scale: scaleAnim }],
            }}
          >
            {(chessPieces[option] as CustomPieceFn)({
              squareWidth: boardWidth / 8,
              isDragging: false,
            })}
          </Animated.View>
        ) : (
          <Animated.View
            style={{
              transform: [{ scale: scaleAnim }],
            }}
          >
            <Svg viewBox={"1 1 43 43"} width={boardWidth / 8} height={boardWidth / 8}>
              <G>{chessPieces[option] as ReactNode}</G>
            </Svg>
          </Animated.View>
        )}
      </Animated.View>
    </Pressable>
  );
}