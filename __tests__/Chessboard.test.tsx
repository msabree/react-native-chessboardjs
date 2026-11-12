import React from 'react';
import renderer, { act } from 'react-test-renderer';
import type { ReactTestInstance, ReactTestRenderer } from 'react-test-renderer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Chessboard, ChessboardProvider } from '../src';
import type { ChessboardOptions } from '../src';

const flat = (s: unknown): Record<string, unknown> =>
  Array.isArray(s)
    ? Object.assign({}, ...s.flat(Infinity as 1).filter(Boolean))
    : ((s as Record<string, unknown>) ?? {});

let mounted: ReactTestRenderer[] = [];
afterEach(() => {
  act(() => mounted.forEach((m) => m.unmount()));
  mounted = [];
});

function render(options: ChessboardOptions): ReactTestRenderer {
  let r!: ReactTestRenderer;
  act(() => {
    r = renderer.create(
      <GestureHandlerRootView>
        <Chessboard options={{ boardWidth: 320, ...options }} />
      </GestureHandlerRootView>
    );
  });
  mounted.push(r);
  return r;
}

const byPrefix = (r: ReactTestRenderer, prefix: string): ReactTestInstance[] =>
  r.root.findAll(
    (n) =>
      typeof n.type === 'string' &&
      String(n.props.testID ?? '').startsWith(prefix)
  );

const byId = (r: ReactTestRenderer, id: string): ReactTestInstance =>
  r.root.find((n) => typeof n.type === 'string' && n.props.testID === id);

describe('Chessboard render', () => {
  it('renders 64 squares and 32 pieces for the start position', () => {
    const r = render({});
    expect(byPrefix(r, 'square-')).toHaveLength(64);
    expect(byPrefix(r, 'piece-')).toHaveLength(32);
  });

  it('places pieces by square in white orientation', () => {
    const r = render({});
    expect(flat(byId(r, 'piece-wK-e1').props.style)).toMatchObject({
      left: 160,
      top: 280,
      width: 40,
    });
    expect(flat(byId(r, 'piece-bR-a8').props.style)).toMatchObject({
      left: 0,
      top: 0,
    });
  });

  it('flips for black orientation', () => {
    const r = render({ boardOrientation: 'black' });
    expect(flat(byId(r, 'piece-bR-a8').props.style)).toMatchObject({
      left: 280,
      top: 280,
    });
    expect(flat(byId(r, 'piece-wR-h1').props.style)).toMatchObject({
      left: 0,
      top: 0,
    });
  });

  it('accepts a FEN and a position object', () => {
    expect(
      byPrefix(render({ position: '8/8/8/8/4P3/8/8/8 w - - 0 1' }), 'piece-')
    ).toHaveLength(1);
    const r = render({ position: { d4: { pieceType: 'wQ' } } });
    expect(flat(byId(r, 'piece-wQ-d4').props.style)).toMatchObject({
      left: 120,
      top: 160,
    });
  });

  it('applies light, dark and per square styles', () => {
    const r = render({
      lightSquareStyle: { backgroundColor: 'L' },
      darkSquareStyle: { backgroundColor: 'D' },
      squareStyles: { e4: { backgroundColor: 'X' } },
    });
    expect(flat(byId(r, 'square-a8').props.style).backgroundColor).toBe('L');
    expect(flat(byId(r, 'square-a1').props.style).backgroundColor).toBe('D');
    expect(flat(byId(r, 'square-e4').props.style).backgroundColor).toBe('X');
  });

  it('shows notation on the edge squares only', () => {
    const r = render({});
    const texts = r.root
      .findAll((n) => n.type === ('Text' as unknown))
      .map((t) => t.props.children);
    expect(texts).toHaveLength(16);
    expect(texts).toEqual(expect.arrayContaining(['1', '8', 'a', 'h']));
    expect(
      render({ showNotation: false }).root.findAll(
        (n) => n.type === ('Text' as unknown)
      )
    ).toHaveLength(0);
  });

  it('supports non 8x8 boards', () => {
    const r = render({ chessboardRows: 4, chessboardColumns: 4, position: {} });
    expect(byPrefix(r, 'square-')).toHaveLength(16);
    expect(flat(byId(r, 'board-chessboard').props.style)).toMatchObject({
      width: 320,
      height: 320,
    });
  });

  it('squareRenderer wraps square content', () => {
    const seen: string[] = [];
    render({
      squareRenderer: ({ square, children }) => {
        seen.push(square);
        return <>{children}</>;
      },
    });
    expect(new Set(seen).size).toBe(64);
  });

  it('works inside a ChessboardProvider', () => {
    let r!: ReactTestRenderer;
    act(() => {
      r = renderer.create(
        <GestureHandlerRootView>
          <ChessboardProvider
            options={{ boardWidth: 320, position: { e4: { pieceType: 'wP' } } }}
          >
            <Chessboard />
          </ChessboardProvider>
        </GestureHandlerRootView>
      );
    });
    mounted.push(r);
    expect(byPrefix(r, 'piece-')).toHaveLength(1);
  });

  it('waits for layout when boardWidth is not given', () => {
    let r!: ReactTestRenderer;
    act(() => {
      r = renderer.create(
        <GestureHandlerRootView>
          <Chessboard />
        </GestureHandlerRootView>
      );
    });
    mounted.push(r);
    expect(byPrefix(r, 'square-')).toHaveLength(0);
    const outer = byId(r, 'chessboard-container');
    act(() =>
      outer.props.onLayout({ nativeEvent: { layout: { width: 200 } } })
    );
    expect(byPrefix(r, 'square-')).toHaveLength(64);
  });
});
