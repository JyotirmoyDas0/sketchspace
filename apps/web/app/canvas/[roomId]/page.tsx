
"use client";

import { use, useState } from "react";
import Canvas from "./Canvas"
import Toolbar from "./Toolbar";

type Tool = "pen" | "eraser" | "rectangle" | "circle";

export default function Page({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);
  const [selectedTool,onToolChange]=useState<Tool>("pen");
  const [selectedColor,onColorChange]=useState<string>("black");

  return (
    <div className="flex flex-col h-max bg-black">
      <Toolbar selectedTool={selectedTool} onToolChange={onToolChange} selectedColor={selectedColor} onColorChange={onColorChange}/>
      <div className="flex flex-1 items-center justify-center">
        <Canvas roomId={roomId} selectedTool={selectedTool} selectedColor={selectedColor} />
      </div>
    </div>
  )
}