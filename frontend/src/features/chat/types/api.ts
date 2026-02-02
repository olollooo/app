import { AiMessage } from "./chat";

export type ChatRequestMessage =
  | {
      role: "user";
      content: string;
    }
  | {
      role: "ai";
      sections: AiMessage["sections"];
    };

export type ChatRequest = {
  messages: ChatRequestMessage[];
};

export type ChatResponse = {
  message: AiMessage;
};