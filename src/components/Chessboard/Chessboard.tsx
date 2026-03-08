import React, { forwardRef } from 'react';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import { Chessboard as LibChessboard } from '../../chessboard-lib';
import type { ClearPremoves } from '../../chessboard-lib';
import type { Piece as LibPiece } from '../../chessboard-lib/types';
import type { Piece, Square } from '../../@types';

/** @deprecated Use board width / 8. Exported for backward compatibility. */
export const SIZE = Dimensions.get('window').width / 8;

export type { ClearPremoves };

/** Convert lib piece (wK, bP) to legacy format (wk, bp) */
function pieceLibToLegacy(p: LibPiece): Piece {
  const letter = p[1];
  return (p[0] + (letter ? letter.toLowerCase() : '')) as Piece;
}

interface StylesMap {
  [key: string]: Record<string, string | number>;
}

export type ChessBoardProps = {
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
  isDraggablePiece?: ({ piece }: { piece: Piece }) => boolean;
  customDarkSquareStyle?: Record<string, string | number>;
  customLightSquareStyle?: Record<string, string | number>;
  customSquareStyles?: StylesMap;
  customBoardStyle?: Record<string, string | number>;
  boardOrientation?: 'black' | 'white';
  arePremovesAllowed?: boolean;
  whiteKingInCheck?: boolean;
  blackKingInCheck?: boolean;
};

const Chessboard = forwardRef<ClearPremoves, ChessBoardProps>(
  (
    {
      position = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
      onPieceDrop,
      size,
      onPress,
      onPromotionCheck = () => false,
      onSquareClick = () => true,
      isDraggablePiece = () => true,
      customDarkSquareStyle = { backgroundColor: 'black' },
      customLightSquareStyle = { backgroundColor: 'white' },
      customSquareStyles = {},
      customBoardStyle,
      boardOrientation = 'white',
      arePremovesAllowed = false,
      whiteKingInCheck = false,
      blackKingInCheck = false,
    },
    ref
  ) => {
    const boardWidth = size?.width ?? Dimensions.get('window').width;

    const boardElement = (
      <LibChessboard
        ref={ref}
        position={
          position === 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'
            ? 'start'
            : position
        }
        boardWidth={boardWidth}
        boardOrientation={boardOrientation}
        customDarkSquareStyle={customDarkSquareStyle as Record<string, string>}
        customLightSquareStyle={
          customLightSquareStyle as Record<string, string>
        }
        customSquareStyles={customSquareStyles}
        customBoardStyle={customBoardStyle}
        arePremovesAllowed={arePremovesAllowed}
        whiteKingInCheck={whiteKingInCheck}
        blackKingInCheck={blackKingInCheck}
        onPieceDrop={(sourceSquare, targetSquare, piece) =>
          onPieceDrop(
            sourceSquare as Square,
            targetSquare as Square,
            pieceLibToLegacy(piece)
          )
        }
        onPromotionCheck={(sourceSquare, targetSquare, piece) =>
          onPromotionCheck(
            sourceSquare as Square,
            targetSquare as Square,
            pieceLibToLegacy(piece)
          )
        }
        onSquareClick={(square) => onSquareClick(square as Square)}
        isDraggablePiece={({ piece }) =>
          isDraggablePiece({ piece: pieceLibToLegacy(piece) })
        }
        onPromotionPieceSelect={(piece, promoteFromSquare, promoteToSquare) => {
          if (promoteFromSquare && promoteToSquare && piece) {
            const ok = onPieceDrop(
              promoteFromSquare as Square,
              promoteToSquare as Square,
              pieceLibToLegacy(piece)
            );
            return ok;
          }
          return true;
        }}
        showPromotionDialog={true}
      />
    );

    const content = (
      <View style={boardWidth > 0 ? { width: boardWidth } : undefined}>
        {boardElement}
      </View>
    );

    if (onPress) {
      return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.2}>
          {content}
        </TouchableOpacity>
      );
    }

    return content;
  }
);

Chessboard.displayName = 'Chessboard';

export default Chessboard;
