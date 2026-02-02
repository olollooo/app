"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import EditKnowledgeModal from "../knowledge/EditKnowledgeModal";
import { Knowledge } from "../../features/knowledge/types/knowledge";
import { CATEGORY_LABEL, Category } from "../../features/knowledge/constants/category";
import type { Session } from "@supabase/supabase-js";
import { superbaseBrowserClient } from "../../lib/superbase/client";
import LogoutButton from "../auth/LogoutButton";
import router from "next/router";
import { resolveApiError } from "../../../src/lib/errors/resolveApiError";
import { swrFetcher } from "../../lib/api/swrFetcher";

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [selectedKnowledge, setSelectedKnowledge] = useState<Knowledge | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const supabase = superbaseBrowserClient();

    const initAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setAuthLoading(false);
    };

    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const userId = session?.user?.id;

  const { data, error } = useSWR(
    userId && open ? "/knowledge" : null,
    swrFetcher<{ items: Knowledge[] }>
  );

  useEffect(() => {
    if (!error) return;
    const { message, action } = resolveApiError(error);
    alert(message);
    if (action === "redirectLogin") router.push("/login");
  }, [error]);

  const knowledgeList = useMemo(() => data?.items ?? [], [data]);

  const grouped = useMemo(() => {
    const map: Record<Category, Knowledge[]> = {
      rule: [],
      policy: [],
      decision: [],
      memo: [],
    };
    knowledgeList.forEach(k => map[k.category].push(k));
    return map;
  }, [knowledgeList]);

  const handleOpenModal = (knowledge: Knowledge) => {
    setSelectedKnowledge(knowledge);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedKnowledge(null);
  };

  const handleDeleteAccount = async () => {
    if (!confirm("本当に退会しますか？\nこの操作は取り消せません。")) return;

    const res = await fetch("/api/auth/delete", { method: "DELETE" });

    if (res.ok) {
      const supabase = superbaseBrowserClient();
      await supabase.auth.signOut();
      location.href = "/";
    } else {
      alert("退会処理に失敗しました");
    }
  };

  if (authLoading) return null;

  return (
    <>
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 border-r border-gray-800
          transform transition-transform duration-200 flex flex-col
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* ヘッダー */}
        <div className="h-14 flex items-center px-4 border-b border-gray-800">
          <button onClick={onClose} className="p-2 rounded hover:bg-gray-800">
            ☰
          </button>
        </div>

        {/* ナレッジリスト */}
        <nav className="flex-1 px-2 space-y-6 overflow-y-auto">
          {session ? (
            (Object.keys(CATEGORY_LABEL) as Category[]).map(category => (
              <div key={category}>
                <div className="px-4 pt-4 pb-2 text-xs tracking-widest text-gray-400">
                  {CATEGORY_LABEL[category]}
                </div>
                <div className="space-y-1">
                  {grouped[category].map(k => (
                    <button
                      key={k.id}
                      onClick={() => handleOpenModal(k)}
                      className="w-full text-left flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-gray-200 hover:bg-gray-800 transition truncate"
                    >
                      <span className="truncate">{k.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-sm text-gray-400 leading-relaxed">
              ログインすると
              <br />
              あなた専用のナレッジが表示されます。
            </div>
          )}
        </nav>

        {/* フッター */}
        <div className="mt-auto border-t border-gray-800 p-4">
          {session ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-300 min-w-0">
                <div className="flex-1 truncate">{session.user.email}</div>
                <div className="shrink-0">
                  <LogoutButton />
                </div>
              </div>

              <button
                onClick={handleDeleteAccount}
                className="w-full text-xs text-red-400 hover:text-red-300 transition text-left"
              >
                退会する
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="w-full flex items-center justify-center gap-2 h-10 rounded-lg bg-sky-600 hover:bg-sky-500 transition text-sm font-medium text-white"
            >
              ログイン / 新規登録
            </Link>
          )}
        </div>
      </aside>

      {/* 編集モーダル */}
      {selectedKnowledge && (
        <EditKnowledgeModal
          open={modalOpen}
          knowledge={selectedKnowledge}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
