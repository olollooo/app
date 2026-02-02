CREATE EXTENSION IF NOT EXISTS vector;

-- 既存インデックス削除
DROP INDEX IF EXISTS "knowledges_userId_category_idx";

-- 1. id を text → uuid に安全に変換
ALTER TABLE "knowledges"
  ALTER COLUMN "id" TYPE UUID
  USING id::uuid;

-- 2. 新カラム追加
ALTER TABLE "knowledges"
  ADD COLUMN IF NOT EXISTS "embedding" vector,
  ADD COLUMN IF NOT EXISTS "summary" TEXT;

-- 3. 主キー制約を張り直す
ALTER TABLE "knowledges" DROP CONSTRAINT IF EXISTS "knowledges_pkey";
ALTER TABLE "knowledges" ADD CONSTRAINT "knowledges_pkey" PRIMARY KEY ("id");

-- 4. 新しいインデックス作成
CREATE INDEX IF NOT EXISTS "knowledges_userId_createdAt_idx"
  ON "knowledges"("userId", "createdAt");

CREATE INDEX IF NOT EXISTS "knowledges_userId_category_createdAt_idx"
  ON "knowledges"("userId", "category", "createdAt");
