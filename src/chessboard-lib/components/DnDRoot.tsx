import React, {
  createContext,
  useState,
  useContext,
} from "react";
import type { Dispatch, FC, ReactNode, SetStateAction } from "react";
import { DndProvider, ItemOptions, UniqueIdentifier } from "@mgcrea/react-native-dnd";
import type { LayoutRectangle } from "react-native";
import { View } from "react-native";
import type { GestureStateChangeEvent, GestureUpdateEvent, PanGestureHandlerEventPayload } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import type { ChessboardDnDProviderProps } from "../types";

type DragState = {
  isDragging: boolean | null;
  activeId: UniqueIdentifier | null;
  activeLayout: LayoutRectangle | null;
  droppableActiveId: UniqueIdentifier | null;
};

type DropState = {
  droppedId: UniqueIdentifier | null;
  droppedTargetSquare: UniqueIdentifier | null;
};

type ChessboardDnDContextType = {
  isCustomDndProviderSet: boolean;
  dragState: DragState;
  setDragState: Dispatch<SetStateAction<DragState>>;
  dropState: DropState;
  setDropState: Dispatch<SetStateAction<DropState>>;
  clearDropState: () => void;
};

export const ChessboardDnDContext = createContext<ChessboardDnDContextType>({
  isCustomDndProviderSet: false,
  dragState: {
    isDragging: false,
    activeId: null,
    activeLayout: null,
    droppableActiveId: null,
  },
  dropState: {
    droppedId: null,
    droppedTargetSquare: null,
  },
  setDragState: () => { },
  setDropState: () => { },
  clearDropState: () => { },
});

const EmptyProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return <View style={{ flex: 1 }}>{children}</View>;
};

type ChessboardDnDRootProps = {
  children: ReactNode;
};

export const ChessboardDnDProvider: FC<ChessboardDnDProviderProps & ChessboardDnDRootProps> = ({
  children,
}) => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: null,
    activeId: null,
    activeLayout: null,
    droppableActiveId: null,
  });

  const [dropState, setDropState] = useState<DropState>({
    droppedId: null,
    droppedTargetSquare: null,
  });

  const handleBegin = (e: GestureStateChangeEvent<PanGestureHandlerEventPayload>, info: {
    activeId: UniqueIdentifier;
    activeLayout: LayoutRectangle;
  }) => {
    setDragState({
      isDragging: true,
      activeId: info.activeId,
      activeLayout: info.activeLayout,
      droppableActiveId: null,
    });
  };

  const handleUpdate = (e: GestureUpdateEvent<PanGestureHandlerEventPayload>, meta: {
    activeId: UniqueIdentifier;
    activeLayout: LayoutRectangle;
    droppableActiveId: UniqueIdentifier | null;
  }) => {
    // Update drag state with the active droppable
    setDragState((prev) => ({
      ...prev,
      droppableActiveId: meta.droppableActiveId,
    }));
  };

  const handleDragEnd = (e: {
    active: ItemOptions;
    over: ItemOptions | null;
  }) => {
    setDropState({
      droppedId: e.active.id as UniqueIdentifier | null,
      droppedTargetSquare: (e.over?.id ?? null) as UniqueIdentifier | null,
    });
    setDragState((prev) => ({
      ...prev,
      isDragging: false,
    }));
  };

  const clearDropState = () => {
    setDropState({
      droppedId: null,
      droppedTargetSquare: null,
    });
  };

  return (
    <ChessboardDnDContext.Provider value={{
      isCustomDndProviderSet: true,
      dragState,
      dropState,
      setDragState,
      setDropState,
      clearDropState,
    }}>
      <DndProvider
        minDistance={5}
        shouldDropWorklet={(activeRect: { x: number; y: number; width: number; height: number }, droppableRect: { x: number; y: number; width: number; height: number }) => {
          'worklet';
          // Very permissive drop zone - allow drop if any part of the piece overlaps with the square
          // This ensures drops work for both white and black pieces
          const pieceRight = activeRect.x + activeRect.width;
          const pieceBottom = activeRect.y + activeRect.height;
          const squareRight = droppableRect.x + droppableRect.width;
          const squareBottom = droppableRect.y + droppableRect.height;
          
          // Check for overlap - piece overlaps square if:
          // - piece left edge is before square right edge AND
          // - piece right edge is after square left edge AND
          // - piece top edge is before square bottom edge AND
          // - piece bottom edge is after square top edge
          const overlaps = activeRect.x < squareRight &&
                          pieceRight > droppableRect.x &&
                          activeRect.y < squareBottom &&
                          pieceBottom > droppableRect.y;
          
          return overlaps;
        }}
        onBegin={(e: GestureStateChangeEvent<PanGestureHandlerEventPayload>, info: { activeId: UniqueIdentifier; activeLayout: LayoutRectangle }) => {
          'worklet';
          runOnJS(handleBegin)(e, info);
        }}
        onUpdate={(e: GestureUpdateEvent<PanGestureHandlerEventPayload>, meta: { activeId: UniqueIdentifier; activeLayout: LayoutRectangle; droppableActiveId: UniqueIdentifier | null }) => {
          'worklet';
          runOnJS(handleUpdate)(e, meta);
        }}
        onDragEnd={(e: { active: ItemOptions; over: ItemOptions | null }) => {
          'worklet';
          runOnJS(handleDragEnd)(e);
        }}>
        {children}
      </DndProvider>
    </ChessboardDnDContext.Provider>
  );
};

export const ChessboardDnDRoot: FC<ChessboardDnDRootProps> = ({
  children,
}) => {
  const { isCustomDndProviderSet } = useContext(ChessboardDnDContext);

  if (isCustomDndProviderSet) {
    return <EmptyProvider>
      {children}
    </EmptyProvider>;
  }

  return (
    <DndProvider>
      {children}
    </DndProvider>
  );
};