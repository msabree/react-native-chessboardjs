import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-native-chessboardjs';
import type { Square } from 'chess.js';
import type { BoardOrientation } from 'react-native-chessboardjs';

export default function App() {
  const [game] = useState(() => new Chess());
  const [fen, setFen] = useState(game.fen());
  const [orientation, setOrientation] = useState<BoardOrientation>('white');
  const [notation, setNotation] = useState(true);
  // tap to move: selected square and its legal targets
  const [selected, setSelected] = useState<Square | null>(null);

  const targets = useMemo(
    () =>
      selected
        ? new Set(
            game.moves({ square: selected, verbose: true }).map((m) => m.to)
          )
        : new Set<string>(),
    // fen changes whenever the game does
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selected, fen]
  );

  const tryMove = (from: string, to: string) => {
    try {
      game.move({ from, to, promotion: 'q' });
      setFen(game.fen());
      return true;
    } catch {
      return false;
    }
  };

  const update = () => {
    setSelected(null);
    setFen(game.fen());
  };

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
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
                squareStyles: selected
                  ? { [selected]: { backgroundColor: 'rgba(255,255,0,0.45)' } }
                  : {},
                // dot on empty targets, ring on captures
                squareRenderer: ({ square, piece, children }) => (
                  <>
                    {children}
                    {targets.has(square) && (
                      <View
                        pointerEvents="none"
                        style={piece ? styles.captureRing : styles.moveDot}
                      />
                    )}
                  </>
                ),
                canDragPiece: ({ piece }) => piece.pieceType[0] === game.turn(),
                onPieceDrag: () => setSelected(null),
                onPieceDrop: ({ sourceSquare, targetSquare }) =>
                  targetSquare ? tryMove(sourceSquare, targetSquare) : false,
                onSquareClick: ({ square, piece }) => {
                  if (selected && targets.has(square)) {
                    tryMove(selected, square);
                    setSelected(null);
                    return;
                  }
                  const own = piece && piece.pieceType[0] === game.turn();
                  setSelected(
                    own && square !== selected ? (square as Square) : null
                  );
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
                  update();
                }}
              />
              <Button
                label="Reset"
                onPress={() => {
                  game.reset();
                  update();
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
      </SafeAreaProvider>
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
  moveDot: {
    position: 'absolute',
    width: '30%',
    height: '30%',
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  captureRing: {
    position: 'absolute',
    width: '90%',
    height: '90%',
    borderRadius: 999,
    borderWidth: 4,
    borderColor: 'rgba(0,0,0,0.25)',
  },
});
