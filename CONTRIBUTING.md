# Contributing

Contributions are welcome, small or large. Please follow the [code of conduct](./CODE_OF_CONDUCT.md).

## Setup

Node 22 (see `.nvmrc`) and Yarn (via Corepack).

```sh
corepack enable
yarn install
```

## Layout

- `src/`: the library. TypeScript, no build step needed during development.
- `__tests__/`: Jest tests.
- `example/`: Expo app that loads the library straight from `src/`, so edits show up live.

## Develop

```sh
yarn example start   # Expo Go
yarn example ios     # dev build (or android)
```

## Before opening a PR

```sh
yarn typecheck
yarn lint            # yarn lint --fix to autofix
yarn test
yarn prepare         # builds lib/ with bob
```

Add or update tests for any behavior change. Gestures are tested with `createGestureController` from `react-native-gesture-handler/jest-utils` (see `__tests__/drag.test.tsx`).

## Guidelines

- Keep the API in line with [react-chessboard](https://github.com/Clariity/react-chessboard) v5. Mobile-only differences go in the README's "Not on mobile" section.
- Do the per-frame drag work on the UI thread. React should only render on drag start, square change and drop.
- No files whose names differ only by case (macOS file systems are case-insensitive).

## Commits and releases

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org) (`feat:`, `fix:`, `docs:`, ...), checked by commitlint.

Releases are cut by the maintainer with `yarn release`.
