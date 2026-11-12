import { useEffect } from 'react';
import {
  useCompetingGestures,
  usePanGesture,
  useTapGesture,
} from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { useChessboardContext } from './ChessboardProvider';
import { pointToSquare } from './utils';

/**
 * One pan gesture for the whole board. Hit testing is math on board local
 * coordinates, the finger position lives in shared values, and JS is only
 * called when the drag starts, the hovered square changes, or the drag ends.
 */
export function useBoardGesture() {
  const {
    id,
    allowDragging,
    allowDragOffBoard,
    dragActivationDistance,
    squareWidth,
    chessboardRows,
    chessboardColumns,
    boardOrientation,
    dragX,
    dragY,
    dragApi,
    allowDrawingArrows,
    onSquareLongPress,
  } = useChessboardContext();

  // geometry mirrored into a shared value so worklets always see the latest
  const geom = useSharedValue({
    sq: squareWidth,
    rows: chessboardRows,
    cols: chessboardColumns,
    orientation: boardOrientation,
    clamp: !allowDragOffBoard,
  });
  useEffect(() => {
    geom.value = {
      sq: squareWidth,
      rows: chessboardRows,
      cols: chessboardColumns,
      orientation: boardOrientation,
      clamp: !allowDragOffBoard,
    };
  }, [
    geom,
    squareWidth,
    chessboardRows,
    chessboardColumns,
    boardOrientation,
    allowDragOffBoard,
  ]);

  const startSquare = useSharedValue<string | null>(null);
  const overSquare = useSharedValue<string | null>(null);
  const active = useSharedValue(false);

  const {
    start,
    over,
    end,
    cancel,
    tap,
    arrowStart,
    arrowOver,
    arrowEnd,
    arrowCancel,
  } = dragApi;

  const piecePan = usePanGesture({
    testID: `${id}-pan`,
    enabled: allowDragging,
    minDistance: dragActivationDistance,
    maxPointers: 1,
    onBegin: (e) => {
      'worklet';
      const g = geom.value;
      startSquare.value = pointToSquare(
        e.x,
        e.y,
        g.sq,
        g.rows,
        g.cols,
        g.orientation
      );
    },
    onActivate: (e) => {
      'worklet';
      const sq = startSquare.value;
      if (!sq) return;
      const g = geom.value;
      active.value = true;
      dragX.value = g.clamp ? clamp(e.x, 0, g.sq * g.cols - 1) : e.x;
      dragY.value = g.clamp ? clamp(e.y, 0, g.sq * g.rows - 1) : e.y;
      overSquare.value = sq;
      scheduleOnRN(start, sq);
    },
    onUpdate: (e) => {
      'worklet';
      if (!active.value) return;
      const g = geom.value;
      const x = g.clamp ? clamp(e.x, 0, g.sq * g.cols - 1) : e.x;
      const y = g.clamp ? clamp(e.y, 0, g.sq * g.rows - 1) : e.y;
      dragX.value = x;
      dragY.value = y;
      const sq = pointToSquare(x, y, g.sq, g.rows, g.cols, g.orientation);
      if (sq !== overSquare.value) {
        overSquare.value = sq;
        scheduleOnRN(over, sq);
      }
    },
    onDeactivate: (e) => {
      'worklet';
      if (!active.value) return;
      active.value = false;
      if (e.canceled) {
        scheduleOnRN(cancel);
        return;
      }
      const g = geom.value;
      const x = g.clamp ? clamp(e.x, 0, g.sq * g.cols - 1) : e.x;
      const y = g.clamp ? clamp(e.y, 0, g.sq * g.rows - 1) : e.y;
      scheduleOnRN(
        end,
        pointToSquare(x, y, g.sq, g.rows, g.cols, g.orientation)
      );
    },
  });

  const tapGesture = useTapGesture({
    testID: `${id}-tap`,
    maxDistance: 10,
    onActivate: (e) => {
      'worklet';
      const g = geom.value;
      scheduleOnRN(
        tap,
        pointToSquare(e.x, e.y, g.sq, g.rows, g.cols, g.orientation)
      );
    },
  });

  // long press, then drag to draw an arrow (web: right click drag).
  // long press without moving is the mobile right click.
  const arrowSquare = useSharedValue<string | null>(null);
  const arrowActive = useSharedValue(false);
  const arrowPan = usePanGesture({
    testID: `${id}-arrow`,
    enabled: allowDrawingArrows || onSquareLongPress !== undefined,
    activateAfterLongPress: LONG_PRESS_MS,
    maxPointers: 1,
    onBegin: (e) => {
      'worklet';
      const g = geom.value;
      arrowSquare.value = pointToSquare(
        e.x,
        e.y,
        g.sq,
        g.rows,
        g.cols,
        g.orientation
      );
    },
    onActivate: () => {
      'worklet';
      if (!arrowSquare.value) return;
      arrowActive.value = true;
      scheduleOnRN(arrowStart, arrowSquare.value);
    },
    onUpdate: (e) => {
      'worklet';
      if (!arrowActive.value) return;
      const g = geom.value;
      const sq = pointToSquare(e.x, e.y, g.sq, g.rows, g.cols, g.orientation);
      if (sq !== arrowSquare.value) {
        arrowSquare.value = sq;
        scheduleOnRN(arrowOver, sq);
      }
    },
    onDeactivate: (e) => {
      'worklet';
      if (!arrowActive.value) return;
      arrowActive.value = false;
      if (e.canceled) {
        scheduleOnRN(arrowCancel);
        return;
      }
      const g = geom.value;
      scheduleOnRN(
        arrowEnd,
        pointToSquare(e.x, e.y, g.sq, g.rows, g.cols, g.orientation)
      );
    },
  });

  // first gesture to activate wins: move = piece drag, quick release = tap,
  // hold still = long press / arrow
  return useCompetingGestures(piecePan, arrowPan, tapGesture);
}

const LONG_PRESS_MS = 400;

function clamp(v: number, min: number, max: number): number {
  'worklet';
  return Math.min(Math.max(v, min), max);
}
