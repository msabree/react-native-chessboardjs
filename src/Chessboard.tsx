import React from 'react';
import { Board } from './Board';
import {
  ChessboardProvider,
  useHasChessboardProvider,
} from './ChessboardProvider';
import type { ChessboardOptions } from './types';

type ChessboardProps = {
  options?: ChessboardOptions;
};

/**
 * Same contract as react-chessboard v5: pass `options` directly, or wrap in
 * <ChessboardProvider options={...}> (needed for SparePiece) and render
 * <Chessboard /> with no options.
 */
export function Chessboard({ options }: ChessboardProps) {
  const isWrapped = useHasChessboardProvider();
  if (isWrapped) return <Board />;
  return (
    <ChessboardProvider options={options}>
      <Board />
    </ChessboardProvider>
  );
}
