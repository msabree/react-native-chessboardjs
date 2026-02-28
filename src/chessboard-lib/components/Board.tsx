import React, { useEffect, useRef } from "react";
import { Pressable, View } from "react-native";
import type { ViewStyle } from "react-native";
import { useChessboard } from "../context/chessboard-context";
import { Arrows } from "./Arrows";
import { WhiteKing } from "./ErrorBoundary";
import { PromotionDialog } from "./PromotionDialog";
import { Squares } from "./Squares";

export function Board() {
  const boardRef = useRef<View>(null);

  const {
    boardWidth,
    onPromotionPieceSelect,
    setShowPromoteDialog,
    showPromoteDialog,
    customBoardStyle,
  } = useChessboard();

  useEffect(() => {
    // No-op in React Native
    return () => {
      // Cleanup not needed
    };
  }, []);

  return boardWidth ? (
    <View>
      <View
        ref={boardRef}
        style={{
          position: "relative",
          ...boardStyles(boardWidth),
          ...customBoardStyle,
        }}
      >
        <Squares />
        <Arrows />

        {showPromoteDialog && (
          <View>
            <Pressable
              onPress={() => {
                setShowPromoteDialog(false);
                onPromotionPieceSelect?.();
              }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 100,
                backgroundColor: "rgba(22,21,18,.7)",
                width: boardWidth,
                height: boardWidth,
              }}
            />
            <PromotionDialog />
          </View>
        )}
      </View>
    </View>
  ) : (
    <WhiteKing />
  );
}

const boardStyles = (width: number): ViewStyle => ({
  height: width,
  width,
});