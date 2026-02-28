import React, { useContext, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { Pressable, View } from "react-native";
import { useChessboard } from "../context/chessboard-context";
import { BoardOrientation, Coords, Piece, Square as Sq } from "../types";
import { ChessboardDnDContext } from "./DnDRoot";

type SquareProps = {
  children: ReactNode;
  setSquares: React.Dispatch<React.SetStateAction<{ [square in Sq]?: Coords }>>;
  square: Sq;
  squareColor: "white" | "black";
  squareHasPremove: boolean;
};

export function Square({
  square,
  squareColor,
  setSquares,
  squareHasPremove,
  children,
}: SquareProps) {
  const squareRef = useRef<View>(null);
  const {
    autoPromoteToQueen,
    boardWidth,
    boardOrientation,
    clearArrows,
    currentPosition,
    customBoardStyle,
    customDarkSquareStyle,
    customDropSquareStyle,
    customLightSquareStyle,
    customPremoveDarkSquareStyle,
    customPremoveLightSquareStyle,
    customSquare: CustomSquare,
    customSquareStyles,
    handleSetPosition,
    handleSparePieceDrop,
    onPromotionCheck,
    onSquareClick,
    onPieceDrop,
    setPromoteFromSquare,
    setPromoteToSquare,
    setShowPromoteDialog,
    whiteKingInCheck,
    blackKingInCheck,
  } = useChessboard();

  const { dragState, dropState, clearDropState } = useContext(ChessboardDnDContext);
  // Check if this square is the active droppable (handle both string and object comparisons)
  const isOver = dragState.droppableActiveId === square || 
                 dragState.droppableActiveId?.toString() === square ||
                 (typeof dragState.droppableActiveId === 'string' && dragState.droppableActiveId === square);

  const defaultSquareStyle = {
    ...borderRadius(square, boardOrientation, customBoardStyle),
    ...(squareColor === "black" ? customDarkSquareStyle : customLightSquareStyle),
    ...(squareHasPremove &&
      (squareColor === "black"
        ? customPremoveDarkSquareStyle
        : customPremoveLightSquareStyle)),
    ...(isOver ? customDropSquareStyle : {}),
  };

  const squareStyle = !squareHasPremove && customSquareStyles?.[square];
  const isGradient = squareStyle && 'isGradient' in squareStyle;

  const lastProcessedDrop = useRef<string | null>(null);
  
  useEffect(() => {    
    if (dropState.droppedId && dropState.droppedTargetSquare === square) {
      const sourceSquare = dropState.droppedId?.toString().split("-")[0];
      const droppedPiece = dropState.droppedId?.toString().split("-")[1];
      const dropKey = `${dropState.droppedId}-${dropState.droppedTargetSquare}`;

      // Only process if this is a new drop (not already processed)
      if (sourceSquare && droppedPiece && lastProcessedDrop.current !== dropKey) {
        lastProcessedDrop.current = dropKey;
        
        // Clear drop state immediately to prevent re-processing
        clearDropState();
        
        // Process the drop
        handleSetPosition(sourceSquare as Sq, square, droppedPiece as Piece, true);
        
        // Reset the processed drop ref after a delay
        setTimeout(() => {
          if (lastProcessedDrop.current === dropKey) {
            lastProcessedDrop.current = null;
          }
        }, 100);
      }
    }
    // Only depend on the actual drop state values, not the function
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dropState.droppedId, dropState.droppedTargetSquare, square, clearDropState]);

  const piece = currentPosition[square]

  return (
      <Pressable
        ref={squareRef}
        onLayout={() => {
          squareRef.current?.measure((x, y, width, height, pageX, pageY) => {
            setSquares((oldSquares) => ({
              ...oldSquares,
              [square]: { x: pageX, y: pageY },
            }));
          });
        }}
        style={[
          defaultSquareStyle as import('react-native').ViewStyle,
          {
            width: boardWidth / 8,
            height: boardWidth / 8,
            justifyContent: "center",
            alignItems: "center",
            zIndex: isOver ? 2 : 1,
          },
        ]}
        onPress={() => {
          onSquareClick(square, piece);
          clearArrows();
        }}
      >
        <View
          style={{
            width: boardWidth / 8,
            height: boardWidth / 8,
            justifyContent: "center",
            alignItems: "center",
            ...(squareStyle && !isGradient && squareStyle),
            // Only highlight king in check, not during premoves
            ...(!squareHasPremove && whiteKingInCheck && piece === 'wK' && { backgroundColor: 'rgba(255, 0, 0, 0.6)' }),
            ...(!squareHasPremove && blackKingInCheck && piece === 'bK' && { backgroundColor: 'rgba(255, 0, 0, 0.6)' }),
          }}
        >
          {isGradient ? (
            <View
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.1)',
                borderRadius: (squareStyle as any)?.borderRadius || 0,
                ...((squareStyle as any)?.gradientType === 'capture'
                  ? { transform: [{ scale: 0.4 }] }
                  : { transform: [{ scale: 0.3 }] })
              }}
            />
          ) : null}
          {children}
        </View>
      </Pressable>
    
  );
}

// Helper functions
const borderRadius = (
  square: Sq,
  boardOrientation: BoardOrientation,
  customBoardStyle?: Record<string, string | number>
) => {
  if (!customBoardStyle?.borderRadius) return {};

  if (square === "a1") {
    return boardOrientation === "white"
      ? { borderBottomLeftRadius: customBoardStyle.borderRadius }
      : { borderTopRightRadius: customBoardStyle.borderRadius };
  }
  if (square === "a8") {
    return boardOrientation === "white"
      ? { borderTopLeftRadius: customBoardStyle.borderRadius }
      : { borderBottomRightRadius: customBoardStyle.borderRadius };
  }
  if (square === "h1") {
    return boardOrientation === "white"
      ? { borderBottomRightRadius: customBoardStyle.borderRadius }
      : { borderTopLeftRadius: customBoardStyle.borderRadius };
  }
  if (square === "h8") {
    return boardOrientation === "white"
      ? { borderTopRightRadius: customBoardStyle.borderRadius }
      : { borderBottomLeftRadius: customBoardStyle.borderRadius };
  }
  return {};
};
