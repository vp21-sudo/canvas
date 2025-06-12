import { RefObject } from "react";
import { create } from "zustand";

type ToolName = "rectangle" | "text" | "none"; // extend with more tools as needed

type Rectangle = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

type CanvasText = {
  x: number;
  y: number;
  text: string;
  color: string;
};

interface CanvasState {
  canvasRef: RefObject<HTMLCanvasElement | null> | null;
  setCanvasRef: (ref: RefObject<HTMLCanvasElement | null>) => void;
  width: number;
  height: number;
  setWidth: (width: number) => void;
  setHeight: (height: number) => void;
  setSize: (width: number, height: number) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;

  rects: Rectangle[];
  addRect: (
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
  ) => void;

  selectedTool: ToolName;
  setTool: (tool: ToolName) => void;

  mouseX: number;
  mouseY: number;
  setMouse: (x: number, y: number) => void;
  isDrawing: boolean;
  setDrawing: (drawing: boolean) => void;
  startPos: { x: number; y: number } | null;
  setStartPos: (pos: { x: number; y: number } | null) => void;
  clearRects: () => void;
  activeColor: string;
  setActiveColor: (color: string) => void;
  selectedRectIndex: number | null;
  setSelectedRectIndex: (index: number | null) => void;
  isDragging: boolean;
  setDragging: (dragging: boolean) => void;

  texts: CanvasText[];
  addText: (x: number, y: number, text: string, color: string) => void;
  selectedTextIndex: number | null;
  setSelectedTextIndex: (index: number | null) => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  canvasRef: null,
  setCanvasRef: (ref) => set({ canvasRef: ref }),
  width: 1920,
  height: 1080,
  setWidth: (width) => set({ width }),
  setHeight: (height) => set({ height }),
  setSize: (width, height) => set({ width, height }),
  zoom: 0.5,
  setZoom: (zoom) => set({ zoom }),
  zoomIn: () => set({ zoom: Math.min(get().zoom + 0.1, 0.7) }),
  zoomOut: () => set({ zoom: Math.max(get().zoom - 0.1, 0.3) }),

  rects: [],
  addRect: (x, y, width, height, color) =>
    set((state) => ({
      rects: [...state.rects, { x, y, width, height, color }],
    })),

  selectedTool: "none",
  setTool: (tool) => set({ selectedTool: tool }),

  mouseX: 0,
  mouseY: 0,
  setMouse: (x, y) => set({ mouseX: x, mouseY: y }),
  isDrawing: false,
  setDrawing: (drawing) => set({ isDrawing: drawing }),
  startPos: null,
  setStartPos: (pos) => set({ startPos: pos }),
  clearRects: () => set({ rects: [] }),
  activeColor: "#000000",
  setActiveColor: (color) => set({ activeColor: color }),

  selectedRectIndex: null,
  setSelectedRectIndex: (index) => set({ selectedRectIndex: index }),
  isDragging: false,
  setDragging: (dragging) => set({ isDragging: dragging }),

  texts: [],
  addText: (x, y, text, color) =>
    set((state) => ({
      texts: [...state.texts, { x, y, text, color }],
    })),

  selectedTextIndex: null,
  setSelectedTextIndex: (index) => set({ selectedTextIndex: index }),
}));
