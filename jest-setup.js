/* eslint-env jest */
// Minimal mocks for what the board uses. Worklets run synchronously on JS.
jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: { View },
    useSharedValue: (v) => {
      const React = require('react');
      return React.useRef({ value: v }).current;
    },
    useAnimatedStyle: (fn) => fn(),
    withTiming: (v) => v,
  };
});

jest.mock('react-native-worklets', () => ({
  scheduleOnRN: (fn, ...args) => fn(...args),
}));

// Plain views are enough to test layout; real SVG rendering is a device concern.
jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View } = require('react-native');
  const Mock = (props) => React.createElement(View, props);
  return {
    __esModule: true,
    default: Mock,
    Svg: Mock,
    G: Mock,
    Path: Mock,
    Circle: Mock,
    Polyline: Mock,
    Polygon: Mock,
  };
});

// Gesture handler: run gesture callbacks on JS in tests (no Reanimated runtime).
for (const base of ['src', 'lib/module']) {
  jest.mock(
    `react-native-gesture-handler/${base}/handlers/gestures/reanimatedWrapper`,
    () => ({ Reanimated: undefined, Worklets: undefined })
  );
}
