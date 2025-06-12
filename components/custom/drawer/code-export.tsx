import { generateNodeCanvasCode } from "@/components/generate-code";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Check, Code, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const CodeExport = () => {
  const [copied, setCopied] = useState(false);
  const code = generateNodeCanvasCode();
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000); // Reset after 2s
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant={"secondary"}>
          <Code />
        </Button>
      </DrawerTrigger>
      <DrawerContent style={{ maxWidth: "31vw" }}>
        <DrawerHeader>
          <div className=" flex justify-between items-center gap-2">
            <DrawerTitle>Node Canvas</DrawerTitle>
            <Button
              onClick={handleCopy}
              variant={"secondary"}
              size="sm"
              className={
                " p-0 m-0 " + (copied ? " bg-green-100 hover:bg-green-100" : "")
              }
            >
              {copied ? <Check /> : <Copy />}
            </Button>
          </div>
        </DrawerHeader>
        <div className=" h-full overflow-auto px-3 py-3">
          <pre>{code}</pre>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export { CodeExport };
