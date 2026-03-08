import React, { forwardRef, useState } from "react";
import { View } from "react-native";
import type { LayoutChangeEvent } from "react-native";

import { Board } from "./components/Board";
import { ChessboardDnDProvider } from "./components/DnDRoot";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ChessboardProvider } from "./context/chessboard-context";
import type { ChessboardProps } from "./types";

export type ClearPremoves = {
  clearPremoves: (clearLastPieceColour?: boolean) => void;
};

export { ChessboardDnDProvider } from "./components/DnDRoot";
export { SparePiece } from "./components/SparePiece";

export const Chessboard = forwardRef<ClearPremoves, ChessboardProps>(
  (props, ref) => {
    const {
      customDndBackend,
      customDndBackendOptions,
      onBoardWidthChange,
      boardWidth: initialBoardWidth,
      ...otherProps
    } = props;

    const [boardWidth, setBoardWidth] = useState<number>(initialBoardWidth ?? 0);
    const handleBoardLayout = (event: LayoutChangeEvent) => {
      const { width } = event.nativeEvent.layout;
      setBoardWidth(width);
      onBoardWidthChange?.(width);
    };

    return (
      <ErrorBoundary>
        <View style={{ flexDirection: "column", width: "100%" }}>
          <View onLayout={handleBoardLayout} style={{ width: "100%" }} />
          
          <ChessboardDnDProvider>
            {boardWidth > 0 && (
              <ChessboardProvider boardWidth={boardWidth} {...otherProps} ref={ref}>
                <Board />
              </ChessboardProvider>
            )}
            </ChessboardDnDProvider>
          
        </View>
      </ErrorBoundary>
    );
  }
);

Chessboard.displayName = "Chessboard";
