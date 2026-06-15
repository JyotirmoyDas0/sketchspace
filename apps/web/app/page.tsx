"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Landing = () => {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center p-8">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-9 h-9 bg-[#6c63ff] rounded-xl flex items-center justify-center text-white text-lg">✏️</div>
        <span className="text-white text-2xl font-medium">Sketchspace</span>
      </div>
      <p className="text-[#666] text-sm mb-8">Real-time collaborative whiteboard. Draw together, instantly.</p>

      <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-7 w-full max-w-sm">
        <p className="text-white font-medium mb-1">Join a room</p>
        <p className="text-[#555] text-sm mb-5">Enter a room ID to collaborate with others</p>

        <input
          type="text"
          placeholder="Enter room ID"
          onChange={(e) => setRoomId(e.target.value)}
          className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg text-white text-sm px-3 py-2.5 outline-none focus:border-[#6c63ff] placeholder-[#444] mb-3"
        />

        <button
          onClick={() => roomId && router.push("/canvas/" + roomId)}
          className="w-full bg-[#6c63ff] hover:bg-[#5a52d5] text-white rounded-lg py-2.5 text-sm font-medium mb-2"
        >
          Join room
        </button>

        <div className="flex items-center gap-2 my-2">
          <div className="flex-1 h-px bg-[#2a2a2a]"></div>
          <span className="text-[#444] text-xs">or</span>
          <div className="flex-1 h-px bg-[#2a2a2a]"></div>
        </div>

        <button
          onClick={() => router.push("/canvas/" + crypto.randomUUID())}
          className="w-full bg-transparent border border-[#2a2a2a] hover:border-[#555] text-[#888] hover:text-white rounded-lg py-2.5 text-sm"
        >
          Create new room
        </button>
      </div>
    </div>
  );
};

export default Landing;