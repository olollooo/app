export const CATEGORY_LABEL = {
  rule: "ルール",
  policy: "方針",
  decision: "決定事項",
  memo: "メモ",
} as const;

export type Category = keyof typeof CATEGORY_LABEL;
