import { useCanvasStore } from "@/context/useCanvas";

function generateNodeCanvasCode() {
  const { width, height, rects } = useCanvasStore.getState();

  return `
const { createCanvas } = require("canvas");
const fs = require("fs");

const width = ${width};
const height = ${height};
const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");

ctx.fillStyle = "white";
ctx.fillRect(0, 0, width, height);

const rects = ${JSON.stringify(rects, null, 2)};

rects.forEach(({ x, y, width, height, color }) => {
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.fillRect(x, y, width, height);
  ctx.strokeRect(x, y, width, height);
});

const buffer = canvas.toBuffer("image/png");
fs.writeFileSync("output.png", buffer);
`.trim();
}

export { generateNodeCanvasCode };
