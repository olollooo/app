"use client";

import { useSearchParams } from "next/navigation";
import { superbaseBrowserClient } from "../../../lib/superbase/client";

export default function LoginPage() {
  const supabase = superbaseBrowserClient();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/chat";

  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/api/auth/callback?redirect=${encodeURIComponent(
          redirect
        )}`,
      },
    });
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full space-y-6">
        <header className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            ログインしてチャットを始める
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Googleアカウントで安全にログインできます
          </p>
        </header>

        <button
          onClick={login}
          className="w-full h-12 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium transition"
        >
          Googleでログイン
        </button>

      </div>
    </main>
  );
}
