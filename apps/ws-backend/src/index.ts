import "dotenv/config"
import { WebSocketServer, WebSocket } from "ws";
import { pub, sub } from "./redis.js";
import { connectMongo } from "./db.js";
import { ShapeModel } from "./models/shape.js";
import "dotenv/config";

const wss = new WebSocketServer({ port:Number(process.env.PORT)  || 8080 });
connectMongo();

interface ExtendedWS extends WebSocket {
  roomId: string;
  userId: string;
}

function broadcastUserCount(roomId:string){
  const members = rooms.get(roomId);
  if (!members) return;
  for (const client of members) {
    client.send(JSON.stringify({type:"user_count", count:rooms.get(roomId)!.size}));
  }
}

const rooms = new Map<string, Set<ExtendedWS>>();

wss.on("connection", (ws: ExtendedWS) => {
  console.log("Client Connected");
  ws.on("message", async(data: string) => {
    const payload = JSON.parse(data.toString());
    const roomId = payload.roomId;
    const userId = payload.userId;
    if (payload.type == "join") {
      if (!rooms.has(roomId)) {
        rooms.set(roomId, new Set());
        sub.subscribe(`room:${roomId}`);
      }
      ws.roomId = roomId;
      ws.userId = userId;
      rooms.get(roomId)!.add(ws);
      broadcastUserCount(roomId);
      const canvas=await ShapeModel.find({roomId:roomId});
      ws.send(JSON.stringify({type:"existing_shapes",shapes:canvas}));
    }

    if (payload.type == "shape") {
      const {shape}=payload;
      if (!rooms.has(ws.roomId)) return;
      await ShapeModel.create({
        roomId:ws.roomId,
        userId:ws.userId,
        type:shape.type,
        color:shape.color,
        strokeWidth:shape.strokeWidth,
        data:shape.data,
      })
      pub.publish(`room:${ws.roomId}`, JSON.stringify(payload));
    }
  });

  ws.on("close", () => {
    const roomId = ws.roomId;
    const room = rooms.get(roomId);
    room?.delete(ws);
    broadcastUserCount(roomId);
    if (room?.size == 0) rooms.delete(roomId);
    console.log("Client Disconnected");
  });
});

sub.on("message", (channel, message) => {
  const roomId = channel.replace("room:", "");
  const members = rooms.get(roomId);
  if (!members) return;
  for (const client of members) {
    client.send(message);
  }
});
