"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

type Props = {
  language: string;
  children: string;
};

export function CodeBlock({ language, children }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      console.error("コピー失敗", e);
    }
  };

  return (
    <div className="my-3 rounded-lg overflow-hidden border border-gray-800 bg-gray-900">
      <div className="flex items-center px-3 py-2 bg-gray-900 border-b border-gray-800 gap-2">
        <span className="text-xs text-gray-400 font-mono">
          {language}
        </span>

        <button
          onClick={handleCopy}
          className="
            p-1
            rounded
            text-gray-300
            hover:text-white
            hover:bg-gray-700
            transition
          "
          aria-label="Copy code"
        >
          {copied ? (
            <Check size={14} strokeWidth={1.8} className="text-green-400" />
          ) : (
            <Copy size={14} strokeWidth={1.8} />
          )}
        </button>
      </div>

      <SyntaxHighlighter
        language={language}
        style={oneDark}
        PreTag="div"
        customStyle={{
          margin: 0,
          background: "#111827",
          fontSize: "0.85rem",
          padding: "1rem",
        }}
        codeTagProps={{
          style: { background: "transparent" },
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}
