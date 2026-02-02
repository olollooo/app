"use client";

import { useEffect, useState } from "react";
import { createKnowledge } from "../../features/knowledge/api/api";
import { CATEGORY_LABEL, Category } from "../../features/knowledge/constants/category";
import { resolveApiError } from "../../../src/lib/errors/resolveApiError";
import { mutate } from "swr";

export default function SaveKnowledgeModal({
  open,
  initialText,
  onClose,
}: {
  open: boolean;
  initialText: string;
  onClose: () => void;
}) {
  const [category, setCategory] = useState<Category | "">("");
  const [text, setText] = useState(initialText);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setText(initialText);
      setCategory("");
    }
  }, [open, initialText]);

  if (!open) return null;

  const handleSave = async () => {
    if (!category || !text.trim()) {
      alert("カテゴリと内容を入力してください");
      return;
    }

    try {
      setLoading(true);
      await createKnowledge({ category, text });

      mutate("/knowledge");

      onClose();
    } catch (e) {
      const { message } = resolveApiError(e);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const categories = Object.keys(CATEGORY_LABEL) as Category[];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-xl bg-gray-900 rounded-xl shadow-xl p-6 space-y-4">
        <div className="text-lg font-semibold">ナレッジ保存</div>

        <div>
          <label className="text-xs text-gray-400">カテゴリ</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value as Category)}
            className="w-full mt-1 bg-gray-950 border border-gray-700 rounded-lg px-3 py-2"
          >
            <option value="">選択してください</option>
            {categories.map(key => (
              <option key={key} value={key}>
                {CATEGORY_LABEL[key]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-400">AI回答</label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            className="w-full mt-1 min-h-[140px] bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 resize-none"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-800"
          >
            キャンセル
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white disabled:opacity-50"
          >
            {loading ? "保存中…" : "保存"}
          </button>
        </div>
      </div>
    </div>
  );
}
