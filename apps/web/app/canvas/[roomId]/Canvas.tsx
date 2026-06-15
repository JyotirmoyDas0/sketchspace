"use client";

import "dotenv/config"
import { useEffect, useRef, useState } from "react";
import { drawShape } from "./drawShape";

type Tool = "pen" | "eraser" | "rectangle" | "circle";

export default function Canvas({
  roomId,
  selectedTool,
  selectedColor,
}: {
  roomId: string;
  selectedTool: Tool;
  selectedColor: string;
}) {
  const wsRef = useRef<WebSocket | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const userId = useRef(crypto.randomUUID());
  const topCanvasRef = useRef<HTMLCanvasElement>(null);
  const startPos = useRef<{ x: number; y: number } | null>(null);
  const [user, setUser] = useState(0);
  const myShapes = useRef<any[]>([]);

  function onMouseDown(e: React.MouseEvent) {
    isDrawing.current = true;
    const ctx = topCanvasRef.current?.getContext("2d");
    if (!ctx) return;
    const rect = topCanvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    startPos.current = { x, y };
  }
  function onMouseUp(e: React.MouseEvent) {
    isDrawing.current = false;
    lastPos.current = null;
    if (selectedTool === "rectangle" && startPos.current) {
      const ctx = canvasRef.current?.getContext("2d");
      const topCtx = topCanvasRef.current?.getContext("2d");
      const rect = topCanvasRef.current!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const width = x - startPos.current.x;
      const height = y - startPos.current.y;
      if (!ctx) return;
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(startPos.current.x, startPos.current.y, width, height);
      topCtx?.clearRect(
        0,
        0,
        topCanvasRef.current!.width,
        topCanvasRef.current!.height,
      );
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current?.send(
          JSON.stringify({
            type: "shape",
            roomId: roomId,
            userId: userId.current,
            shape: {
              type: "rectangle",
              color: selectedColor,
              strokeWidth: 2,
              data: {
                x: startPos.current.x,
                y: startPos.current.y,
                width,
                height,
              },
            },
          }),
        );
      }
    }
    if (selectedTool === "circle" && startPos.current) {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;
      const topCtx = topCanvasRef.current?.getContext("2d");
      const rect = topCanvasRef.current!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = (startPos.current.x + x) / 2;
      const centerY = (startPos.current.y + y) / 2;
      const radius =
        Math.hypot(x - startPos.current.x, y - startPos.current.y) / 2;
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
      topCtx?.clearRect(
        0,
        0,
        topCanvasRef.current!.width,
        topCanvasRef.current!.height,
      );
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current?.send(
          JSON.stringify({
            type: "shape",
            roomId: roomId,
            userId: userId.current,
            shape: {
              type: "circle",
              color: selectedColor,
              strokeWidth: 2,
              data: { centerX, centerY, radius },
            },
          }),
        );
      }
    }
    startPos.current = null;
  }
  function onMouseMove(e: React.MouseEvent) {
    if (selectedTool == "rectangle") {
      const ctx = topCanvasRef.current?.getContext("2d");
      if (!ctx) return;
      if (!isDrawing.current) return;
      const rect = topCanvasRef.current!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (!startPos.current) return;
      const width = startPos.current.x - x;
      const height = startPos.current.y - y;
      ctx.clearRect(
        0,
        0,
        topCanvasRef.current!.width,
        topCanvasRef.current!.height,
      );
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
    } else if (selectedTool == "circle") {
      const ctx = topCanvasRef.current?.getContext("2d");
      if (!ctx) return;
      if (!isDrawing.current) return;
      const rect = topCanvasRef.current!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (!startPos.current) return;
      const centerX = (startPos.current.x + x) / 2;
      const centerY = (startPos.current.y + y) / 2;
      const radius =
        Math.hypot(x - startPos.current.x, y - startPos.current.y) / 2;
      ctx.clearRect(
        0,
        0,
        topCanvasRef.current!.width,
        topCanvasRef.current!.height,
      );
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;
      if (!isDrawing.current) return;
      const rect = canvasRef.current!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (!lastPos.current) {
        lastPos.current = { x, y };
        return;
      }
      if (selectedTool === "eraser") {
        ctx.strokeStyle = "white";
        ctx.lineWidth = 10;
      } else {
        ctx.strokeStyle = selectedColor;
        ctx.lineWidth = 2;
      }

      ctx.beginPath();
      ctx.moveTo(lastPos.current?.x, lastPos.current?.y);
      ctx.lineTo(x, y);
      ctx.stroke();
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current?.send(
          JSON.stringify({
            type: "shape",
            roomId: roomId,
            userId: userId.current,
            shape: {
              type: "line",
              color: selectedTool === "eraser" ? "#ffffff" : selectedColor,
              strokeWidth: selectedTool === "eraser" ? 10 : 2,
              data: {
                x0: lastPos.current.x,
                y0: lastPos.current.y,
                x1: x,
                y1: y,
              },
            },
          }),
        );
      }
      lastPos.current = { x, y };
    }
  }

  useEffect(() => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080");
    wsRef.current = ws;
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          roomId: roomId,
          userId: userId.current,
        }),
      );
    };
    ws.onmessage = (event: MessageEvent) => {
      const payload = JSON.parse(event.data);
      const type = payload.type;
      if (type == "shape") {
        const ctx = canvasRef.current?.getContext("2d");
        if (!ctx) return;
        drawShape(ctx, payload.shape);
      }
      if (type == "existing_shapes") {
        const shapes = payload.shapes;
        const ctx = canvasRef.current?.getContext("2d");
        if (!ctx) return;
        for (let i = 0; i < shapes.length; i++) {
          drawShape(ctx, shapes[i]);
        }
      }
      if (type == "user_count") {
        setUser(payload.count);
      }
      console.log(myShapes.current)
    };
    return () => {
      ws.close();
    };
  }, []);
  return (
    <>
      <div className="fixed top-4 left-4 bg-[#1a1a1a] text-white px-3 py-1.5 rounded-lg text-sm border border-[#2a2a2a]">
        👥 {user} online{" "}
      </div>
      <div className="min-h-screen bg-black flex items-center justify-center p-10">
        <div className="relative bg-black p-10 rounded-3xl shadow-2xl">
          <div className="relative rounded-2xl overflow-hidden">
            <canvas
              className="bg-white shadow-lg"
              width={800}
              height={600}
              ref={canvasRef}
            />
            <canvas
              className="absolute top-0 left-0"
              width={800}
              height={600}
              ref={topCanvasRef}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
            />
          </div>
        </div>
      </div>
    </>
  );
}
