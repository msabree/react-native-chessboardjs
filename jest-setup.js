/* eslint-env jest */
// Mock react-native so it's not loaded from node_modules (Flow syntax breaks Jest's Babel)
jest.mock('react-native', () => {
  const React = require('react');
  return {
    View: (props) => React.createElement('View', props),
    Text: (props) => React.createElement('Text', props),
    Pressable: (props) => React.createElement('Pressable', props),
    StyleSheet: { create: (s) => s },
    Dimensions: { get: () => ({ width: 320, height: 320 }) },
  };
});
// Mock react-native-reanimated so it doesn't pull in react-native
jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: View,
    setUpTests: jest.fn(),
    createAnimatedComponent: (c) => c,
    FadeIn: null,
    FadeOut: null,
    SlideInDown: null,
    useSharedValue: (v) => ({ value: v }),
    useAnimatedStyle: () => ({}),
    withSpring: (v) => v,
    runOnJS: (fn) => fn,
  };
});

// Mock react-native-svg (avoids Touchable dependency in Jest and speeds up tests)
jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MockSvg = (props) => React.createElement(View, props);
  return {
    __esModule: true,
    default: MockSvg,
    Svg: MockSvg,
    G: MockSvg,
    Path: MockSvg,
    Circle: MockSvg,
    Line: MockSvg,
    Marker: MockSvg,
    Polygon: MockSvg,
  };
});

// Mock @mgcrea/react-native-dnd (ESM package; avoid transform and native deps in Jest)
jest.mock('@mgcrea/react-native-dnd', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    DndProvider: ({ children }) => React.createElement(View, {}, children),
    Draggable: ({ children }) => React.createElement(View, {}, children),
    Droppable: ({ children }) => React.createElement(View, {}, children),
    useDraggable: () => ({ state: { value: 'idle' }, props: {} }),
  };
});
