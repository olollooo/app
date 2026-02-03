# アプリケーション概要

AIが **反論・改善案・改善理由・改善後リスク** を構造化して提示し、
思考力と設計力を鍛えるための「議論特化型チャットアプリ」。

---

## 特徴

- 構造化チャット（反論 / 改善案 / 改善理由 / 改善後リスク）
- Google OAuth ログイン（Supabase Auth）
- ナレッジ保存・編集機能
- Markdown + コードハイライト
- Dockerによる完全ローカル再現
- NestJS + Prisma API
- 将来拡張用 Rust + WebAssembly 基盤

---

## アーキテクチャ

Next.js (Frontend) → NestJS (API) → Supabase (Auth/DB)

---

## フロントエンド

- Next.js 16 (App Router)
- TypeScript
- TailwindCSS
- SWR
- react-markdown
- Supabase SSR Client
- Docker (開発環境のみ)

---

## バックエンド

- NestJS
- Prisma
- Supabase Auth (JWT)
- Docker (開発環境のみ)

---

## 認証

### RequiredUserGuard
ログイン必須API用

### OptionalUserGuard
未ログインでも利用可能API用

Guardで認証責務を分離し、Controllerをシンプルに保つ設計。

---

## Knowledge設計

Knowledgeは現在CRUD（登録・更新・削除・取得）のみ実装しています。  
一方で、将来的な検索性・AI活用を見据え **永続化前提の拡張可能なデータ構造** として設計しています。

- UUID主キーによるスケーラブル設計
- userId / category / createdAt の複合インデックス最適化
- pgvector拡張を利用した embedding カラム
- summaryカラムによる軽量検索・表示最適化

これにより、後から大きなリファクタ無しでベクトル検索やRAG構成へ移行可能です。

---

## ローカル開発

### 起動

docker compose --profile dev up

### Debug

docker compose --profile debug up

---

## 環境設定

### frontend/.env

NEXT_PUBLIC_SUPABASE_URL=  
NEXT_PUBLIC_SUPABASE_ANON_KEY=

### backend/.env

SUPABASE_URL=  
SUPABASE_SERVICE_ROLE_KEY=  
DATABASE_URL=  
OPENAI_API_KEY=

---

## 技術ポイント

- App Router設計
- JWT認証 + Guardパターン
- Docker完全再現環境
- Markdownレンダリング + コードブロック
- Knowledge永続化 + ベクトル検索へ拡張可能なDB設計
- WASM拡張可能構成
