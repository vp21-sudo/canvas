"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CaseLower } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCanvasStore } from "@/context/useCanvas";

const AddTextToCanvas = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  const { addText, width, height, setTool, activeColor, saveToHistory } =
    useCanvasStore();

  const handleAdd = () => {
    if (text.trim() === "") return;

    const centerX = width / 2;
    const centerY = height / 2;
    saveToHistory();
    addText(centerX, centerY, text, activeColor);

    setText("");
    setOpen(false);
    setTool("none");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <CaseLower style={{ width: "20px", height: "20px" }} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Text</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-2">
          <Input
            placeholder="Enter your text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <DialogFooter className="mt-4">
          <Button onClick={handleAdd}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTextToCanvas;
