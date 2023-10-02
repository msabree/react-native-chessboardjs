import type { FenPosition } from '../@types';

// write a function to convert fen string to 2d array
export const fenTo2dArray = (fen: string): FenPosition[][] => {
  const fenArray = fen.split(' ');
  const fenBoard = fenArray[0]?.split('/');
  const _board: FenPosition[][] = [];
  for (let i = 0; i < (fenBoard?.length ?? 0); i++) {
    const rows: FenPosition[] = [];
    for (let j = 0; j < (fenBoard?.[i]?.length ?? 0); j++) {
      if (isNaN(parseInt(fenBoard?.[i]?.[j] ?? '0', 10))) {
        rows.push(fenBoard?.[i]?.[j] as FenPosition);
      } else {
        for (let k = 0; k < parseInt(fenBoard?.[i]?.[j] ?? '0', 10); k++) {
          rows.push('8');
        }
      }
    }
    _board.push(rows);
  }
  return _board as FenPosition[][];
};
