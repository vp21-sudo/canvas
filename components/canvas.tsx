"use client";

import { ToolName, useCanvasStore } from "@/context/useCanvas";
import { duplicateSelectedElement } from "@/functionality/utils/utils";
import { useRef, useEffect } from "react";

const getCursor = (tool: ToolName) => {
  switch (tool) {
    case "move":
      return "move";
    case "rectangle":
      return "crosshair";
    case "scale":
      return "nwse-resize";
    default:
      return "default";
  }
};
export default function CanvasComponent() {
  const {
    setCanvasRef,
    width,
    height,
    zoom,
    rects,
    selectedTool,
    mouseX,
    mouseY,
    setMouse,
    isDrawing,
    setDrawing,
    startPos,
    setStartPos,
    addRect,
    activeColor,
    setSelectedRectIndex,
    setDragging,
    isDragging,
    selectedRectIndex,
    selectedTextIndex,
    texts,
    setSelectedTextIndex,
    undo,
    redo,
    saveToHistory,
    setScaling,
    setScaleStartPos,
    isScaling,
    scaleStartPos,
  } = useCanvasStore();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setCanvasRef(canvasRef);
  }, [setCanvasRef]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (e.ctrlKey) {
        e.preventDefault(); // Prevent default behavior for shortcuts like Ctrl+D

        switch (key) {
          case "d": {
            duplicateSelectedElement();
            break;
          }

          case "z": {
            undo();
            break;
          }

          case "y": {
            redo();
            break;
          }

          // Add more keybindings here...

          default:
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedRectIndex, rects, selectedTextIndex, texts, undo, redo]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const zoomStep = 0.05;
      const minZoom = 0.3;
      const maxZoom = 0.6;

      if (e.deltaY < 0) {
        // Zoom in
        useCanvasStore.setState((state) => ({
          zoom: Math.min(state.zoom + zoomStep, maxZoom),
        }));
      } else {
        // Zoom out
        useCanvasStore.setState((state) => ({
          zoom: Math.max(state.zoom - zoomStep, minZoom),
        }));
      }
    };

    const canvasElem = canvasRef.current;
    if (canvasElem) {
      canvasElem.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (canvasElem) {
        canvasElem.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    rects.forEach((rect, index) => {
      ctx.fillStyle = rect.color;
      ctx.strokeStyle = rect.color;
      ctx.lineWidth = 2;
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
      ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

      if (index === selectedRectIndex) {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.strokeRect(rect.x - 2, rect.y - 2, rect.width + 4, rect.height + 4);
      }
    });
    texts.forEach((t, index) => {
      ctx.fillStyle = t.color;
      ctx.font = "bold 48px sans-serif";
      ctx.fillText(t.text, t.x, t.y);

      if (index === selectedTextIndex) {
        const textWidth = ctx.measureText(t.text).width;
        const textHeight = 16;
        ctx.strokeStyle = "red";
        ctx.strokeRect(
          t.x - 2,
          t.y - textHeight,
          textWidth + 4,
          textHeight + 4,
        );
      }
    });
    if (isDrawing && selectedTool === "rectangle" && startPos) {
      const previewWidth = mouseX - startPos.x;
      const previewHeight = mouseY - startPos.y;
      ctx.setLineDash([6]);
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
      ctx.strokeRect(startPos.x, startPos.y, previewWidth, previewHeight);
      ctx.setLineDash([]);
    }
  }, [
    rects,
    width,
    height,
    zoom,
    isDrawing,
    selectedTool,
    startPos,
    mouseX,
    mouseY,
    selectedRectIndex,
    texts,
    selectedTextIndex,
  ]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    if (selectedTool === "rectangle") {
      setStartPos({ x, y });
      setDrawing(true);
    } else if (selectedTool === "move") {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;

      // Check text selection
      const textIndex = texts
        .slice()
        .reverse()
        .findIndex((t) => {
          const textWidth = ctx.measureText(t.text).width;
          const textHeight = 16;
          const left = t.x;
          const top = t.y - textHeight;
          return (
            x >= left &&
            x <= left + textWidth &&
            y >= top &&
            y <= top + textHeight
          );
        });

      if (textIndex !== -1) {
        const actualIndex = texts.length - 1 - textIndex;
        setSelectedTextIndex(actualIndex);
        setSelectedRectIndex(null);
        setDragging(true);
        setStartPos({ x, y });
        saveToHistory();
        return;
      }

      // Check rectangle selection
      const rectIndex = rects
        .slice()
        .reverse()
        .findIndex(
          (r) =>
            x >= r.x && x <= r.x + r.width && y >= r.y && y <= r.y + r.height,
        );

      if (rectIndex !== -1) {
        const actualIndex = rects.length - 1 - rectIndex;
        const selectedRect = rects[actualIndex];
        const newRects = [...rects];
        newRects.splice(actualIndex, 1);
        newRects.push(selectedRect);
        useCanvasStore.setState({ rects: newRects });
        setSelectedRectIndex(newRects.length - 1);
        setSelectedTextIndex(null);
        setDragging(true);
        setStartPos({ x, y });
      } else {
        setSelectedRectIndex(null);
        setSelectedTextIndex(null);
      }
      saveToHistory();
    } else if (selectedTool === "scale") {
      const rectIndex = rects
        .slice()
        .reverse()
        .findIndex(
          (r) =>
            x >= r.x && x <= r.x + r.width && y >= r.y && y <= r.y + r.height,
        );
      console.log("scale selected");
      console.log(rectIndex);
      if (rectIndex !== -1) {
        const actualIndex = rects.length - 1 - rectIndex;
        setSelectedRectIndex(actualIndex);
        setScaling(true);
        setScaleStartPos({ x, y });
        saveToHistory();
      } else {
        setSelectedRectIndex(null);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    setMouse(x, y);

    if (isDragging && selectedTool === "move" && startPos) {
      const dx = x - startPos.x;
      const dy = y - startPos.y;

      if (selectedRectIndex !== null) {
        const updatedRects = [...rects];
        updatedRects[selectedRectIndex] = {
          ...updatedRects[selectedRectIndex],
          x: updatedRects[selectedRectIndex].x + dx,
          y: updatedRects[selectedRectIndex].y + dy,
        };
        useCanvasStore.setState({ rects: updatedRects });
      }

      if (selectedTextIndex !== null) {
        const updatedTexts = [...texts];
        updatedTexts[selectedTextIndex] = {
          ...updatedTexts[selectedTextIndex],
          x: updatedTexts[selectedTextIndex].x + dx,
          y: updatedTexts[selectedTextIndex].y + dy,
        };
        useCanvasStore.setState({ texts: updatedTexts });
      }
      setStartPos({ x, y });
    }

    if (
      isScaling &&
      selectedTool === "scale" &&
      scaleStartPos &&
      selectedRectIndex !== null
    ) {
      console.log("scaling logic triggered");
      const dx = x - scaleStartPos.x;
      const dy = y - scaleStartPos.y;

      const updatedRects = [...rects];
      const rect = updatedRects[selectedRectIndex];

      const newWidth = Math.max(10, rect.width + dx); // Set minimum width
      const newHeight = Math.max(10, rect.height + dy); // Set minimum height

      updatedRects[selectedRectIndex] = {
        ...rect,
        width: newWidth,
        height: newHeight,
      };

      useCanvasStore.setState({ rects: updatedRects });
      setScaleStartPos({ x, y }); // Update start for next move
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setDragging(false);
      setStartPos(null);
      return;
    }

    if (isDrawing && selectedTool === "rectangle" && startPos) {
      const w = mouseX - startPos.x;
      const h = mouseY - startPos.y;
      saveToHistory();
      addRect(startPos.x, startPos.y, w, h, activeColor);
      setDrawing(false);
      setStartPos(null);
    }

    if (isScaling) {
      setScaling(false);
      setScaleStartPos(null);
    }
  };

  return (
    <div className="p-4">
      <div
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "center",
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          style={{
            width: `${width}px`,
            height: `${height}px`,
            border: "1px solid black",
            cursor: getCursor(selectedTool),
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      </div>
    </div>
  );
}
