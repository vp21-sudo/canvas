"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LayoutDashboard } from "lucide-react";
import { useState } from "react";
import CanvasSizeForm from "../forms/canvas-size";

const CanvasSizeDialog = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        <LayoutDashboard />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Canvas Size</DialogTitle>
          <CanvasSizeForm setOpenAction={setOpen} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CanvasSizeDialog;
