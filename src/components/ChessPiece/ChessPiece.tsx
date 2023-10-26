/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  useAnimatedReaction,
  cancelAnimation,
  runOnJS,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import type { FenPosition, Piece, Square } from '../../@types';
import { COLUMN_LENGTH, MARGIN, columns, rows } from '../../constants';
import { getPosition, getSquare, getImage } from '../../utils';

const SIZE = Dimensions.get('window').width / COLUMN_LENGTH - MARGIN;

const ChessPiece = ({
  board,
  boardState,
  row,
  col,
  squareToHighlight,
  setModalVisible,
  value,
  trueIndex,
  onPieceDrop,
  onPromotionCheck,
  onSquareClick,
  isDraggablePiece,
  position,
  isBoardFlipped,
  pieceSelected,
  setPieceSelected,
  lastClickedSquare,
}: ChessSquareProps) => {
  // promotion cache
  const [_color, setColor] = useState('');
  const [_sourceSquare, setSourceSquare] = useState('' as Square);
  const [_targetSquare, setTargetSquare] = useState('' as Square);

  const _isDraggablePiece = useSharedValue(false);
  const _canDropPiece = useSharedValue(false);
  const translateX = useSharedValue(position.x);
  const translateY = useSharedValue(position.y);

  const isDragging = useSharedValue(false);
  const isHovered = useSharedValue(false);

  const isLowerCase = (_value: string) => {
    'worklet';
    return _value === _value.toLowerCase();
  };

  const getPiece = (fenCharacter: string) => {
    'worklet';
    return `${
      isLowerCase(fenCharacter) ? 'b' : 'w'
    }${fenCharacter.toLowerCase()}` as Piece;
  };

  const getSquareName = (square: number) => {
    'worklet';

    const rowIndex = Math.floor(square / COLUMN_LENGTH);
    const colIndex = square % COLUMN_LENGTH;

    if (rowIndex > 7 || colIndex > 7 || rowIndex < 0 || colIndex < 0) {
      // should never happen
      console.log('invalid square');
      return '' as Square;
    }

    return (columns[colIndex as keyof typeof columns] +
      rows[rowIndex as keyof typeof rows]) as Square;
  };

  useAnimatedReaction(
    () => squareToHighlight.value,
    (square, oldSquare) => {
      if (oldSquare === -1) {
        isHovered.value = false;
        return;
      }
      if (square === trueIndex) {
        isHovered.value = true;
      } else {
        isHovered.value = false;
      }
    }
  );

  const onStartCallbackWrapper = (squareName: Square, piece: Piece) => {
    // check if promotion is needed first!
    // once you drop the promoted piece needs to be selected!
    const showModal = onPromotionCheck(
      lastClickedSquare.current.squareName,
      squareName,
      lastClickedSquare.current.piece
    );
    if (showModal) {
      setModalVisible(true);

      // cache promotion info to resuse after modal selection closes
      setColor(piece[0] ?? 'w');
      setSourceSquare(lastClickedSquare.current.squareName);
      setTargetSquare(squareName);
    } else {
      onSquareClick(squareName);
      lastClickedSquare.current = {
        piece,
        squareName,
      };
      _isDraggablePiece.value = isDraggablePiece({ piece });
    }
  };

  const onPieceDropWrapper = (
    startingSquareName: Square,
    squareName: Square,
    piece: Piece
  ) => {
    // check if promotion is needed first!
    // once you drop the promoted piece needs to be selected!
    const showModal = onPromotionCheck(startingSquareName, squareName, piece);
    if (showModal) {
      setModalVisible(true);

      // cache promotion info to resuse after modal selection closes
      setColor(piece[0] ?? 'w');
      setSourceSquare(startingSquareName);
      setTargetSquare(squareName);
    } else {
      setModalVisible(false);
      _canDropPiece.value = onPieceDrop(startingSquareName, squareName, piece);
    }
  };

  useEffect(() => {
    if (_sourceSquare && _targetSquare && _color && pieceSelected) {
      // we're off the animation thread, so no need to runOnJS
      onPieceDrop(
        _sourceSquare,
        _targetSquare,
        `${_color}${pieceSelected}` as Piece
      );

      setPieceSelected('' as 'q' | 'r' | 'n' | 'b');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pieceSelected]);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      translateX.value = position.x;
      translateY.value = position.y;

      const center = {
        x: translateX.value + SIZE / 2,
        y: translateY.value + SIZE / 2,
      };
      const square = getSquare(center.x, center.y, isBoardFlipped);
      const squareName = getSquareName(square);

      const piece = getPiece(boardState[row]?.[col] ?? 'p');

      runOnJS(onStartCallbackWrapper)(squareName, piece);
      isDragging.value = true;
    })
    .onChange((event) => {
      if (_isDraggablePiece.value === false) {
        cancelAnimation(translateX);
        cancelAnimation(translateY);
        return;
      }
      const center = {
        x: translateX.value + SIZE / 2,
        y: translateY.value + SIZE / 2,
      };
      const square = getSquare(center.x, center.y, isBoardFlipped);
      const startingSquare = getSquare(position.x, position.y, isBoardFlipped);
      const startingSquareName = getSquareName(startingSquare);

      if (!startingSquareName) {
        cancelAnimation(translateX);
        cancelAnimation(translateY);
      } else {
        translateX.value = event.absoluteX - 25; // not sure why
        translateY.value = event.absoluteY - 75; // not sure why
        squareToHighlight.value = square;
      }
    })
    .onFinalize(() => {
      translateX.value = withSpring(position.x);
      translateY.value = withSpring(position.y);
      squareToHighlight.value = -1;
      const center = {
        x: translateX.value + SIZE / 2,
        y: translateY.value + SIZE / 2,
      };
      const startingSquare = getSquare(position.x, position.y, isBoardFlipped);
      const startingSquareName = getSquareName(startingSquare);
      const square = getSquare(center.x, center.y, isBoardFlipped);
      const squareName = getSquareName(square);

      if (
        !squareName ||
        !startingSquareName ||
        startingSquareName === squareName
      ) {
        // spring back to starting position
        translateX.value = withSpring(position.x);
        translateY.value = withSpring(position.y);

        isDragging.value = false;
        isHovered.value = false;
        return;
      }

      const piece = getPiece(boardState[row]?.[col] ?? 'p');

      runOnJS(onPieceDropWrapper)(startingSquareName, squareName, piece);

      _canDropPiece.addListener(position.x + position.y, (_value) => {
        if (_value === true) {
          // snap to new position
          translateX.value = withSpring(getPosition(square, isBoardFlipped).x);
          translateY.value = withSpring(getPosition(square, isBoardFlipped).y);

          isDragging.value = false;
          isHovered.value = false;

          trueIndex = square;
        } else {
          // spring back to starting position
          translateX.value = withSpring(position.x);
          translateY.value = withSpring(position.y);

          isDragging.value = false;
          isHovered.value = false;
        }
      });
    });

  const chessPiece = useAnimatedStyle(() => {
    const zIndex = isDragging.value ? 100 : 2;
    const scale = isDragging.value ? 1.2 : 1;
    const borderColor = isHovered.value ? 'white' : 'transparent';
    const borderWidth = isHovered.value ? 2 : 1;

    return {
      position: 'absolute',
      width: SIZE,
      height: SIZE,
      zIndex: zIndex,
      borderColor,
      borderWidth,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale },
      ],
    };
  });
  const chessSquare = useAnimatedStyle(() => {
    const borderColor = isHovered.value ? 'white' : 'transparent';
    const borderWidth = isHovered.value ? 2 : 1;

    return {
      position: 'absolute',
      width: SIZE,
      height: SIZE,
      borderWidth,
      borderColor,
      transform: [{ translateX: position.x }, { translateY: position.y }],
      zIndex: 1,
    };
  });

  return !isNaN(+value) ? (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        key={board[row]?.[col]?.square}
        style={{
          ...chessSquare,
          zIndex: 100,
        }}
      />
    </GestureDetector>
  ) : (
    <GestureDetector gesture={panGesture}>
      <Animated.Image
        source={getImage(boardState[row]?.[col] ?? 'p')}
        style={chessPiece}
      />
    </GestureDetector>
  );
};

export default ChessPiece;

type ChessSquareProps = {
  board: { square: string }[][];
  boardState: FenPosition[][];
  row: number;
  col: number;
  value: string;
  squareToHighlight: SharedValue<number>;
  setModalVisible: (visible: boolean) => void;
  pieceSelected: 'q' | 'r' | 'n' | 'b';
  setPieceSelected: (piece: 'q' | 'r' | 'n' | 'b') => void;
  trueIndex: number;
  onPieceDrop: (
    sourceSquare: Square,
    targetSquare: Square,
    piece: Piece
  ) => boolean;
  onPromotionCheck: (
    sourceSquare: Square,
    targetSquare: Square,
    piece: Piece
  ) => boolean;
  onSquareClick: (square: Square) => boolean;
  isDraggablePiece: ({ piece }: { piece: Piece }) => boolean;
  position: { x: number; y: number };
  isBoardFlipped: boolean;
  lastClickedSquare: { current: { piece: Piece; squareName: Square } };
};
