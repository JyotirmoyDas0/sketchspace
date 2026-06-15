import React from "react";
import { Pencil, Eraser, Circle, Square } from "lucide-react";

type Tool = "pen" | "eraser" | "rectangle" | "circle";

const toolIcons = {
  pen: Pencil,
  eraser: Eraser,
  rectangle: Square,
  circle: Circle,
};

export default function Toolbar({
  selectedTool,
  onToolChange,
  selectedColor,
  onColorChange,
}: {
  selectedTool: Tool;
  onToolChange: (tool: Tool) => void;
  selectedColor: string;
  onColorChange: (color: string) => void;
}) {
  const tools: Tool[] = ["pen", "eraser", "rectangle", "circle"];

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#18181b]/80 backdrop-blur-md px-3 py-2 shadow-2xl">
        {tools.map((tool) => {
          const Icon = toolIcons[tool];

          return (
            <button
              key={tool}
              onClick={() => onToolChange(tool)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl
                transition-all duration-200
                ${
                  selectedTool === tool
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                }
              `}
            >
              <Icon size={18} />
              <span className="capitalize">{tool}</span>
            </button>
          );
        })}

        <div className="h-6 w-px bg-zinc-700 mx-1" />

        <label className="cursor-pointer flex items-center">
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => onColorChange(e.target.value)}
            className="h-10 w-10 cursor-pointer rounded-full overflow-hidden"
          />
        </label>
      </div>
    </div>
  );
}