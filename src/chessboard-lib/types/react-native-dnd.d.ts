declare module '@mgcrea/react-native-dnd' {
  export const DndProvider: import('react').ComponentType<Record<string, unknown>>;
  export const Draggable: import('react').ComponentType<Record<string, unknown>>;
  export const Droppable: import('react').ComponentType<Record<string, unknown>>;
  export function useDraggable(_options?: Record<string, unknown>): unknown;
  export type ItemOptions = { id: unknown };
  export type UniqueIdentifier = string | number;
}
