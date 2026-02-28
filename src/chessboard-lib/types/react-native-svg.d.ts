/// <reference types="react" />
declare module 'react-native-svg' {
  import type { FC } from 'react';
  export const Svg: FC<Record<string, unknown>>;
  export const G: FC<Record<string, unknown>>;
  export const Path: FC<Record<string, unknown>>;
  export const Circle: FC<Record<string, unknown>>;
  export const Line: FC<Record<string, unknown>>;
  export const Marker: FC<Record<string, unknown>>;
  export const Polygon: FC<Record<string, unknown>>;
  const SvgDefault: FC<Record<string, unknown>>;
  export default SvgDefault;
}
