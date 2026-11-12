import { getArrowGeometry } from '../src/arrowGeometry';
import { defaultArrowOptions } from '../src/defaults';

const g = (
  start: string,
  end: string,
  all = [{ startSquare: start, endSquare: end, color: 'x' }]
) =>
  getArrowGeometry(
    { startSquare: start, endSquare: end, color: 'x' },
    all,
    false,
    320,
    8,
    8,
    'white',
    defaultArrowOptions
  );

describe('arrow geometry', () => {
  it('straight arrow starts at the centre and stops short of the target', () => {
    const a = g('e2', 'e4');
    expect(a.points).toHaveLength(2);
    expect(a.points[0]).toEqual({ x: 180, y: 260 });
    // 80px long, reduced by 40/8 = 5
    expect(a.points[1]!.x).toBeCloseTo(180);
    expect(a.points[1]!.y).toBeCloseTo(185);
    expect(a.strokeWidth).toBe(8);
    expect(a.opacity).toBe(0.65);
  });

  it('knight arrow is an L', () => {
    const a = g('g1', 'f3');
    expect(a.points).toHaveLength(3);
    expect(a.points[1]).toEqual({ x: 260, y: 220 }); // corner on g3
  });

  it('head tip points along the shaft', () => {
    const a = g('e2', 'e4');
    const [tip] = a.head;
    expect(tip.x).toBeCloseTo(180);
    expect(tip.y).toBeLessThan(a.points[1]!.y);
  });

  it('arrows sharing a target are shorter', () => {
    const all = [
      { startSquare: 'e2', endSquare: 'e4', color: 'x' },
      { startSquare: 'd3', endSquare: 'e4', color: 'x' },
    ];
    expect(g('e2', 'e4', all).points[1]!.y).toBeCloseTo(190);
  });
});
