import type { ReactElement, ReactNode } from 'react';
import type { TextStyle, ViewStyle } from 'react-native';

export type BoardOrientation = 'white' | 'black';

export type Arrow = {
  startSquare: string;
  endSquare: string;
  color: string;
};

export type SquareDataType = {
  squareId: string;
  isLightSquare: boolean;
};

export type PieceDataType = {
  pieceType: string;
};

export type DraggingPieceDataType = {
  isSparePiece: boolean;
  position: string;
  pieceType: string;
};

export type PositionDataType = {
  [square: string]: PieceDataType;
};

export type SquareHandlerArgs = {
  piece: PieceDataType | null;
  square: string;
};

export type PieceHandlerArgs = {
  isSparePiece: boolean;
  piece: PieceDataType;
  square: string | null;
};

export type PieceDropHandlerArgs = {
  piece: DraggingPieceDataType;
  sourceSquare: string;
  targetSquare: string | null;
};

export type SquareRenderer = (
  args: SquareHandlerArgs & { children?: ReactNode }
) => ReactElement;

export type PieceRenderProps = {
  fill?: string;
  square?: string;
  /** Rendered size in px (square width). */
  size?: number;
};

export type PieceRenderObject = Record<
  string,
  (props?: PieceRenderProps) => ReactElement
>;

export type FenPieceString =
  | 'p'
  | 'r'
  | 'n'
  | 'b'
  | 'q'
  | 'k'
  | 'P'
  | 'R'
  | 'N'
  | 'B'
  | 'Q'
  | 'K';

export type ArrowOptions = {
  colors: {
    /** Arrow drawn with a plain gesture. */
    default: string;
    /** Reserved for parity with web modifier keys. */
    shift: string;
    ctrl: string;
    alt: string;
    meta: string;
  };
  arrowLengthReducerDenominator: number;
  sameTargetArrowLengthReducerDenominator: number;
  arrowWidthDenominator: number;
  activeArrowWidthMultiplier: number;
  opacity: number;
  activeOpacity: number;
  arrowStartOffset: number;
};

export type ChessboardOptions = {
  id?: string;
  pieces?: PieceRenderObject;
  position?: string | PositionDataType;
  boardOrientation?: BoardOrientation;
  chessboardRows?: number;
  chessboardColumns?: number;
  /** Board width in px. Defaults to the width of the parent layout. */
  boardWidth?: number;

  boardStyle?: ViewStyle;
  squareStyle?: ViewStyle;
  squareStyles?: Record<string, ViewStyle>;
  darkSquareStyle?: ViewStyle;
  lightSquareStyle?: ViewStyle;
  dropSquareStyle?: ViewStyle;
  draggingPieceStyle?: ViewStyle;
  draggingPieceGhostStyle?: ViewStyle;
  darkSquareNotationStyle?: TextStyle;
  lightSquareNotationStyle?: TextStyle;
  alphaNotationStyle?: TextStyle;
  numericNotationStyle?: TextStyle;
  showNotation?: boolean;

  animationDurationInMs?: number;
  showAnimations?: boolean;

  allowDragging?: boolean;
  allowDragOffBoard?: boolean;
  dragActivationDistance?: number;

  allowDrawingArrows?: boolean;
  arrows?: Arrow[];
  arrowOptions?: Partial<ArrowOptions>;
  clearArrowsOnClick?: boolean;
  clearArrowsOnPositionChange?: boolean;

  canDragPiece?: (args: PieceHandlerArgs) => boolean;
  onArrowsChange?: (args: { arrows: Arrow[] }) => void;
  onPieceClick?: (args: PieceHandlerArgs) => void;
  onPieceDrag?: (args: PieceHandlerArgs) => void;
  onPieceDragCancel?: () => void;
  onPieceDrop?: (args: PieceDropHandlerArgs) => boolean;
  onSquareClick?: (args: SquareHandlerArgs) => void;
  /** Mobile equivalent of web right click: long press on a square. */
  onSquareLongPress?: (args: SquareHandlerArgs) => void;
  squareRenderer?: SquareRenderer;
};
