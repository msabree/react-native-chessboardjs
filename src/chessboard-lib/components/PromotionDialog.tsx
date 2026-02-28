import React from "react";
import { View } from "react-native";
import type { ViewStyle } from "react-native";
import { useChessboard } from "../context/chessboard-context";
import { getRelativeCoords } from "../functions";
import { PromotionPieceOption } from "../types";
import { PromotionOption } from "./PromotionOption";

export function PromotionDialog() {
  const {
    boardOrientation,
    boardWidth,
    promotionDialogVariant,
    promoteToSquare,
  } = useChessboard();

  const promotePieceColor = promoteToSquare?.[1] === "1" ? "b" : "w";
  const promotionOptions: PromotionPieceOption[] = [
    `${promotePieceColor ?? "w"}Q`,
    `${promotePieceColor ?? "w"}R`,
    `${promotePieceColor ?? "w"}N`,
    `${promotePieceColor ?? "w"}B`,
  ];

  const dialogStyles: Record<string, ViewStyle> = {
    default: {
      flexDirection: "row",
      flexWrap: "wrap",
      transform: [{ translateX: -boardWidth / 8 }, { translateY: -boardWidth / 8 }],
    },
    vertical: {
      transform: [{ translateX: -boardWidth / 16 }, { translateY: -boardWidth / 16 }],
    },
    modal: {
      justifyContent: "center",
      alignItems: "center",
      transform: [{ translateY: (3 * boardWidth) / 8 }],
      width: "100%",
      height: boardWidth / 4,
      top: 0,
      backgroundColor: "white",
      left: 0,
    },
  };

  const dialogCoords = getRelativeCoords(
    boardOrientation,
    boardWidth,
    promoteToSquare || "a8"
  );

  return (
    <View
      style={[
        {
          position: "absolute",
          top: dialogCoords?.y,
          left: dialogCoords?.x,
          zIndex: 1000,
        },
        dialogStyles[promotionDialogVariant],
      ]}
      testID="promotion-dialog"
    >
      {promotionOptions.map((option) => (
        <PromotionOption key={option} option={option} />
      ))}
    </View>
  );
}