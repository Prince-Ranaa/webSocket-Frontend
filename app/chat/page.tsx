"use client";
import { socket } from "@/lib/socket";
import { useEffect, useState } from "react";

export default function ChatPage() {
  const myId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : "";

  const [receiverId, setReceiverId] = useState("");
  const [receiverStatus, setReceiverStatus] = useState("Unknown");
  const [messages, setMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("message:receive", (msg) => {
      console.log("Received message:", msg);

      setMessages((prev) => {
        if (msg.senderId === receiverId) {
          return [...prev, msg];
        }
        return prev;
      });
    });

    socket.on("user:online", (id) => {
      console.log("User online:", id);

      if (id === receiverId) {
        setReceiverStatus("🟢 Online");
      }
    });

    socket.on("user:offline", (id) => {
      console.log("User offline:", id);

      if (id === receiverId) {
        setReceiverStatus("🔴 Offline");
      }
    });

    socket.on("message:history:response", (msgs) => {
      setMessages(msgs);
    });

    return () => {
      socket.off("message:receive");
      socket.off("user:online");
      socket.off("user:offline");
      socket.off("message:history:response");
      socket.off("connect");
    };
  }, [messages]);

  const loadHistory = () => {
    socket.emit("message:history", { userId: receiverId });
  };

  const sendMessage = () => {
    if (!receiverId || !messageInput) return;

    socket.emit("message:send", {
      receiverId,
      content: messageInput,
    });

    setMessages((prev) => [...prev, { senderId: myId, content: messageInput }]);

    setMessageInput("");
    loadHistory();
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Real-Time Chat</h1>

      <h3 className="mt-4">
        Logged in as: <span className="font-semibold">{myId}</span>
      </h3>

      <h3 className="mt-2">
        Receiver Status: <span>{receiverStatus}</span>
      </h3>

      <div className="mt-4 flex gap-3">
        <input
          value={receiverId}
          onChange={(e) => {
            const id = e.target.value;
            setReceiverId(id);

            if (!id) {
              setReceiverStatus("Unknown");
              return;
            }

            socket.emit("user:check-status", id, (res: any) => {
              setReceiverStatus(res.online ? "🟢 Online" : "🔴 Offline");
            });
          }}
          className="border p-2"
          placeholder="Receiver User ID"
        />
        <button
          onClick={loadHistory}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Load Chat
        </button>
      </div>

      <div className="border p-4 mt-4 h-80 overflow-y-auto rounded">
        {messages.map((msg, i) => (
          <p
            key={i}
            className={`mb-1 ${
              msg.senderId === myId ? "text-right" : "text-left"
            }`}
          >
            {msg.content}
          </p>
        ))}
      </div>

      <div className="flex gap-3 mt-4">
        <input
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          className="border p-2 flex-1"
          placeholder="Enter message"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
