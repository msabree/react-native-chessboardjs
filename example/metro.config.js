// Resolve the library from ../src so edits show up live, and force a single
// copy of React and the native libs (root node_modules has its own copies for
// tests because of nmHoistingLimits: workspaces).
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const root = path.resolve(__dirname, '..');
const shared = [
  'react',
  'react-native',
  'react-native-gesture-handler',
  'react-native-reanimated',
  'react-native-worklets',
  'react-native-svg',
];

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const config = getDefaultConfig(__dirname);

config.watchFolders = [root];
config.resolver.blockList = shared.map(
  (m) => new RegExp(`^${escape(path.join(root, 'node_modules', m))}\\/.*$`)
);
config.resolver.extraNodeModules = {
  'react-native-chessboardjs': path.join(root, 'src'),
  ...Object.fromEntries(
    shared.map((m) => [m, path.join(__dirname, 'node_modules', m)])
  ),
};

module.exports = config;
