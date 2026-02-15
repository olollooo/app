"use client";

import type { Message, Sections } from "../types/chat";
import { buildDisplayTextForSave } from "../utils/buildDisplayTextForSave";
import { Section } from "./Section";

type Props = {
  message: Message;
  onSave: (text: string) => void;
};

export function ChatMessage({ message, onSave }: Props) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-start px-2 mb-2">
        <div className="max-w-full sm:max-w-[80%] rounded-2xl shadow bg-sky-600 text-white overflow-x-auto">
          <pre className="whitespace-pre font-mono text-sm m-0 px-4 py-2">
            {message.content}
          </pre>
        </div>
      </div>
    );
  }

  const { rebuttal, improve, reason, risk }: Sections = message.sections;

  return (
    <div className="flex flex-col gap-4 group">
      <Section title="反論" text={rebuttal} />
      <Section title="改善案" text={improve} />
      <Section title="改善理由" text={reason} />
      <Section title="改善後リスク" text={risk} />

      <div className="flex justify-end">
        <button
          onClick={() => onSave(buildDisplayTextForSave(message))}
          className="text-xs text-sky-400 hover:text-sky-300 opacity-0 group-hover:opacity-100 transition"
        >
          💾 保存
        </button>
      </div>
    </div>
  );
}
