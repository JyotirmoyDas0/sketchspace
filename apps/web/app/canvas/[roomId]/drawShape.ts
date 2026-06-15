
type Shape = {
  type: string;
  color: string;
  strokeWidth?: number;
  data: any;
};

export function drawShape(ctx: CanvasRenderingContext2D, shape: Shape) {
  ctx.strokeStyle = shape.color;
  ctx.lineWidth = shape.strokeWidth ?? 2;

  switch (shape.type) {
    case "line":
      ctx.beginPath();
      ctx.moveTo(shape.data.x0, shape.data.y0);
      ctx.lineTo(shape.data.x1, shape.data.y1);
      ctx.stroke();
      break;

    case "rectangle":
      ctx.strokeRect(shape.data.x, shape.data.y, shape.data.width, shape.data.height);
      break;

    case "circle":
      ctx.beginPath();
      ctx.arc(shape.data.centerX, shape.data.centerY, shape.data.radius, 0, Math.PI * 2);
      ctx.stroke();
      break;
  }
}