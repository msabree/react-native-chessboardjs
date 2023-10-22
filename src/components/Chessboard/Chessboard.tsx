/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import ChessPiece from '../ChessPiece/ChessPiece';
import type { FenPosition, Piece, Square } from '../../@types';
import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  COLUMN_LABELS,
  COLUMN_LENGTH,
  MARGIN,
  ROW_LENGTH,
} from '../../constants';
import { fenTo2dArray, getImage, getPosition } from '../../utils';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

interface StylesMap {
  [key: string]: {};
}

const SIZE = Dimensions.get('window').width / COLUMN_LENGTH - MARGIN;

const Chessboard = ({
  position = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
  onPieceDrop,
  onPromotionCheck = () => {
    return false;
  },
  onSquareClick = (_: Square) => {
    return true;
  },
  isDraggablePiece = (_: Square) => {
    return true;
  },
  customDarkSquareStyle = { backgroundColor: 'black' },
  customLightSquareStyle = { backgroundColor: 'white' },
  customSquareStyles = {} as StylesMap,
  boardOrientation = 'white',
}: ChessBoardProps) => {
  const isBoardFlipped = boardOrientation === 'black';
  const drawBoard = () => {
    const board: { square: string }[][] = [];
    for (let i = 0; i < COLUMN_LENGTH; i++) {
      const rows = [];
      for (let j = 0; j < ROW_LENGTH; j++) {
        rows.push({ square: `${COLUMN_LABELS[j]}${8 - i}` });
      }
      board.push(rows);
    }
    return board;
  };
  const [boardUnderlay, setBoardUnderlay] = useState<{ square: string }[][]>(
    drawBoard()
  );
  const [boardOverlay, setBoardOverlay] = useState<FenPosition[][]>(
    fenTo2dArray(position)
  );
  const [isModalVisible, setModalVisible] = useState(false);

  const squareToHighlight = useSharedValue<number>(-1);
  const customSquareStylesString = JSON.stringify(customSquareStyles);

  useEffect(() => {
    setBoardOverlay(fenTo2dArray(position));
    setBoardUnderlay(drawBoard());
  }, [position, isBoardFlipped, customSquareStylesString]);

  return (
    <GestureHandlerRootView>
      {/* Underlay of chessboard */}
      {boardUnderlay.map((row, index) =>
        row.map((square, idx) => {
          const chessPiecePosition = getPosition(
            index * COLUMN_LENGTH + idx,
            isBoardFlipped
          );
          return (
            <View
              key={`${square.square}${isBoardFlipped}`}
              style={{
                ...((idx + index) % 2 === 0
                  ? customLightSquareStyle
                  : customDarkSquareStyle),
                ...styles(idx, index, chessPiecePosition)?.chessSquare,
              }}
            >
              <View
                style={{
                  ...styles(
                    idx,
                    index,
                    getPosition(index * COLUMN_LENGTH + idx, isBoardFlipped)
                  )?.chessSquareOverlay,
                  ...customSquareStyles[square.square],
                }}
              />
            </View>
          );
        })
      )}
      {/* Overlay of chess pieces */}
      {boardOverlay.map((row, index) =>
        row.map((square, idx) => (
          <ChessPiece
            key={`${square}${index}${idx}${isBoardFlipped}`}
            board={boardUnderlay}
            boardState={boardOverlay}
            row={index}
            col={idx}
            squareToHighlight={squareToHighlight}
            setModalVisible={setModalVisible}
            value={square}
            trueIndex={index * COLUMN_LENGTH + idx}
            onPieceDrop={onPieceDrop}
            onPromotionCheck={onPromotionCheck}
            onSquareClick={onSquareClick}
            isDraggablePiece={isDraggablePiece}
            position={getPosition(index * COLUMN_LENGTH + idx, isBoardFlipped)}
            isBoardFlipped={isBoardFlipped}
          />
        ))
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        // onRequestClose={() => {
        //   setModalVisible(false);
        // }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 22,
          }}
        >
          <View
            style={{
              margin: 20,
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 35,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}
          >
            <TouchableOpacity
              onPress={() => {
                'worklet';
                setModalVisible(false);
              }}
            >
              <Image source={getImage('q')} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <Image source={getImage('r')} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <Image source={getImage('b')} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <Image source={getImage('n')} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </GestureHandlerRootView>
  );
};

export default Chessboard;

const styles = (_: number, __: number, position: { x: number; y: number }) =>
  StyleSheet?.create?.({
    chessSquare: {
      position: 'absolute',
      width: SIZE,
      height: SIZE,
      margin: MARGIN * 2,
      transform: [{ translateX: position.x }, { translateY: position.y }],
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    chessSquareOverlay: {
      position: 'relative',
      width: SIZE,
      height: SIZE,
      margin: MARGIN * 2,
    },
  });

type ChessBoardProps = {
  position?: string;
  onPieceDrop: (sourceSquare: Square, targetSquare: Square) => boolean;
  onPromotionCheck?: (
    sourceSquare: Square,
    targetSquare: Square,
    piece: Piece
  ) => boolean;
  onSquareClick: (square: Square) => boolean;
  isDraggablePiece: (square: Square) => boolean;
  customDarkSquareStyle?: object;
  customLightSquareStyle?: object;
  customSquareStyles?: StylesMap;
  customBoardStyle?: object;
  boardOrientation?: 'black' | 'white';
};
