import React from 'react';
import renderer, { act } from 'react-test-renderer';
import type { ReactTestInstance, ReactTestRenderer } from 'react-test-renderer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createGestureController } from 'react-native-gesture-handler/jest-utils';
import { Chessboard } from '../src';
import type { ChessboardOptions } from '../src';

const SQ = 40;
const at = (
  file: string,
  rank: number,
  orientation: 'white' | 'black' = 'white'
) => {
  const col = file.charCodeAt(0) - 97;
  const row = 8 - rank;
  return orientation === 'white'
    ? { x: col * SQ + SQ / 2, y: row * SQ + SQ / 2 }
    : { x: (7 - col) * SQ + SQ / 2, y: (7 - row) * SQ + SQ / 2 };
};

let mounted: ReactTestRenderer[] = [];
afterEach(() => {
  act(() => mounted.forEach((m) => m.unmount()));
  mounted = [];
});

function render(options: ChessboardOptions) {
  let r!: ReactTestRenderer;
  const tree = (o: ChessboardOptions) => (
    <GestureHandlerRootView>
      <Chessboard options={{ boardWidth: 320, ...o }} />
    </GestureHandlerRootView>
  );
  act(() => {
    r = renderer.create(tree(options));
  });
  mounted.push(r);
  return { r, update: (o: ChessboardOptions) => act(() => r.update(tree(o))) };
}

const find = (
  r: ReactTestRenderer,
  id: string
): ReactTestInstance | undefined =>
  r.root.findAll((n) => typeof n.type === 'string' && n.props.testID === id)[0];

function tap(p: { x: number; y: number }) {
  const g = createGestureController('chessboard-tap');
  act(() => g.begin(p));
  act(() => g.activate(p));
  act(() => g.end(p));
}

function longPress(from: { x: number; y: number }, to = from) {
  const g = createGestureController('chessboard-arrow');
  act(() => g.begin(from));
  act(() => g.activate(from));
  act(() => g.update(to));
  act(() => g.end(to));
}

describe('taps', () => {
  it('tap on a piece calls onPieceClick then onSquareClick', () => {
    const calls: string[] = [];
    const onPieceClick = jest.fn(() => calls.push('piece'));
    const onSquareClick = jest.fn(() => calls.push('square'));
    render({ onPieceClick, onSquareClick });
    tap(at('g', 1));
    expect(onPieceClick).toHaveBeenCalledWith({
      isSparePiece: false,
      piece: { pieceType: 'wN' },
      square: 'g1',
    });
    expect(onSquareClick).toHaveBeenCalledWith({
      piece: { pieceType: 'wN' },
      square: 'g1',
    });
    expect(calls).toEqual(['piece', 'square']);
  });

  it('tap on an empty square only calls onSquareClick', () => {
    const onPieceClick = jest.fn();
    const onSquareClick = jest.fn();
    render({ onPieceClick, onSquareClick });
    tap(at('e', 4));
    expect(onPieceClick).not.toHaveBeenCalled();
    expect(onSquareClick).toHaveBeenCalledWith({ piece: null, square: 'e4' });
  });

  it('maps taps in black orientation', () => {
    const onSquareClick = jest.fn();
    render({ onSquareClick, boardOrientation: 'black' });
    tap(at('b', 8, 'black'));
    expect(onSquareClick).toHaveBeenCalledWith({
      piece: { pieceType: 'bN' },
      square: 'b8',
    });
  });
});

describe('long press and arrows', () => {
  it('long press without moving calls onSquareLongPress', () => {
    const onSquareLongPress = jest.fn();
    render({ onSquareLongPress });
    longPress(at('e', 2));
    expect(onSquareLongPress).toHaveBeenCalledWith({
      piece: { pieceType: 'wP' },
      square: 'e2',
    });
  });

  it('long press then drag draws an arrow and reports it', () => {
    const onArrowsChange = jest.fn();
    const b = render({ onArrowsChange });
    longPress(at('e', 2), at('e', 4));
    expect(find(b.r, 'chessboard-arrow-e2-e4')).toBeDefined();
    expect(onArrowsChange).toHaveBeenLastCalledWith({
      arrows: [{ startSquare: 'e2', endSquare: 'e4', color: '#ffaa00' }],
    });
  });

  it('drawing the same arrow again removes it', () => {
    const b = render({});
    longPress(at('e', 2), at('e', 4));
    longPress(at('e', 2), at('e', 4));
    expect(find(b.r, 'chessboard-arrow-e2-e4')).toBeUndefined();
  });

  it('uses arrowOptions.colors.default', () => {
    const onArrowsChange = jest.fn();
    render({
      onArrowsChange,
      arrowOptions: { colors: { default: 'red' } as never },
    });
    longPress(at('g', 1), at('f', 3));
    expect(onArrowsChange).toHaveBeenLastCalledWith({
      arrows: [{ startSquare: 'g1', endSquare: 'f3', color: 'red' }],
    });
  });

  it('tap clears drawn arrows unless clearArrowsOnClick is false', () => {
    const b = render({});
    longPress(at('e', 2), at('e', 4));
    tap(at('a', 4));
    expect(find(b.r, 'chessboard-arrow-e2-e4')).toBeUndefined();

    const c = render({ id: 'keep', clearArrowsOnClick: false });
    const g = createGestureController('keep-arrow');
    act(() => g.begin(at('e', 2)));
    act(() => g.activate(at('e', 2)));
    act(() => g.update(at('e', 4)));
    act(() => g.end(at('e', 4)));
    const t = createGestureController('keep-tap');
    act(() => t.begin(at('a', 4)));
    act(() => t.activate(at('a', 4)));
    act(() => t.end(at('a', 4)));
    expect(find(c.r, 'keep-arrow-e2-e4')).toBeDefined();
  });

  it('position change clears drawn arrows', () => {
    const b = render({ position: 'start' });
    longPress(at('e', 2), at('e', 4));
    b.update({ position: '8/8/8/8/4P3/8/8/8' });
    expect(find(b.r, 'chessboard-arrow-e2-e4')).toBeUndefined();
  });

  it('renders external arrows', () => {
    const b = render({
      arrows: [{ startSquare: 'd2', endSquare: 'd4', color: 'blue' }],
    });
    expect(find(b.r, 'chessboard-arrow-d2-d4')).toBeDefined();
  });

  it('allowDrawingArrows false still allows long press', () => {
    const onSquareLongPress = jest.fn();
    const b = render({ allowDrawingArrows: false, onSquareLongPress });
    longPress(at('e', 2), at('e', 4));
    expect(find(b.r, 'chessboard-arrow-e2-e4')).toBeUndefined();
    longPress(at('d', 2));
    expect(onSquareLongPress).toHaveBeenCalledWith({
      piece: { pieceType: 'wP' },
      square: 'd2',
    });
  });
});
