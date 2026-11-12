import type { TextStyle, ViewStyle } from 'react-native';
import type { ArrowOptions } from './types';

export const START_FEN =
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export const defaultBoardStyle: ViewStyle = {
  overflow: 'hidden',
  position: 'relative',
};

export const defaultSquareStyle: ViewStyle = {
  justifyContent: 'center',
  alignItems: 'center',
};

export const defaultDarkSquareStyle: ViewStyle = { backgroundColor: '#B58863' };
export const defaultLightSquareStyle: ViewStyle = {
  backgroundColor: '#F0D9B5',
};

export const defaultDropSquareStyle: ViewStyle = {
  borderWidth: 1,
  borderColor: 'black',
};

export const defaultDarkSquareNotationStyle: TextStyle = { color: '#F0D9B5' };
export const defaultLightSquareNotationStyle: TextStyle = { color: '#B58863' };

export const defaultAlphaNotationStyle: TextStyle = {
  fontSize: 11,
  position: 'absolute',
  bottom: 1,
  right: 3,
};

export const defaultNumericNotationStyle: TextStyle = {
  fontSize: 11,
  position: 'absolute',
  top: 1,
  left: 2,
};

export const defaultDraggingPieceStyle: ViewStyle = {
  transform: [{ scale: 1.2 }],
};

export const defaultDraggingPieceGhostStyle: ViewStyle = { opacity: 0.5 };

export const defaultArrowOptions: ArrowOptions = {
  colors: {
    default: '#ffaa00',
    shift: '#4caf50',
    ctrl: '#f44336',
    alt: '#9c27b0',
    meta: '#fbbf24',
  },
  arrowLengthReducerDenominator: 8,
  sameTargetArrowLengthReducerDenominator: 4,
  arrowWidthDenominator: 5,
  activeArrowWidthMultiplier: 0.9,
  opacity: 0.65,
  activeOpacity: 0.5,
  arrowStartOffset: 0,
};
