"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const logout = async () => {
    if (loading) return;
    setLoading(true);

    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  return (
    <button
    className="h-9 px-4 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium" 
    onClick={logout} 
    disabled={loading}>
      {loading ? "ログアウト中..." : "ログアウト"}
    </button>
  );
}
