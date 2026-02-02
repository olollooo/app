export const KNOWLEDGE_LIMITS = {
  guest: 5,
  free: 10,
  pro: 50
} as const;

export type KnowledgePlan = keyof typeof KNOWLEDGE_LIMITS;
