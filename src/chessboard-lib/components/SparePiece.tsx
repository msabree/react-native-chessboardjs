import React from "react";
import type { ReactNode } from "react";
import { useDraggable } from "@mgcrea/react-native-dnd";
import { View } from "react-native";
import { G, Svg } from "react-native-svg";

import { defaultPieces } from "../media/pieces";
import { CustomPieceFn, Piece as Pc } from "../types";

type PieceProps = {
  piece: Pc;
  width: number;
  customPieceJSX?: CustomPieceFn;
  dndId: string;
};

export const SparePiece = ({
  piece,
  width,
  customPieceJSX,
  dndId,
}: PieceProps) => {
  const renderPiece = customPieceJSX ?? defaultPieces[piece];
  
  const dnd = useDraggable({
    id: dndId,
    data: { piece, isSpare: true },
  }) as { state: { value: string }; props: Record<string, unknown> };

  const isDragging = dnd.state.value === 'dragging';

  return (
    <View
      {...dnd.props}
      testID={`piece-${piece}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {typeof renderPiece === "function" ? (
        (renderPiece as CustomPieceFn)({
          squareWidth: width,
          isDragging,
        })
      ) : (
        <Svg viewBox="1 1 43 43" width={width} height={width}>
          <G>{renderPiece as ReactNode}</G>
        </Svg>
      )}
    </View>
  );
};