import type { Arrow, ArrowOptions, BoardOrientation } from './types';
import { getRelativeCoords } from './utils';

type Point = { x: number; y: number };

export type ArrowGeometry = {
  /** Polyline points of the shaft (2 for straight, 3 for knight L). */
  points: Point[];
  /** Triangle head, tip first. */
  head: [Point, Point, Point];
  strokeWidth: number;
  opacity: number;
};

/**
 * Same geometry as react-chessboard v5 Arrows, including the knight L shape
 * and shorter arrows when several point at one square. The head is computed
 * here instead of using an SVG marker, which is unreliable on native.
 */
export function getArrowGeometry(
  arrow: Arrow,
  allArrows: Arrow[],
  isActive: boolean,
  boardWidth: number,
  chessboardColumns: number,
  chessboardRows: number,
  boardOrientation: BoardOrientation,
  options: ArrowOptions
): ArrowGeometry {
  const from = getRelativeCoords(
    boardOrientation,
    boardWidth,
    chessboardColumns,
    chessboardRows,
    arrow.startSquare
  );
  const to = getRelativeCoords(
    boardOrientation,
    boardWidth,
    chessboardColumns,
    chessboardRows,
    arrow.endSquare
  );
  const squareWidth = boardWidth / chessboardColumns;

  let reducer = squareWidth / options.arrowLengthReducerDenominator;
  const sharesTarget = allArrows.some(
    (a) =>
      a.startSquare !== arrow.startSquare && a.endSquare === arrow.endSquare
  );
  if (sharesTarget && !isActive) {
    reducer = squareWidth / options.sameTargetArrowLengthReducerDenominator;
  }

  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const r = Math.hypot(dx, dy);
  const startOffset = squareWidth * options.arrowStartOffset;

  let points: Point[];
  const isKnight = Math.abs(r - Math.hypot(1, 2) * squareWidth) < 0.001;
  if (isKnight) {
    const verticalFirst = Math.abs(dx) < Math.abs(dy);
    const start = verticalFirst
      ? { x: from.x, y: from.y + Math.sign(dy) * startOffset }
      : { x: from.x + Math.sign(dx) * startOffset, y: from.y };
    const corner = verticalFirst
      ? { x: from.x, y: to.y }
      : { x: to.x, y: from.y };
    const leg = squareWidth;
    const end = {
      x: corner.x + ((to.x - corner.x) * (leg - reducer)) / leg,
      y: corner.y + ((to.y - corner.y) * (leg - reducer)) / leg,
    };
    points = [start, corner, end];
  } else {
    points = [
      {
        x: from.x + (dx * startOffset) / r,
        y: from.y + (dy * startOffset) / r,
      },
      {
        x: from.x + (dx * (r - reducer)) / r,
        y: from.y + (dy * (r - reducer)) / r,
      },
    ];
  }

  const baseWidth = squareWidth / options.arrowWidthDenominator;
  const strokeWidth = isActive
    ? baseWidth * options.activeArrowWidthMultiplier
    : baseWidth;

  // head in v5 marker units (2 x 2.5, ref 1.25,1.25), scaled by stroke width
  const end = points[points.length - 1]!;
  const prev = points[points.length - 2]!;
  const len = Math.hypot(end.x - prev.x, end.y - prev.y) || 1;
  const u = { x: (end.x - prev.x) / len, y: (end.y - prev.y) / len };
  const n = { x: -u.y, y: u.x };
  const at = (along: number, across: number): Point => ({
    x: end.x + u.x * along * strokeWidth + n.x * across * strokeWidth,
    y: end.y + u.y * along * strokeWidth + n.y * across * strokeWidth,
  });

  return {
    points,
    head: [at(0.75, 0), at(-0.95, -1.25), at(-0.95, 1.25)],
    strokeWidth,
    opacity: isActive ? options.activeOpacity : options.opacity,
  };
}
