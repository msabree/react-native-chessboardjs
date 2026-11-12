import React from 'react';
import renderer, { act } from 'react-test-renderer';
import type { ReactTestInstance, ReactTestRenderer } from 'react-test-renderer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createGestureController } from 'react-native-gesture-handler/jest-utils';
import { Chessboard } from '../src';
import type { ChessboardOptions } from '../src';

// 320px board, 40px squares. White orientation: e2 centre (180, 260), e4 (180, 180).
const SQ = 40;
const centre = (
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

const flat = (s: unknown): Record<string, unknown> =>
  Array.isArray(s)
    ? Object.assign({}, ...s.flat(Infinity as 1).filter(Boolean))
    : ((s as Record<string, unknown>) ?? {});

let mounted: ReactTestRenderer[] = [];
afterEach(() => {
  act(() => mounted.forEach((r) => r.unmount()));
  mounted = [];
  jest.useRealTimers();
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
  return {
    r,
    update: (o: ChessboardOptions) => act(() => r.update(tree(o))),
    pan: () => createGestureController(`${options.id ?? 'chessboard'}-pan`),
  };
}

const find = (
  r: ReactTestRenderer,
  id: string
): ReactTestInstance | undefined =>
  r.root.findAll((n) => typeof n.type === 'string' && n.props.testID === id)[0];

function drag(
  pan: ReturnType<ReturnType<typeof render>['pan']>,
  from: { x: number; y: number },
  to: { x: number; y: number },
  finish: 'end' | 'cancel' = 'end'
) {
  act(() => pan.begin(from));
  act(() => pan.activate(from));
  act(() => pan.update(to));
  act(() => pan[finish](to));
}

describe('drag and drop', () => {
  it('calls onPieceDrag and onPieceDrop with v5 shaped args', () => {
    const onPieceDrag = jest.fn();
    const onPieceDrop = jest.fn(() => false);
    const b = render({ onPieceDrag, onPieceDrop });
    drag(b.pan(), centre('e', 2), centre('e', 4));
    expect(onPieceDrag).toHaveBeenCalledWith({
      isSparePiece: false,
      piece: { pieceType: 'wP' },
      square: 'e2',
    });
    expect(onPieceDrop).toHaveBeenCalledWith({
      piece: { isSparePiece: false, position: 'e2', pieceType: 'wP' },
      sourceSquare: 'e2',
      targetSquare: 'e4',
    });
  });

  it('shows the dragged piece, the ghost and the drop square while dragging', () => {
    const b = render({});
    const pan = b.pan();
    act(() => pan.begin(centre('e', 2)));
    act(() => pan.activate(centre('e', 2)));
    act(() => pan.update(centre('e', 4)));

    expect(find(b.r, 'chessboard-dragging-piece')).toBeDefined();
    expect(flat(find(b.r, 'piece-wP-e2')!.props.style).opacity).toBe(0.5);
    expect(flat(find(b.r, 'square-e4')!.props.style)).toMatchObject({
      borderWidth: 1,
    });
    expect(
      flat(find(b.r, 'square-e3')!.props.style).borderWidth
    ).toBeUndefined();

    act(() => pan.end(centre('e', 4)));
    expect(find(b.r, 'chessboard-dragging-piece')).toBeUndefined();
    expect(
      flat(find(b.r, 'square-e4')!.props.style).borderWidth
    ).toBeUndefined();
  });

  it('rejected drop leaves the piece on its square', () => {
    const b = render({ onPieceDrop: () => false });
    drag(b.pan(), centre('e', 2), centre('e', 5));
    expect(find(b.r, 'piece-wP-e2')).toBeDefined();
    expect(find(b.r, 'piece-wP-e5')).toBeUndefined();
  });

  it('accepted drop shows on the target until the parent updates position', () => {
    jest.useFakeTimers();
    const b = render({ onPieceDrop: () => true });
    drag(b.pan(), centre('e', 2), centre('e', 4));
    expect(find(b.r, 'piece-wP-e4')).toBeDefined();
    expect(find(b.r, 'piece-wP-e2')).toBeUndefined();

    // parent never updates: snaps back after the timeout
    act(() => jest.advanceTimersByTime(1000));
    expect(find(b.r, 'piece-wP-e2')).toBeDefined();
  });

  it('parent position update replaces the optimistic drop', () => {
    const b = render({ onPieceDrop: () => true });
    drag(b.pan(), centre('e', 2), centre('e', 4));
    b.update({
      onPieceDrop: () => true,
      position: { d4: { pieceType: 'wP' } },
    });
    expect(find(b.r, 'piece-wP-d4')).toBeDefined();
    expect(find(b.r, 'piece-wP-e4')).toBeUndefined();
  });

  it('drop off the board gives a null target', () => {
    const onPieceDrop = jest.fn(() => false);
    const b = render({ onPieceDrop });
    drag(b.pan(), centre('e', 2), { x: 180, y: 400 });
    expect(onPieceDrop).toHaveBeenCalledWith(
      expect.objectContaining({ targetSquare: null })
    );
  });

  it('allowDragOffBoard false keeps the piece on the board', () => {
    const onPieceDrop = jest.fn(() => false);
    const b = render({ onPieceDrop, allowDragOffBoard: false });
    drag(b.pan(), centre('e', 7), { x: 180, y: -60 });
    expect(onPieceDrop).toHaveBeenCalledWith(
      expect.objectContaining({ targetSquare: 'e8' })
    );
  });

  it('respects canDragPiece', () => {
    const onPieceDrag = jest.fn();
    const onPieceDrop = jest.fn();
    const canDragPiece = jest.fn(({ piece }) => piece.pieceType[0] === 'w');
    const b = render({ onPieceDrag, onPieceDrop, canDragPiece });
    drag(b.pan(), centre('e', 7), centre('e', 5));
    expect(canDragPiece).toHaveBeenCalledWith({
      isSparePiece: false,
      piece: { pieceType: 'bP' },
      square: 'e7',
    });
    expect(onPieceDrag).not.toHaveBeenCalled();
    expect(onPieceDrop).not.toHaveBeenCalled();
    expect(find(b.r, 'chessboard-dragging-piece')).toBeUndefined();
  });

  it('ignores drags that start on an empty square', () => {
    const onPieceDrop = jest.fn();
    const b = render({ onPieceDrop });
    drag(b.pan(), centre('e', 4), centre('e', 5));
    expect(onPieceDrop).not.toHaveBeenCalled();
  });

  it('maps touches correctly in black orientation', () => {
    const onPieceDrop = jest.fn(() => false);
    const b = render({ onPieceDrop, boardOrientation: 'black' });
    drag(b.pan(), centre('g', 8, 'black'), centre('f', 6, 'black'));
    expect(onPieceDrop).toHaveBeenCalledWith(
      expect.objectContaining({ sourceSquare: 'g8', targetSquare: 'f6' })
    );
  });

  it('system cancel calls onPieceDragCancel, not onPieceDrop', () => {
    const onPieceDrop = jest.fn();
    const onPieceDragCancel = jest.fn();
    const b = render({ onPieceDrop, onPieceDragCancel });
    drag(b.pan(), centre('e', 2), centre('e', 4), 'cancel');
    expect(onPieceDragCancel).toHaveBeenCalled();
    expect(onPieceDrop).not.toHaveBeenCalled();
    expect(find(b.r, 'chessboard-dragging-piece')).toBeUndefined();
  });

  it('allowDragging false disables the gesture', () => {
    const onPieceDrag = jest.fn();
    const b = render({ onPieceDrag, allowDragging: false });
    drag(b.pan(), centre('e', 2), centre('e', 4));
    expect(onPieceDrag).not.toHaveBeenCalled();
  });
});
