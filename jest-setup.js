/* eslint-env jest */
require('react-native-reanimated').setUpTests();

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
