export type FenPosition =
  | 'P'
  | 'p'
  | 'R'
  | 'r'
  | 'N'
  | 'n'
  | 'B'
  | 'b'
  | 'Q'
  | 'q'
  | 'K'
  | 'k'
  | '8';

export type Piece = {
  color: 'white' | 'black';
  position: FenPosition;
};
