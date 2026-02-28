<div align="center" markdown="1">

# react-native-chessboardjs

<img src="./media/iPhoneChessboard.png" alt="react chessboard" width="300">

</div>

# What is react-native-chessboardjs?

A React Native chessboard with drag-and-drop, promotion dialogs, and customizable styling. Built on a modern stack: **@mgcrea/react-native-dnd** for gestures and **react-native-svg** for piece graphics. The API is inspired by [react-chessboard](https://www.npmjs.com/package/react-chessboard) and uses FEN for position and callbacks for moves, promotion, and square clicks.

## Installation

```bash
npm i react-native-chessboardjs
# or
yarn add react-native-chessboardjs
```

### Peer dependencies

The library depends on:

- `react-native-gesture-handler`
- `react-native-reanimated`
- `react-native-svg`
- `@mgcrea/react-native-dnd`

They are listed as dependencies; if you use a monorepo or strict peer resolution, install them in your app.

### iOS

```bash
cd ios && pod install && cd ..
```

If you have issues, add to your Podfile:

```ruby
pod 'RNReanimated', :path => '../node_modules/react-native-reanimated'
pod 'RNGestureHandler', :path => '../node_modules/react-native-gesture-handler'
```

### Android

No extra setup beyond linking. Ensure your app has the required native modules for the dependencies above.

## Example

Uses [chess.js](https://github.com/jhlywa/chess.js) (e.g. `^1.0.0-beta.6` or `^1.2.0`) for move validation.

```jsx
function App(): JSX.Element {
  const [chessGame] = useState(new Chess());
  const [optionSquares, setOptionSquares] = useState({});
  const [moveFrom, setMoveFrom] = useState('');

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const resetFirstMove = (square: Square) => {
    const hasOptions = getMoveOptions(square);
    if (hasOptions) {
      setMoveFrom(square);
    }
  };

  const getMoveOptions = (square: Square) => {
    const moves = chessGame.moves({
      square,
      verbose: true,
    });
    if (moves.length === 0) {
      return false;
    }

    const newSquares = {} as any;
    moves.map(move => {
      newSquares[move.to] = {
        backgroundColor: 'green',
        height: 15,
        width: 15,
        borderRadius: 50,
      };
      return move;
    });
    setOptionSquares(newSquares);
    return true;
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <View style={styles.sectionContainer}>
        <Chessboard
          customDarkSquareStyle={styles.customDarkSquareStyle}
          customLightSquareStyle={styles.customLightSquareStyle}
          position={chessGame.fen()}
          customSquareStyles={{
            ...optionSquares,
          }}
          onPieceDrop={(
            sourceSquare: Square,
            targetSquare: Square,
            piece: Piece,
          ) => {
            try {
              chessGame.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: piece?.[1] ?? 'q',
              });
              setMoveFrom('');
              setOptionSquares({});
              return true;
            } catch (e) {}
            return false;
          }}
          onSquareClick={(square: Square) => {
            if (!moveFrom) {
              resetFirstMove(square);
              return false;
            }

            try {
              chessGame.move({
                from: moveFrom,
                to: square,
                // use 'q' if not using selection modal
                promotion: 'q', // this is handled by drop event if onPromotionCheck is set
              });
              setMoveFrom('');
              setOptionSquares({});
              return true;
            } catch (e) {
              // invalid move
              resetFirstMove(square);
            }
            return false;
          }}
          isDraggablePiece={({piece}) => {
            return chessGame.turn() === piece[0];
          }}
          // if a user makes an invalid move attempt they will still see the modal
          // validating moves for promo check requires a bit more work than
          // we show in this example. the if statement can be extended as needed
          onPromotionCheck={(sourceSquare, targetSquare, piece) => {
            if (
              (piece === 'wp' &&
                sourceSquare[1] === '7' &&
                targetSquare[1] === '8') ||
              (piece === 'bp' &&
                sourceSquare[1] === '2' &&
                targetSquare[1] === '1')
            ) {
              // continue...
              // check square range diff
              return (
                Math.abs(
                  sourceSquare.charCodeAt(0) - targetSquare.charCodeAt(0),
                ) <= 1
              );
            }
            return false;
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  customDarkSquareStyle: {
    backgroundColor: '#D2691E',
  },
  customLightSquareStyle: {
    backgroundColor: '#DEB887',
  },
  sectionContainer: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
```

## Props

Piece type in callbacks uses lowercase letter: `'wk'`, `'bq'`, `'wp'`, etc. (e.g. white king = `'wk'`, black pawn = `'bp'`).

| Prop | Default | Description |
|------|---------|-------------|
| `boardOrientation` | `'white'` | `'white'` or `'black'`. The chosen color is at the bottom. |
| `customDarkSquareStyle` | `{ backgroundColor: 'black' }` | Style object for dark squares. |
| `customLightSquareStyle` | `{ backgroundColor: 'white' }` | Style object for light squares. |
| `customSquareStyles` | `{}` | Keyed by square (e.g. `'e4'`). Styles applied on top of base square styles. |
| `position` | Start FEN | FEN string for the board position. |
| `size` | — | Optional `{ width, height }`. Board width; height unused. If omitted, uses window width. |
| `onPress` | — | Optional. If provided, wraps the board in a touchable and calls this on press. |
| `onPieceDrop` | **required** | `(sourceSquare, targetSquare, piece) => boolean`. Called when a piece is dropped. Return `true` if the move is accepted. |
| `onSquareClick` | `() => true` | `(square) => boolean`. Called when a square is tapped. |
| `onPromotionCheck` | pawn on last rank | `(sourceSquare, targetSquare, piece) => boolean`. Return `true` when the move is a promotion (so the promotion dialog is shown). |
| `isDraggablePiece` | `() => true` | `({ piece }) => boolean`. Return `false` to disable dragging for that piece. |

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---
