/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {SafeAreaView, StyleSheet, useColorScheme, View} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Chessboard from './components/Chessboard/Chessboard';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <View style={styles.sectionContainer}>
        <Chessboard
          boardOrientation={'black'}
          onPieceDrop={(startingSquareName: string, squareName: string) => {
            'worklet';

            console.log(startingSquareName, squareName);
            return true;
          }}
          onSquareClick={(squareName: string) => {
            'worklet';

            console.log(squareName);
            return squareName === 'a1' ? true : false;
          }}
          customDarkSquareStyle={{backgroundColor: '#60688e'}}
          customLightSquareStyle={{backgroundColor: '#d3d7ec'}}
          customSquareStyles={
            new Map<string, object>([
              ['a1', {backgroundColor: 'red'}],
              ['a2', {backgroundColor: 'blue'}],
              ['a3', {backgroundColor: 'green'}],
            ])
          }
          // customBoardStyle={{backgroundColor: 'red'}}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  GestureHandlerRootView: {flex: 1},
  sectionContainer: {
    marginTop: 32,
    // paddingHorizontal: 24,
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
