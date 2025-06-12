import { useCanvasStore } from "@/context/useCanvas";

const duplicateSelectedElement = () => {
  const { selectedRectIndex, selectedTextIndex, rects, texts } =
    useCanvasStore.getState();
  // Duplicate selected rect
  if (selectedRectIndex !== null) {
    const rect = rects[selectedRectIndex];
    const newRect = { ...rect, x: rect.x + 10, y: rect.y + 10 };
    useCanvasStore.setState({ rects: [...rects, newRect] });
  }

  // Duplicate selected text
  if (selectedTextIndex !== null) {
    const text = texts[selectedTextIndex];
    const newText = { ...text, x: text.x + 10, y: text.y + 10 };
    useCanvasStore.setState({ texts: [...texts, newText] });
  }
};

export { duplicateSelectedElement };
