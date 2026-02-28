import React from "react";
import type { PropsWithChildren } from "react";
import { Text, View } from "react-native";

import { WhiteKing as ErrorImage } from "../media/error";

type ErrorBoundaryProps = PropsWithChildren<unknown>;

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  try {
    return <View>{children}</View>;
  } catch (error) {
    console.log(error);
    return <WhiteKing showError={true} />;
  }
}

export function WhiteKing({ showError = false }) {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <View
        style={{
          width: 250,
          height: 250,
          transform: [{ rotate: "90deg" }],
        }}
      >
        <ErrorImage />
      </View>
      {showError && <Text style={{ fontSize: 24, fontWeight: "bold" }}>Something went wrong</Text>}
    </View>
  );
}