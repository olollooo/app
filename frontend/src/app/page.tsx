import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0B1220] via-[#0E1627] to-[#0B1220] text-slate-200">
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          あなたの意見を
          <span className="block text-sky-400 mt-2">
            建設的に鍛えるAI
          </span>
        </h1>

        <p className="mt-6 text-base leading-relaxed text-slate-400 sm:text-lg">
          主張・設計・コードを入力すると、
          <br className="hidden sm:block" />
          AIが<strong className="text-slate-200">多角的な反論と改善案</strong>を提示します。
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/chat"
            className="rounded-xl bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-sky-400 transition"
          >
            今すぐ試す
          </Link>

          <Link
            href="/login"
            className="rounded-xl border border-slate-600 px-6 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800 transition"
          >
            ログイン
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-center text-xl font-semibold text-slate-100 sm:text-2xl">
          使い方はシンプル
        </h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <FeatureCard
            title="1. 入力"
            description="意見、設計メモ、短文、ソースコードもOK"
          />
          <FeatureCard
            title="2. 分析"
            description="反論・改善点・要約を構造化して提示"
          />
          <FeatureCard
            title="3. 深掘り"
            description="チャットで論点を掘り下げる"
          />
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="rounded-2xl border border-slate-700 bg-[#0F1B30] p-8">

          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li>・「自由に会話」ではなく<strong className="text-slate-200">思考を鍛える設計</strong></li>
            <li>・初回から<strong className="text-slate-200">構造化された反論</strong></li>
            <li>・チャットは補助、主役は分析結果</li>
          </ul>
        </div>
      </section>

      <footer className="border-t border-slate-800 py-8 text-center text-xs text-slate-500">
        © 2025 Constructive Argument AI
      </footer>
    </main>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-[#0F1B30] p-6">
      <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
      <p className="mt-2 text-sm text-slate-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
