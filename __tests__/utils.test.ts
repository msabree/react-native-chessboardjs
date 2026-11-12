import {
  chessColumnToColumnIndex,
  chessRowToRowIndex,
  columnIndexToChessColumn,
  fenStringToPositionObject,
  generateBoard,
  getPositionUpdates,
  getPromotionUpdates,
  getRelativeCoords,
  getSquareOrigin,
  pointToSquare,
  rowIndexToChessRow,
  toPositionObject,
} from '../src/utils';
import type { PositionDataType } from '../src/types';

const START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const p = (o: Record<string, string>): PositionDataType =>
  Object.fromEntries(Object.entries(o).map(([k, v]) => [k, { pieceType: v }]));

describe('index conversions', () => {
  it('round trips every square in both orientations', () => {
    for (const o of ['white', 'black'] as const) {
      for (let i = 0; i < 8; i++) {
        expect(
          chessColumnToColumnIndex(columnIndexToChessColumn(i, 8, o), 8, o)
        ).toBe(i);
        expect(chessRowToRowIndex(rowIndexToChessRow(i, 8, o), 8, o)).toBe(i);
      }
    }
  });
});

describe('generateBoard', () => {
  it('white orientation: a8 top left, h1 bottom right, a8 light', () => {
    const b = generateBoard(8, 8, 'white');
    expect(b[0]![0]).toEqual({ squareId: 'a8', isLightSquare: true });
    expect(b[7]![7]).toEqual({ squareId: 'h1', isLightSquare: true });
    expect(b[7]![0]!.squareId).toBe('a1');
    expect(b[7]![0]!.isLightSquare).toBe(false);
  });
  it('black orientation: h1 top left', () => {
    const b = generateBoard(8, 8, 'black');
    expect(b[0]![0]!.squareId).toBe('h1');
    expect(b[7]![7]!.squareId).toBe('a8');
  });
  it('supports non 8x8 boards', () => {
    const b = generateBoard(10, 6, 'white');
    expect(b.length).toBe(10);
    expect(b[0]!.length).toBe(6);
    expect(b[0]![0]!.squareId).toBe('a10');
    expect(b[9]![5]!.squareId).toBe('f1');
  });
});

describe('FEN parsing', () => {
  it('parses start position', () => {
    const pos = fenStringToPositionObject(START, 8, 8);
    expect(Object.keys(pos)).toHaveLength(32);
    expect(pos.e1).toEqual({ pieceType: 'wK' });
    expect(pos.d8).toEqual({ pieceType: 'bQ' });
    expect(pos.a2).toEqual({ pieceType: 'wP' });
    expect(pos.e4).toBeUndefined();
  });
  it('handles empty squares mid rank', () => {
    const pos = fenStringToPositionObject('8/8/8/3k4/8/8/8/4K3', 8, 8);
    expect(pos).toEqual(p({ d5: 'bK', e1: 'wK' }));
  });
  it('handles multi digit empties on wide boards', () => {
    const pos = fenStringToPositionObject('10K', 1, 11);
    expect(pos).toEqual(p({ k1: 'wK' }));
  });
  it('toPositionObject accepts start, fen, object, undefined', () => {
    expect(Object.keys(toPositionObject('start', 8, 8))).toHaveLength(32);
    expect(toPositionObject(undefined, 8, 8)).toEqual({});
    const obj = p({ e4: 'wP' });
    expect(toPositionObject(obj, 8, 8)).toBe(obj);
  });
});

describe('getPositionUpdates', () => {
  it('single move', () => {
    expect(getPositionUpdates(p({ e2: 'wP' }), p({ e4: 'wP' }))).toEqual({
      e2: 'e4',
    });
  });
  it('capture', () => {
    expect(
      getPositionUpdates(p({ e4: 'wP', d5: 'bP' }), p({ d5: 'wP' }))
    ).toEqual({ e4: 'd5' });
  });
  it('picks the knight that can reach the square', () => {
    const before = p({ b1: 'wN', g1: 'wN' });
    const after = p({ b1: 'wN', f3: 'wN' });
    expect(getPositionUpdates(before, after)).toEqual({ g1: 'f3' });
  });
  it('disambiguates two knights both leaving', () => {
    const before = p({ b1: 'wN', g1: 'wN' });
    const after = p({ c3: 'wN', f3: 'wN' });
    expect(getPositionUpdates(before, after)).toEqual({ b1: 'c3', g1: 'f3' });
  });
  it('castling moves king and rook', () => {
    const before = p({ e1: 'wK', h1: 'wR', a1: 'wR' });
    const after = p({ g1: 'wK', f1: 'wR', a1: 'wR' });
    expect(getPositionUpdates(before, after)).toEqual({ e1: 'g1', h1: 'f1' });
  });
  it('never assigns one source to two targets', () => {
    const before = p({ a1: 'wR' });
    const after = p({ a5: 'wR', h1: 'wR' });
    const u = getPositionUpdates(before, after);
    expect(Object.keys(u)).toEqual(['a1']);
  });
  it('no change', () => {
    const pos = fenStringToPositionObject(START, 8, 8);
    expect(getPositionUpdates(pos, pos)).toEqual({});
  });
});

describe('getPromotionUpdates', () => {
  it('white promotion', () => {
    expect(getPromotionUpdates(p({ e7: 'wP' }), p({ e8: 'wQ' }), 8)).toEqual({
      e7: 'e8',
    });
  });
  it('white capture promotion', () => {
    expect(
      getPromotionUpdates(p({ e7: 'wP', d8: 'bR' }), p({ d8: 'wN' }), 8)
    ).toEqual({ e7: 'd8' });
  });
  it('black promotion', () => {
    expect(getPromotionUpdates(p({ a2: 'bP' }), p({ a1: 'bQ' }), 8)).toEqual({
      a2: 'a1',
    });
  });
  it('promotion reversal (takeback)', () => {
    expect(getPromotionUpdates(p({ e8: 'wQ' }), p({ e7: 'wP' }), 8)).toEqual({
      e8: 'e7',
    });
  });
  it('ignores non promotions', () => {
    expect(getPromotionUpdates(p({ e6: 'wP' }), p({ e8: 'wQ' }), 8)).toEqual(
      {}
    );
    expect(getPromotionUpdates(p({ a7: 'wP' }), p({ c8: 'wQ' }), 8)).toEqual(
      {}
    );
  });
});

describe('geometry', () => {
  const sq = 40;
  it('square origin in both orientations', () => {
    expect(getSquareOrigin('a8', sq, 8, 8, 'white')).toEqual({ x: 0, y: 0 });
    expect(getSquareOrigin('h1', sq, 8, 8, 'white')).toEqual({
      x: 280,
      y: 280,
    });
    expect(getSquareOrigin('a8', sq, 8, 8, 'black')).toEqual({
      x: 280,
      y: 280,
    });
    expect(getSquareOrigin('e4', sq, 8, 8, 'white')).toEqual({
      x: 160,
      y: 160,
    });
  });
  it('relative coords are square centres', () => {
    expect(getRelativeCoords('white', 320, 8, 8, 'a8')).toEqual({
      x: 20,
      y: 20,
    });
    expect(getRelativeCoords('black', 320, 8, 8, 'h1')).toEqual({
      x: 20,
      y: 20,
    });
  });
  it('pointToSquare inverts getSquareOrigin for every square', () => {
    for (const o of ['white', 'black'] as const) {
      for (const row of generateBoard(8, 8, o)) {
        for (const { squareId } of row) {
          const { x, y } = getSquareOrigin(squareId, sq, 8, 8, o);
          expect(pointToSquare(x + 1, y + 1, sq, 8, 8, o)).toBe(squareId);
          expect(pointToSquare(x + sq - 1, y + sq - 1, sq, 8, 8, o)).toBe(
            squareId
          );
        }
      }
    }
  });
  it('pointToSquare returns null off board', () => {
    expect(pointToSquare(-1, 10, sq, 8, 8, 'white')).toBeNull();
    expect(pointToSquare(10, 320, sq, 8, 8, 'white')).toBeNull();
    expect(pointToSquare(10, 10, 0, 8, 8, 'white')).toBeNull();
  });
});
