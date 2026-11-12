/**
 * Pure board utilities. API mirrors react-chessboard v5 utils (MIT) so web and
 * native code can share logic. Functions marked 'worklet' are safe to call on
 * the Reanimated UI thread.
 */
import type {
  BoardOrientation,
  FenPieceString,
  PositionDataType,
  SquareDataType,
} from './types';

const A = 97; // 'a'

export function rowIndexToChessRow(
  row: number,
  noOfRows: number,
  boardOrientation: BoardOrientation
): string {
  'worklet';
  return boardOrientation === 'white'
    ? (noOfRows - row).toString()
    : (row + 1).toString();
}

export function columnIndexToChessColumn(
  column: number,
  noOfColumns: number,
  boardOrientation: BoardOrientation
): string {
  'worklet';
  return boardOrientation === 'white'
    ? String.fromCharCode(A + column)
    : String.fromCharCode(A + noOfColumns - column - 1);
}

export function chessColumnToColumnIndex(
  column: string,
  noOfColumns: number,
  boardOrientation: BoardOrientation
): number {
  'worklet';
  return boardOrientation === 'white'
    ? column.charCodeAt(0) - A
    : noOfColumns - (column.charCodeAt(0) - A) - 1;
}

export function chessRowToRowIndex(
  row: string,
  noOfRows: number,
  boardOrientation: BoardOrientation
): number {
  'worklet';
  return boardOrientation === 'white'
    ? noOfRows - Number(row)
    : Number(row) - 1;
}

/** Split "e4" / "b10" into file and rank. */
export function parseSquare(square: string): { file: string; rank: string } {
  'worklet';
  return { file: square.charAt(0), rank: square.slice(1) };
}

export function generateBoard(
  noOfRows: number,
  noOfColumns: number,
  boardOrientation: BoardOrientation
): SquareDataType[][] {
  const board: SquareDataType[][] = [];
  for (let row = 0; row < noOfRows; row++) {
    const r: SquareDataType[] = [];
    for (let column = 0; column < noOfColumns; column++) {
      r.push({
        squareId: `${columnIndexToChessColumn(column, noOfColumns, boardOrientation)}${rowIndexToChessRow(row, noOfRows, boardOrientation)}`,
        isLightSquare: (row + column) % 2 === 0,
      });
    }
    board.push(r);
  }
  return board;
}

/** Convert fen piece code (p, N) to piece type (bP, wN). */
export function fenToPieceCode(piece: FenPieceString | string): string {
  return piece.toLowerCase() === piece
    ? 'b' + piece.toUpperCase()
    : 'w' + piece.toUpperCase();
}

export function fenStringToPositionObject(
  fen: string,
  noOfRows: number,
  noOfColumns: number
): PositionDataType {
  const position: PositionDataType = {};
  const rows = (fen.trim().split(' ')[0] ?? '').split('/');
  for (let row = 0; row < rows.length; row++) {
    let column = 0;
    // digits may be multi character on large boards (e.g. "10")
    const tokens = rows[row]!.match(/\d+|[a-zA-Z]/g) ?? [];
    for (const token of tokens) {
      if (/\d/.test(token)) {
        column += Number(token);
        continue;
      }
      const square = `${columnIndexToChessColumn(column, noOfColumns, 'white')}${rowIndexToChessRow(row, noOfRows, 'white')}`;
      position[square] = { pieceType: fenToPieceCode(token) };
      column++;
    }
  }
  return position;
}

/** Normalise the `position` option into a position object. */
export function toPositionObject(
  position: string | PositionDataType | undefined,
  noOfRows: number,
  noOfColumns: number
): PositionDataType {
  if (!position) return {};
  if (typeof position === 'string') {
    return position === 'start'
      ? fenStringToPositionObject(
          'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
          noOfRows,
          noOfColumns
        )
      : fenStringToPositionObject(position, noOfRows, noOfColumns);
  }
  return position;
}

function fileIndex(square: string): number {
  return square.charCodeAt(0) - A;
}

function rankNumber(square: string): number {
  return Number(square.slice(1));
}

/**
 * Pieces that moved between two positions, as { sourceSquare: targetSquare }.
 * Used to animate moves. When several identical pieces could have moved, picks
 * the one whose movement is legal-looking for its piece type.
 */
export function getPositionUpdates(
  oldPosition: PositionDataType,
  newPosition: PositionDataType,
  _noOfColumns?: number,
  _boardOrientation?: BoardOrientation
): { [square: string]: string } {
  const updates: { [square: string]: string } = {};

  for (const newSquare in newPosition) {
    const newType = newPosition[newSquare]!.pieceType;
    if (oldPosition[newSquare]?.pieceType === newType) continue;

    const candidates: string[] = [];
    for (const oldSquare in oldPosition) {
      const oldType = oldPosition[oldSquare]!.pieceType;
      if (
        oldType === newType &&
        oldSquare !== newSquare &&
        newPosition[oldSquare]?.pieceType !== oldType &&
        !(oldSquare in updates)
      ) {
        candidates.push(oldSquare);
      }
    }
    if (candidates.length === 0) continue;
    if (candidates.length === 1) {
      updates[candidates[0]!] = newSquare;
      continue;
    }

    const fits = (from: string): boolean => {
      const kind = newType[1];
      const dc = Math.abs(fileIndex(from) - fileIndex(newSquare));
      const dr = Math.abs(rankNumber(from) - rankNumber(newSquare));
      switch (kind) {
        case 'P':
          return dc === 0;
        case 'N':
          return (dc === 2 && dr === 1) || (dc === 1 && dr === 2);
        case 'B':
          return dc === dr;
        case 'R':
          return dc === 0 || dr === 0;
        case 'Q':
          return dc === 0 || dr === 0 || dc === dr;
        case 'K':
          return dc <= 1 && dr <= 1;
        default:
          return false;
      }
    };

    updates[candidates.find(fits) ?? candidates[0]!] = newSquare;
  }

  return updates;
}

/**
 * Changes explained by a pawn promotion (or its reversal, e.g. takeback), as
 * { pawnOrPieceSquare: targetSquare }.
 */
export function getPromotionUpdates(
  oldPosition: PositionDataType,
  newPosition: PositionDataType,
  noOfRows: number,
  _noOfColumns?: number
): { [square: string]: string } {
  const updates: { [square: string]: string } = {};
  const promotable = new Set(['Q', 'R', 'B', 'N']);

  for (const newSquare in newPosition) {
    const newPiece = newPosition[newSquare]!.pieceType;
    if (oldPosition[newSquare]?.pieceType === newPiece) continue;

    for (const oldSquare in oldPosition) {
      const oldPiece = oldPosition[oldSquare]!.pieceType;
      if (newPosition[oldSquare]?.pieceType === oldPiece) continue;
      if (oldPiece[0] !== newPiece[0]) continue;

      let pawnSq: string;
      let promoSq: string;
      if (oldPiece[1] === 'P' && promotable.has(newPiece[1]!)) {
        pawnSq = oldSquare;
        promoSq = newSquare;
      } else if (newPiece[1] === 'P' && promotable.has(oldPiece[1]!)) {
        pawnSq = newSquare;
        promoSq = oldSquare;
      } else {
        continue;
      }

      if (Math.abs(fileIndex(pawnSq) - fileIndex(promoSq)) > 1) continue;

      const pawnRank = rankNumber(pawnSq);
      const promoRank = rankNumber(promoSq);
      const isWhite = oldPiece[0] === 'w';
      const ok = isWhite
        ? pawnRank === noOfRows - 1 && promoRank === noOfRows
        : pawnRank === 2 && promoRank === 1;
      if (ok) updates[oldSquare] = newSquare;
    }
  }

  return updates;
}

/** Top left of a square in board-local px. */
export function getSquareOrigin(
  square: string,
  squareWidth: number,
  noOfRows: number,
  noOfColumns: number,
  boardOrientation: BoardOrientation
): { x: number; y: number } {
  'worklet';
  const col = chessColumnToColumnIndex(
    square.charAt(0),
    noOfColumns,
    boardOrientation
  );
  const row = chessRowToRowIndex(square.slice(1), noOfRows, boardOrientation);
  return { x: col * squareWidth, y: row * squareWidth };
}

/** Centre of a square in board-local px. Matches react-chessboard v5. */
export function getRelativeCoords(
  boardOrientation: BoardOrientation,
  boardWidth: number,
  chessboardColumns: number,
  chessboardRows: number,
  square: string
): { x: number; y: number } {
  'worklet';
  const squareWidth = boardWidth / chessboardColumns;
  const o = getSquareOrigin(
    square,
    squareWidth,
    chessboardRows,
    chessboardColumns,
    boardOrientation
  );
  return { x: o.x + squareWidth / 2, y: o.y + squareWidth / 2 };
}

/**
 * Hit test: which square is under board-local point (x, y)? Null when off board.
 * This replaces view measurement entirely.
 */
export function pointToSquare(
  x: number,
  y: number,
  squareWidth: number,
  noOfRows: number,
  noOfColumns: number,
  boardOrientation: BoardOrientation
): string | null {
  'worklet';
  if (squareWidth <= 0) return null;
  const col = Math.floor(x / squareWidth);
  const row = Math.floor(y / squareWidth);
  if (col < 0 || row < 0 || col >= noOfColumns || row >= noOfRows) return null;
  return (
    columnIndexToChessColumn(col, noOfColumns, boardOrientation) +
    rowIndexToChessRow(row, noOfRows, boardOrientation)
  );
}
