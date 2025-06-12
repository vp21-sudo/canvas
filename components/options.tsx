import { ToolName, useCanvasStore } from "@/context/useCanvas";
import CanvasSizeDialog from "./custom/dialogs/canvas-size";
import { Button } from "./ui/button";
import {
  Download,
  Minus,
  MousePointer,
  Move,
  Plus,
  Scaling,
  Square,
} from "lucide-react";
import { Input } from "./ui/input";
import { CodeExport } from "./custom/drawer/code-export";
import AddTextToCanvas from "./custom/dialogs/add-text";

const Options = () => {
  const { setTool, selectedTool, setActiveColor, canvasRef } = useCanvasStore();
  const handleToolClick = (tool: ToolName) => {
    if (selectedTool === tool) {
      return setTool("none");
    }
    setTool(tool);
  };

  const handleExport = () => {
    const canvas = canvasRef?.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL("image/png");

    // Option 1: Download it
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "canvas-export.png";
    link.click();
  };
  return (
    <div className=" absolute left-2 h-[90vh] top-2 z-10 flex flex-col justify-center items-center gap-2 pt-20">
      <Input
        type="color"
        className=" w-10 h-10 p-0 m-0"
        onChange={(e) => {
          setActiveColor(e.target.value);
        }}
      />
      <CanvasSizeDialog />
      <Button
        variant={"secondary"}
        className={
          " hover:bg-none " +
          (selectedTool === "none" ? "bg-blue-100 hover:bg-blue-200 " : "")
        }
        onClick={() => handleToolClick("none")}
      >
        <MousePointer />
      </Button>
      <Button
        variant={"secondary"}
        className={
          " hover:bg-none " +
          (selectedTool === "rectangle" ? "bg-blue-100 hover:bg-blue-200 " : "")
        }
        onClick={() => handleToolClick("rectangle")}
      >
        <Square />
      </Button>
      <Button
        variant={"secondary"}
        className={
          " hover:bg-none " +
          (selectedTool === "move" ? "bg-blue-100 hover:bg-blue-200 " : "")
        }
        onClick={() => handleToolClick("move")}
      >
        <Move />
      </Button>
      <Button
        variant={"secondary"}
        className={
          " hover:bg-none " +
          (selectedTool === "scale" ? "bg-blue-100 hover:bg-blue-200 " : "")
        }
        onClick={() => handleToolClick("scale")}
      >
        <Scaling />
      </Button>
      <AddTextToCanvas />
      <CodeExport />
      <Button variant={"secondary"} onClick={handleExport}>
        <Download />
      </Button>
    </div>
  );
};

const BottomOptions = () => {
  const { width, height, zoomOut, zoomIn, mouseX, mouseY } = useCanvasStore();
  return (
    <div className=" z-10 fixed bottom-0 w-full justify-between items-center flex pb-2 px-2">
      <p className=" text-base">{`Canvas Size: ${width}x${height}`}</p>
      <p className=" text-lg">
        {`x: ${mouseX < 0 ? 0 : Math.round(mouseX)}, y: ${mouseY < 0 ? 0 : Math.round(mouseY)}`}{" "}
      </p>
      <div className=" flex justify-center items-center gap-2">
        <Button
          variant={"default"}
          className="  w-fit h-fit text-xl"
          onClick={zoomOut}
        >
          <Minus />
        </Button>
        <Button
          variant={"default"}
          className=" text-xl w-fit h-fit"
          onClick={zoomIn}
        >
          <Plus />
        </Button>
      </div>
    </div>
  );
};

export { Options, BottomOptions };
