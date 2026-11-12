import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useSharedValue } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
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
  Arrow,
  ArrowOptions,
  ChessboardOptions,
  DraggingPieceDataType,
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
  /** Position as displayed, including an accepted drop the parent has not rendered yet. */
  currentPosition: PositionDataType;
  draggingPiece: DraggingPieceDataType | null;
  /** Square under the dragged piece, null when off board. */
  dragOverSquare: string | null;
  /** Finger position while dragging, board local px. UI thread values. */
  dragX: SharedValue<number>;
  dragY: SharedValue<number>;
  /** Internal drag lifecycle, called from the board gesture. */
  dragApi: DragApi;
  /** Arrows drawn by the user (the `arrows` option holds external ones). */
  internalArrows: Arrow[];
  /** Arrow being drawn right now. */
  newArrow: { startSquare: string; overSquare: string | null } | null;
  clearArrows: () => void;
  /** Last accepted drop, so the move is not animated again. Internal. */
  lastDropRef: React.MutableRefObject<{
    source: string;
    target: string;
  } | null>;
  /** Board width in px, 0 until known. */
  boardWidth: number;
  squareWidth: number;
  setMeasuredWidth: (w: number) => void;
  isWrapped: boolean;
};

export type DragApi = {
  start: (square: string) => void;
  over: (square: string | null) => void;
  end: (targetSquare: string | null) => void;
  cancel: () => void;
  tap: (square: string | null) => void;
  arrowStart: (square: string | null) => void;
  arrowOver: (square: string | null) => void;
  arrowEnd: (square: string | null) => void;
  arrowCancel: () => void;
};

type PendingDrop = {
  base: PositionDataType;
  position: PositionDataType;
};

/** Keep an accepted drop on screen until the parent updates `position`. */
const PENDING_DROP_TIMEOUT_MS = 1000;

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
    dragActivationDistance = 5,

    allowDrawingArrows = true,
    arrows = [],
    arrowOptions,
    clearArrowsOnClick = true,
    clearArrowsOnPositionChange = true,

    ...handlers
  } = options;

  const arrowOptionsResolved: ArrowOptions = {
    ...defaultArrowOptions,
    ...arrowOptions,
    colors: { ...defaultArrowOptions.colors, ...arrowOptions?.colors },
  };
  const arrowColorRef = useRef(arrowOptionsResolved.colors.default);
  arrowColorRef.current = arrowOptionsResolved.colors.default;

  const [measuredWidth, setMeasuredWidth] = useState(0);
  const boardWidth = fixedWidth ?? measuredWidth;

  const board = useMemo(
    () => generateBoard(chessboardRows, chessboardColumns, boardOrientation),
    [chessboardRows, chessboardColumns, boardOrientation]
  );

  const positionFromProps = useMemo(
    () => toPositionObject(position, chessboardRows, chessboardColumns),
    [position, chessboardRows, chessboardColumns]
  );

  // drag state: React renders on start, square change and end only
  const [draggingPiece, setDraggingPiece] =
    useState<DraggingPieceDataType | null>(null);
  const [dragOverSquare, setDragOverSquare] = useState<string | null>(null);
  const [pendingDrop, setPendingDrop] = useState<PendingDrop | null>(null);
  const dragX = useSharedValue(0);
  const dragY = useSharedValue(0);

  const currentPosition =
    pendingDrop && pendingDrop.base === positionFromProps
      ? pendingDrop.position
      : positionFromProps;

  // parent rendered a new position (or gave up): drop the optimistic one
  useEffect(() => {
    if (!pendingDrop) return;
    if (pendingDrop.base !== positionFromProps) {
      setPendingDrop(null);
      return;
    }
    const t = setTimeout(() => setPendingDrop(null), PENDING_DROP_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, [pendingDrop, positionFromProps]);

  // latest values for the stable drag api below
  const latest = useRef({
    currentPosition,
    positionFromProps,
    draggingPiece,
    allowDragging,
    canDragPiece: handlers.canDragPiece,
    onPieceDrag: handlers.onPieceDrag,
    onPieceDrop: handlers.onPieceDrop,
    onPieceDragCancel: handlers.onPieceDragCancel,
    onPieceClick: handlers.onPieceClick,
    onSquareClick: handlers.onSquareClick,
    onSquareLongPress: handlers.onSquareLongPress,
    allowDrawingArrows,
    clearArrowsOnClick,
    arrows,
    newArrow: null as { startSquare: string; overSquare: string | null } | null,
  });
  latest.current = {
    ...latest.current,
    currentPosition,
    positionFromProps,
    draggingPiece,
    allowDragging,
    canDragPiece: handlers.canDragPiece,
    onPieceDrag: handlers.onPieceDrag,
    onPieceDrop: handlers.onPieceDrop,
    onPieceDragCancel: handlers.onPieceDragCancel,
    onPieceClick: handlers.onPieceClick,
    onSquareClick: handlers.onSquareClick,
    onSquareLongPress: handlers.onSquareLongPress,
    allowDrawingArrows,
    clearArrowsOnClick,
    arrows,
  };

  const lastDropRef = useRef<{ source: string; target: string } | null>(null);

  const start = useCallback((square: string) => {
    const l = latest.current;
    const piece = l.currentPosition[square];
    if (!l.allowDragging || !piece) return;
    const args = { isSparePiece: false, piece, square };
    if (l.canDragPiece && !l.canDragPiece(args)) return;
    const dragging = {
      isSparePiece: false,
      position: square,
      pieceType: piece.pieceType,
    };
    latest.current.draggingPiece = dragging;
    l.onPieceDrag?.(args);
    setDraggingPiece(dragging);
    setDragOverSquare(square);
  }, []);

  const over = useCallback((square: string | null) => {
    if (!latest.current.draggingPiece) return;
    setDragOverSquare(square);
  }, []);

  const end = useCallback((targetSquare: string | null) => {
    const l = latest.current;
    const dragging = l.draggingPiece;
    if (!dragging) return;
    latest.current.draggingPiece = null;

    const accepted =
      l.onPieceDrop?.({
        piece: dragging,
        sourceSquare: dragging.position,
        targetSquare,
      }) ?? false;

    if (accepted && targetSquare && targetSquare !== dragging.position) {
      lastDropRef.current = { source: dragging.position, target: targetSquare };
      const next = { ...l.currentPosition };
      delete next[dragging.position];
      next[targetSquare] = { pieceType: dragging.pieceType };
      setPendingDrop({ base: l.positionFromProps, position: next });
    }
    setDraggingPiece(null);
    setDragOverSquare(null);
  }, []);

  const cancel = useCallback(() => {
    if (!latest.current.draggingPiece) return;
    latest.current.draggingPiece = null;
    setDraggingPiece(null);
    setDragOverSquare(null);
    latest.current.onPieceDragCancel?.();
  }, []);

  // arrows
  const [internalArrows, setInternalArrows] = useState<Arrow[]>([]);
  const [newArrow, setNewArrowState] = useState<{
    startSquare: string;
    overSquare: string | null;
  } | null>(null);
  const setNewArrow = useCallback(
    (a: { startSquare: string; overSquare: string | null } | null) => {
      latest.current.newArrow = a;
      setNewArrowState(a);
    },
    []
  );

  const clearArrows = useCallback(() => {
    setInternalArrows((prev) => (prev.length ? [] : prev));
    setNewArrow(null);
  }, [setNewArrow]);

  const onArrowsChange = handlers.onArrowsChange;
  const mounted = useRef(false);
  useEffect(() => {
    // v5 also reports on mount
    onArrowsChange?.({ arrows: internalArrows });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internalArrows]);

  useEffect(() => {
    if (mounted.current && clearArrowsOnPositionChange) clearArrows();
    mounted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positionFromProps]);

  const tap = useCallback((square: string | null) => {
    if (!square) return;
    const l = latest.current;
    const piece = l.currentPosition[square] ?? null;
    if (piece) l.onPieceClick?.({ isSparePiece: false, piece, square });
    l.onSquareClick?.({ piece, square });
    if (l.clearArrowsOnClick) {
      setInternalArrows((prev) => (prev.length ? [] : prev));
    }
  }, []);

  const arrowStart = useCallback(
    (square: string | null) => {
      if (!square) return;
      setNewArrow({ startSquare: square, overSquare: square });
    },
    [setNewArrow]
  );

  const arrowOver = useCallback(
    (square: string | null) => {
      const a = latest.current.newArrow;
      if (!a || !latest.current.allowDrawingArrows) return;
      setNewArrow({ ...a, overSquare: square });
    },
    [setNewArrow]
  );

  const arrowEnd = useCallback(
    (square: string | null) => {
      const l = latest.current;
      const a = l.newArrow;
      setNewArrow(null);
      if (!a) return;
      // long press without dragging: the mobile right click
      if (square === a.startSquare) {
        l.onSquareLongPress?.({
          piece: l.currentPosition[a.startSquare] ?? null,
          square: a.startSquare,
        });
        return;
      }
      if (!square || !l.allowDrawingArrows) return;
      const exists = (x: Arrow) =>
        x.startSquare === a.startSquare && x.endSquare === square;
      if (l.arrows.some(exists)) return;
      setInternalArrows((prev) =>
        prev.some(exists)
          ? prev.filter((x) => !exists(x))
          : [
              ...prev,
              {
                startSquare: a.startSquare,
                endSquare: square,
                color: arrowColorRef.current,
              },
            ]
      );
    },
    [setNewArrow]
  );

  const arrowCancel = useCallback(() => setNewArrow(null), [setNewArrow]);

  const dragApi = useMemo<DragApi>(
    () => ({
      start,
      over,
      end,
      cancel,
      tap,
      arrowStart,
      arrowOver,
      arrowEnd,
      arrowCancel,
    }),
    [
      start,
      over,
      end,
      cancel,
      tap,
      arrowStart,
      arrowOver,
      arrowEnd,
      arrowCancel,
    ]
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
    arrowOptions: arrowOptionsResolved,
    clearArrowsOnClick,
    clearArrowsOnPositionChange,
    ...handlers,
    board,
    currentPosition,
    draggingPiece,
    dragOverSquare,
    dragX,
    dragY,
    dragApi,
    internalArrows,
    newArrow,
    clearArrows,
    lastDropRef,
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
