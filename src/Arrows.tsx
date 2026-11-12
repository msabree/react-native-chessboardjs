import React from 'react';
import { StyleSheet, View } from 'react-native';
import { G, Polygon, Polyline, Svg } from 'react-native-svg';
import { getArrowGeometry } from './arrowGeometry';
import { useChessboardContext } from './ChessboardProvider';
import type { Arrow } from './types';

export function Arrows() {
  const {
    id,
    arrows,
    internalArrows,
    newArrow,
    arrowOptions,
    boardWidth,
    chessboardColumns,
    chessboardRows,
    boardOrientation,
  } = useChessboardContext();

  const active: Arrow | null =
    newArrow &&
    newArrow.overSquare &&
    newArrow.overSquare !== newArrow.startSquare
      ? {
          startSquare: newArrow.startSquare,
          endSquare: newArrow.overSquare,
          color: arrowOptions.colors.default,
        }
      : null;
  const all = active
    ? [...arrows, ...internalArrows, active]
    : [...arrows, ...internalArrows];
  if (!all.length || !boardWidth) return null;

  const height = (boardWidth / chessboardColumns) * chessboardRows;

  return (
    <View
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
      testID={`${id}-arrows`}
    >
      <Svg width={boardWidth} height={height}>
        {all.map((arrow, i) => {
          const isActive = active !== null && i === all.length - 1;
          const g = getArrowGeometry(
            arrow,
            all,
            isActive,
            boardWidth,
            chessboardColumns,
            chessboardRows,
            boardOrientation,
            arrowOptions
          );
          return (
            <G
              key={`${arrow.startSquare}-${arrow.endSquare}${isActive ? '-active' : ''}`}
              opacity={g.opacity}
            >
              <Polyline
                testID={`${id}-arrow-${arrow.startSquare}-${arrow.endSquare}`}
                points={g.points.map((p) => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke={arrow.color}
                strokeWidth={g.strokeWidth}
                strokeLinejoin="round"
              />
              <Polygon
                points={g.head.map((p) => `${p.x},${p.y}`).join(' ')}
                fill={arrow.color}
              />
            </G>
          );
        })}
      </Svg>
    </View>
  );
}
