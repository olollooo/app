import { apiFetch } from "../../../lib/api/apiClient";
import type { ChatRequest, ChatResponse } from "../types/api";
import type { Message } from "../types/chat";

export const sendChat = (messages: Message[]) =>
  apiFetch<ChatResponse>("/chat", {
    method: "POST",
    body: {
      messages: messages.map(m => {
        if (m.role === "user") {
          return {
            role: "user",
            content: m.content,
          };
        } else {
          return {
            role: "ai",
            sections: m.sections,
          };
        }
      }),
    } satisfies ChatRequest,
  });
