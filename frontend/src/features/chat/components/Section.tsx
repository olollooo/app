"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { CodeBlock } from "./CodeBlock";

type Props = {
  title: string;
  text: string;
};

export function Section({ title, text }: Props) {
  const components: Components = {
    p({ children }) {
      return (
        <p className="whitespace-pre-wrap break-words leading-relaxed text-gray-100">
          {children}
        </p>
      );
    },

    code({ className, children }) {
      const match = /language-(\w+)/.exec(className || "");
      const language = match?.[1];

      if (!language) {
        return (
          <code className="bg-gray-800 px-1 rounded text-sm font-mono">
            {children}
          </code>
        );
      }

      return (
        <CodeBlock language={language}>
          {String(children).replace(/\n$/, "")}
        </CodeBlock>
      );
    },
  };

  return (
    <div className="flex flex-col gap-1 group">
      <div className="text-sm font-semibold text-sky-400">
        【{title}】
      </div>

      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {text}
      </ReactMarkdown>
    </div>
  );
}
