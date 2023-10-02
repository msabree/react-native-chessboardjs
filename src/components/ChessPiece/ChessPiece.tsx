import React from 'react';
import {Dimensions} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedReaction,
  SharedValue,
  cancelAnimation,
} from 'react-native-reanimated';
import {FenPosition, Square} from '../../@types';
import {COLUMN_LENGTH, MARGIN, columns, rows} from '../../constants';
import {getPosition, getSquare, getImage} from '../../utils';

const SIZE = Dimensions.get('window').width / COLUMN_LENGTH - MARGIN;

const ChessPiece = ({
  board,
  boardState,
  row,
  col,
  squareToHighlight,
  value,
  trueIndex,
  onPieceDrop,
  onSquareClick,
  position,
}: ChessSquareProps) => {
  console.log(position.x);
  const translateX = useSharedValue(position.x);
  const translateY = useSharedValue(position.y);

  const isDragging = useSharedValue(false);
  const isHovered = useSharedValue(false);

  const getSquareName = (square: number) => {
    'worklet';

    const rowIndex = Math.floor(square / COLUMN_LENGTH);
    const colIndex = square % COLUMN_LENGTH;

    if (rowIndex > 7 || colIndex > 7 || rowIndex < 0 || colIndex < 0) {
      return '';
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
    },
  );

  useAnimatedReaction(
    () => trueIndex,
    (index, oldIndex) => {
      console.log(index, oldIndex);
    },
  );

  const panGesture = useAnimatedGestureHandler({
    onStart: (_event, ctx) => {
      const center = {
        x: translateX.value + SIZE / 2,
        y: translateY.value + SIZE / 2,
      };
      const square = getSquare(center.x, center.y);
      const squareName = getSquareName(square);

      if (!squareName || onSquareClick(squareName) === false) {
        console.log('first');
        cancelAnimation(translateX);
        cancelAnimation(translateY);
      } else {
        ctx.startX = translateX.value;
        ctx.startY = translateY.value;
        isDragging.value = true;
      }
    },
    onActive: (event, ctx) => {
      const center = {
        x: translateX.value + SIZE / 2,
        y: translateY.value + SIZE / 2,
      };
      const square = getSquare(center.x, center.y);
      // const squareName = getSquareName(square);
      //@ts-ignore
      const startingSquare = getSquare(ctx.startX, ctx.startY);
      const startingSquareName = getSquareName(startingSquare);

      if (!startingSquareName || onSquareClick(startingSquareName) === false) {
        cancelAnimation(translateX);
        cancelAnimation(translateY);
      } else {
        translateX.value = ctx.startX + event.translationX;
        translateY.value = ctx.startY + event.translationY;

        squareToHighlight.value = square;
      }
    },
    onFinish: (event, ctx) => {
      squareToHighlight.value = -1;
      const center = {
        x: translateX.value + SIZE / 2,
        y: translateY.value + SIZE / 2,
      };
      //@ts-ignore
      const startingSquare = getSquare(ctx.startX, ctx.startY);
      const startingSquareName = getSquareName(startingSquare);
      const square = getSquare(center.x, center.y);
      const squareName = getSquareName(square);

      if (!squareName || !startingSquareName) {
        // spring back to starting position
        translateX.value = withSpring(position.x);
        translateY.value = withSpring(position.y);

        isDragging.value = false;
        isHovered.value = false;
        return;
      }

      console.log('TF', startingSquareName, squareName);
      if (onPieceDrop(startingSquareName, squareName)) {
        // snap to new position
        translateX.value = withSpring(getPosition(square).x);
        translateY.value = withSpring(getPosition(square).y);

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
    },
  });

  const chessPiece = useAnimatedStyle(() => {
    const zIndex = isDragging.value ? 100 : 2;
    const scale = isDragging.value ? 1.2 : 1;
    const backgroundColor = isHovered.value ? 'green' : 'transparent';

    return {
      position: 'absolute',
      width: SIZE,
      height: SIZE,
      zIndex: zIndex,
      backgroundColor,
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
        {scale},
      ],
    };
  });
  const chessSquare = useAnimatedStyle(() => {
    // const borderColor = isDragging.value ? 'red' : 'black';
    const backgroundColor = isHovered.value ? 'green' : 'transparent';

    return {
      position: 'absolute',
      // margin: MARGIN * 2,
      // borderWidth: 1,
      // borderColor,
      width: SIZE,
      height: SIZE,
      backgroundColor,
      transform: [{translateX: position.x}, {translateY: position.y}],
      zIndex: 1,
    };
  });

  return !isNaN(+value) ? (
    isHovered ? (
      <Animated.View key={board[row][col].square} style={chessSquare} />
    ) : (
      <></>
    )
  ) : (
    <PanGestureHandler onGestureEvent={panGesture}>
      <Animated.Image
        source={getImage(boardState[row][col])}
        style={chessPiece}
      />
    </PanGestureHandler>
  );
};

export default ChessPiece;

type ChessSquareProps = {
  board: {square: string}[][];
  boardState: FenPosition[][];
  row: number;
  col: number;
  value: string;
  squareToHighlight: SharedValue<number>;
  trueIndex: number;
  onPieceDrop: (sourceSquare: Square, targetSquare: Square) => boolean;
  onSquareClick: (square: Square) => boolean;
  position: {x: number; y: number};
};
