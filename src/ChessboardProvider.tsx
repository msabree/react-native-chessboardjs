import React, { createContext, useContext, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import {
  defaultAlphaNotationStyle,
  defaultArrowOptions,
  defaultDarkSquareNotationStyle,
  defaultDarkSquareStyle,
  defaultDraggingPieceGhostStyle,
  defaultDraggingPieceStyle,
  defaultDropSquareStyle,
  defaultLightSquareNotationStyle,
  defaultLightSquareStyle,
  defaultNumericNotationStyle,
  defaultSquareStyle,
  defaultBoardStyle,
} from './defaults';
import { defaultPieces } from './pieces';
import type {
  ArrowOptions,
  ChessboardOptions,
  PositionDataType,
  SquareDataType,
} from './types';
import { generateBoard, toPositionObject } from './utils';

type Resolved = Required<
  Omit<
    ChessboardOptions,
    | 'boardWidth'
    | 'arrowOptions'
    | 'canDragPiece'
    | 'onArrowsChange'
    | 'onPieceClick'
    | 'onPieceDrag'
    | 'onPieceDragCancel'
    | 'onPieceDrop'
    | 'onSquareClick'
    | 'onSquareLongPress'
    | 'squareRenderer'
    | 'position'
  >
> &
  Pick<
    ChessboardOptions,
    | 'canDragPiece'
    | 'onArrowsChange'
    | 'onPieceClick'
    | 'onPieceDrag'
    | 'onPieceDragCancel'
    | 'onPieceDrop'
    | 'onSquareClick'
    | 'onSquareLongPress'
    | 'squareRenderer'
  > & { arrowOptions: ArrowOptions };

export type ChessboardContextType = Resolved & {
  board: SquareDataType[][];
  currentPosition: PositionDataType;
  /** Board width in px, 0 until known. */
  boardWidth: number;
  squareWidth: number;
  setMeasuredWidth: (w: number) => void;
  isWrapped: boolean;
};

const ChessboardContext = createContext<ChessboardContextType | null>(null);

export function useChessboardContext(): ChessboardContextType {
  const ctx = useContext(ChessboardContext);
  if (!ctx) {
    throw new Error(
      'useChessboardContext must be used inside <ChessboardProvider>'
    );
  }
  return ctx;
}

/** Internal: true when a provider exists above. */
export function useHasChessboardProvider(): boolean {
  return useContext(ChessboardContext) !== null;
}

export function ChessboardProvider({
  children,
  options = {},
}: PropsWithChildren<{ options?: ChessboardOptions }>) {
  const {
    id = 'chessboard',
    pieces = defaultPieces,
    position = 'start',
    boardOrientation = 'white',
    chessboardRows = 8,
    chessboardColumns = 8,
    boardWidth: fixedWidth,

    boardStyle = defaultBoardStyle,
    squareStyle = defaultSquareStyle,
    squareStyles = {},
    darkSquareStyle = defaultDarkSquareStyle,
    lightSquareStyle = defaultLightSquareStyle,
    dropSquareStyle = defaultDropSquareStyle,
    draggingPieceStyle = defaultDraggingPieceStyle,
    draggingPieceGhostStyle = defaultDraggingPieceGhostStyle,
    darkSquareNotationStyle = defaultDarkSquareNotationStyle,
    lightSquareNotationStyle = defaultLightSquareNotationStyle,
    alphaNotationStyle = defaultAlphaNotationStyle,
    numericNotationStyle = defaultNumericNotationStyle,
    showNotation = true,

    animationDurationInMs = 300,
    showAnimations = true,

    allowDragging = true,
    allowDragOffBoard = true,
    dragActivationDistance = 1,

    allowDrawingArrows = true,
    arrows = [],
    arrowOptions,
    clearArrowsOnClick = true,
    clearArrowsOnPositionChange = true,

    ...handlers
  } = options;

  const [measuredWidth, setMeasuredWidth] = useState(0);
  const boardWidth = fixedWidth ?? measuredWidth;

  const board = useMemo(
    () => generateBoard(chessboardRows, chessboardColumns, boardOrientation),
    [chessboardRows, chessboardColumns, boardOrientation]
  );

  const currentPosition = useMemo(
    () => toPositionObject(position, chessboardRows, chessboardColumns),
    [position, chessboardRows, chessboardColumns]
  );

  const value: ChessboardContextType = {
    id,
    pieces,
    boardOrientation,
    chessboardRows,
    chessboardColumns,
    boardStyle,
    squareStyle,
    squareStyles,
    darkSquareStyle,
    lightSquareStyle,
    dropSquareStyle,
    draggingPieceStyle,
    draggingPieceGhostStyle,
    darkSquareNotationStyle,
    lightSquareNotationStyle,
    alphaNotationStyle,
    numericNotationStyle,
    showNotation,
    animationDurationInMs,
    showAnimations,
    allowDragging,
    allowDragOffBoard,
    dragActivationDistance,
    allowDrawingArrows,
    arrows,
    arrowOptions: {
      ...defaultArrowOptions,
      ...arrowOptions,
      colors: { ...defaultArrowOptions.colors, ...arrowOptions?.colors },
    },
    clearArrowsOnClick,
    clearArrowsOnPositionChange,
    ...handlers,
    board,
    currentPosition,
    boardWidth,
    squareWidth: boardWidth / chessboardColumns,
    setMeasuredWidth,
    isWrapped: true,
  };

  return (
    <ChessboardContext.Provider value={value}>
      {children}
    </ChessboardContext.Provider>
  );
}
