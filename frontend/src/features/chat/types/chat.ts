export type Sections = {
  rebuttal: string;
  improve: string;
  reason: string;
  risk: string;
};

export type UserMessage = {
  role: "user";
  content: string;
};

export type AiMessage = {
  role: "ai";
  sections: Sections;
  // 現状使用していないが、将来の拡張用に保持
  createdAt: string;
  tokens: number;
};

export type Message = UserMessage | AiMessage;

