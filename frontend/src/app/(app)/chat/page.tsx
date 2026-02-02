"use client";

import { useEffect, useRef, useState } from "react";
import SaveKnowledgeModal from "../../../components/knowledge/SaveKnowledgeModal";
import { ChatMessage } from "../../../features/chat/components/ChatMessage";
import { useChat } from "../../../features/chat/hooks/useChat";

export default function ChatPage() {
  const { messages, sending, send } = useChat();

  const [input, setInput] = useState("");
  const [saveTarget, setSaveTarget] = useState<string | null>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.style.height = "auto";
    inputRef.current.style.height =
      Math.min(inputRef.current.scrollHeight, 120) + "px";
  }, [input]);

  const handleSend = async () => {
    const current = input;
    setInput("");
    await send(current);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-gray-950 text-gray-100">
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((m, i) => (
          <ChatMessage
            key={i}
            message={m}
            onSave={text => setSaveTarget(text)}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-gray-800 bg-gray-900 p-3 flex gap-2 items-end shrink-0">
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="メッセージを入力…"
          className="flex-1 resize-none rounded-lg bg-gray-950 border border-gray-700 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
          style={{ maxHeight: 120 }}
          disabled={sending}
        />
        <button
          onClick={handleSend}
          disabled={sending}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-500 rounded-lg text-white text-sm font-medium disabled:opacity-50"
        >
          {sending ? "送信中..." : "送信"}
        </button>
      </div>

      <SaveKnowledgeModal
        open={!!saveTarget}
        initialText={saveTarget ?? ""}
        onClose={() => setSaveTarget(null)}
      />
    </div>
  );
}
