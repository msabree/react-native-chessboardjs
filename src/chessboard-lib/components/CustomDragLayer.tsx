import React from "react";
import { View } from "react-native";

export type CustomDragLayerProps = {
  boardContainer: { left: number; top: number };
};

export function CustomDragLayer({ boardContainer }: CustomDragLayerProps) {
  return <View />;
}
