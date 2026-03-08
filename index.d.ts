export type ClearPremoves = {
  clearPremoves: (clearLastPieceColour?: boolean) => void;
};

export type Square =
  | 'a8'
  | 'b8'
  | 'c8'
  | 'd8'
  | 'e8'
  | 'f8'
  | 'g8'
  | 'h8'
  | 'a7'
  | 'b7'
  | 'c7'
  | 'd7'
  | 'e7'
  | 'f7'
  | 'g7'
  | 'h7'
  | 'a6'
  | 'b6'
  | 'c6'
  | 'd6'
  | 'e6'
  | 'f6'
  | 'g6'
  | 'h6'
  | 'a5'
  | 'b5'
  | 'c5'
  | 'd5'
  | 'e5'
  | 'f5'
  | 'g5'
  | 'h5'
  | 'a4'
  | 'b4'
  | 'c4'
  | 'd4'
  | 'e4'
  | 'f4'
  | 'g4'
  | 'h4'
  | 'a3'
  | 'b3'
  | 'c3'
  | 'd3'
  | 'e3'
  | 'f3'
  | 'g3'
  | 'h3'
  | 'a2'
  | 'b2'
  | 'c2'
  | 'd2'
  | 'e2'
  | 'f2'
  | 'g2'
  | 'h2'
  | 'a1'
  | 'b1'
  | 'c1'
  | 'd1'
  | 'e1'
  | 'f1'
  | 'g1'
  | 'h1';

export type Piece = string;

export interface ChessBoardProps {
  position?: string;
  onPieceDrop: (
    sourceSquare: Square,
    targetSquare: Square,
    piece: Piece
  ) => boolean;
  size?: { width: number; height: number };
  onPress?: () => void;
  onPromotionCheck?: (
    sourceSquare: Square,
    targetSquare: Square,
    piece: Piece
  ) => boolean;
  onSquareClick?: (square: Square) => boolean;
  isDraggablePiece?: (args: { piece: Piece }) => boolean;
  customDarkSquareStyle?: Record<string, string | number>;
  customLightSquareStyle?: Record<string, string | number>;
  customSquareStyles?: Record<string, Record<string, string | number>>;
  customBoardStyle?: Record<string, string | number>;
  boardOrientation?: 'black' | 'white';
  arePremovesAllowed?: boolean;
  whiteKingInCheck?: boolean;
  blackKingInCheck?: boolean;
}

/** Uses consumer's React types via reference so JSX is valid (e.g. React 19). */
/// <reference types="react" />
declare const Chessboard: React.ForwardRefExoticComponent<
  ChessBoardProps & React.RefAttributes<ClearPremoves>
>;
export default Chessboard;
