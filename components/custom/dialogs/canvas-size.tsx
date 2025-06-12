"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Grid2X2 } from "lucide-react";
import { useState } from "react";
import CanvasSizeForm from "../forms/canvas-size";
import { Button } from "@/components/ui/button";

const CanvasSizeDialog = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        <Button variant={"secondary"}>
          <Grid2X2 />
        </Button>
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
