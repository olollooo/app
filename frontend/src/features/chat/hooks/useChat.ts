"use client";

import { useState } from "react";
import type { Message } from "../types/chat";
import { sendChat } from "../api/api";
import { resolveApiError } from "../../../../src/lib/errors/resolveApiError";
import router from "next/router";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sending, setSending] = useState(false);

  const send = async (input: string) => {
    if (!input.trim() || sending) return;

    setSending(true);

    const userMsg: Message = { role: "user", content: input };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);

    try {
      const res = await sendChat(nextHistory);
      setMessages(prev => [...prev, res.message]);
    } catch (e) {
      const { message, action } = resolveApiError(e);
      alert(message);

      if (action === "redirectLogin") router.push("/");
    } finally {
      setSending(false);
    }
  };

  return {
    messages,
    setMessages,
    sending,
    send,
  };
}
