import React, { useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-native-chessboardjs';
import type { BoardOrientation } from 'react-native-chessboardjs';

export default function App() {
  const [game] = useState(() => new Chess());
  const [fen, setFen] = useState(game.fen());
  const [orientation, setOrientation] = useState<BoardOrientation>('white');
  const [notation, setNotation] = useState(true);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaView style={styles.root}>
        <StatusBar style="auto" />
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>react-native-chessboardjs</Text>

          <Chessboard
            options={{
              id: 'example',
              position: fen,
              boardOrientation: orientation,
              showNotation: notation,
              squareStyles: { e4: { backgroundColor: 'rgba(255,255,0,0.4)' } },
              canDragPiece: ({ piece }) => piece.pieceType[0] === game.turn(),
              onPieceDrop: ({ sourceSquare, targetSquare }) => {
                if (!targetSquare) return false;
                try {
                  game.move({
                    from: sourceSquare,
                    to: targetSquare,
                    promotion: 'q',
                  });
                  setFen(game.fen());
                  return true;
                } catch {
                  return false;
                }
              },
            }}
          />

          <View style={styles.row}>
            <Button
              label="Flip"
              onPress={() =>
                setOrientation((o) => (o === 'white' ? 'black' : 'white'))
              }
            />
            <Button label="Notation" onPress={() => setNotation((n) => !n)} />
            <Button
              label="Random move"
              onPress={() => {
                const moves = game.moves();
                if (!moves.length) return;
                game.move(moves[Math.floor(Math.random() * moves.length)]!);
                setFen(game.fen());
              }}
            />
            <Button
              label="Reset"
              onPress={() => {
                game.reset();
                setFen(game.fen());
              }}
            />
          </View>

          <Text style={styles.small}>4x4 board, custom position</Text>
          <View style={{ width: 160 }}>
            <Chessboard
              options={{
                id: 'mini',
                chessboardRows: 4,
                chessboardColumns: 4,
                position: {
                  a4: { pieceType: 'bK' },
                  d1: { pieceType: 'wK' },
                  b2: { pieceType: 'wQ' },
                },
              }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

function Button({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.button}>
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: 16, gap: 16 },
  title: { fontSize: 18, fontWeight: '600' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#222',
    borderRadius: 6,
  },
  buttonText: { color: '#fff' },
  small: { fontSize: 13, opacity: 0.7 },
});
