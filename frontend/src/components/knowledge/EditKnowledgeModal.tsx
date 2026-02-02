"use client";

import { useEffect, useState } from "react";
import { updateKnowledge, deleteKnowledge } from "../../features/knowledge/api/api";
import { CATEGORY_LABEL, Category } from "../../features/knowledge/constants/category";
import { Knowledge } from "../../features/knowledge/types/knowledge";
import { resolveApiError } from "../../../src/lib/errors/resolveApiError";
import { mutate } from "swr";
import router from "next/router";

type Props = {
  open: boolean;
  knowledge: Knowledge;
  onClose: () => void;
};

export default function EditKnowledgeModal({ open, knowledge, onClose }: Props) {
  const [category, setCategory] = useState<Category>(knowledge.category);
  const [text, setText] = useState(knowledge.text);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setCategory(knowledge.category);
      setText(knowledge.text);
    }
  }, [open, knowledge]);

  if (!open) return null;

  const handleUpdate = async () => {
    if (!text.trim()) {
      alert("内容を入力してください");
      return;
    }

    try {
      setUpdateLoading(true);
      await updateKnowledge(knowledge.id, { category, text });

      mutate<{ items: Knowledge[] }>("/knowledge", (data) => {
        if (!data) return data;
        return {
          ...data,
          items: data.items.map((k: Knowledge) =>
            k.id === knowledge.id ? { ...k, category, text } : k
          ),
        };
      }, false);

      onClose();
    } catch (e) {
      const { message, action } = resolveApiError(e);
      alert(message);
      if (action === "redirectLogin") router.push("/login");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("本当に削除しますか？")) return;

    try {
      setDeleteLoading(true);
      await deleteKnowledge(knowledge.id);

      mutate<{ items: Knowledge[] }>("/knowledge", (data) => {
        if (!data) return data;
        return {
          ...data,
          items: data.items.filter((k: Knowledge) => k.id !== knowledge.id),
        };
      }, false);

      onClose();
    } catch (e) {
      const { message, action } = resolveApiError(e);
      alert(message);
      if (action === "redirectLogin") router.push("/login");
    } finally {
      setDeleteLoading(false);
    }
  };

  const categories = Object.keys(CATEGORY_LABEL) as Category[];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-xl bg-gray-900 rounded-xl shadow-xl p-6 space-y-4">
        <div className="text-lg font-semibold">ナレッジ編集</div>

        <div>
          <label className="text-xs text-gray-400">カテゴリ</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value as Category)}
            className="w-full mt-1 bg-gray-950 border border-gray-700 rounded-lg px-3 py-2"
          >
            {categories.map(key => (
              <option key={key} value={key}>
                {CATEGORY_LABEL[key]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-400">内容</label>
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
            onClick={handleDelete}
            disabled={deleteLoading}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white disabled:opacity-50"
          >
            {deleteLoading ? "削除中…" : "削除"}
          </button>

          <button
            onClick={handleUpdate}
            disabled={updateLoading}
            className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white disabled:opacity-50"
          >
            {updateLoading ? "更新中…" : "更新"}
          </button>
        </div>
      </div>
    </div>
  );
}
