import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { TextStyle } from "react-native";
import { COLUMNS } from "../consts";
import { useChessboard } from "../context/chessboard-context";

type NotationProps = {
  row: number;
  col: number;
};

export function Notation({ row, col }: NotationProps) {
  const {
    boardOrientation,
    boardWidth,
    customDarkSquareStyle,
    customLightSquareStyle,
    customNotationStyle,
  } = useChessboard();

  const whiteColor = customLightSquareStyle.backgroundColor;
  const blackColor = customDarkSquareStyle.backgroundColor;

  const isRow = col === 0;
  const isColumn = row === 7;
  const isBottomLeftSquare = isRow && isColumn;

  function getRow() {
    return boardOrientation === "white" ? 8 - row : row + 1;
  }

  function getColumn() {
    return boardOrientation === "black" ? COLUMNS[7 - col] : COLUMNS[col];
  }

  function renderBottomLeft() {
    return (
      <View>
        <Text
          style={[
            styles.baseText,
            {
              color: whiteColor,
            },
            numericStyle(boardWidth, customNotationStyle),
          ]}
        >
          {getRow()}
        </Text>
        <Text
          style={[
            styles.baseText,
            {
              color: whiteColor,
            },
            alphaStyle(boardWidth, customNotationStyle),
          ]}
        >
          {getColumn()}
        </Text>
      </View>
    );
  }

  function renderLetters() {
    return (
      <Text
        style={[
          styles.baseText,
          {
            color: col % 2 !== 0 ? blackColor : whiteColor,
          },
          alphaStyle(boardWidth, customNotationStyle),
        ]}
      >
        {getColumn()}
      </Text>
    );
  }

  function renderNumbers() {
    return (
      <Text
        style={[
          styles.baseText,
          {
            color: boardOrientation === "black"
              ? row % 2 === 0 ? blackColor : whiteColor
              : row % 2 === 0 ? blackColor : whiteColor,
          },
          numericStyle(boardWidth, customNotationStyle),
        ]}
      >
        {getRow()}
      </Text>
    );
  }

  if (isBottomLeftSquare) {
    return renderBottomLeft();
  }

  if (isColumn) {
    return renderLetters();
  }

  if (isRow) {
    return renderNumbers();
  }

  return null;
}

const styles = StyleSheet.create({
  baseText: {
    zIndex: 3,
    position: "absolute",
  },
});

const alphaStyle = (width: number, customNotationStyle?: Record<string, string | number>): TextStyle => ({
  alignSelf: "flex-end",
  paddingLeft: width / 8 - width / 48,
  fontSize: width / 48,
  ...customNotationStyle,
});

const numericStyle = (width: number, customNotationStyle?: Record<string, string | number>): TextStyle => ({
  alignSelf: "flex-start",
  paddingRight: width / 8 - width / 48,
  fontSize: width / 48,
  ...customNotationStyle,
});