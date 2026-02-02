import { apiFetch } from "../../../lib/api/apiClient";
import { KnowledgeCreateRequest, KnowledgeCreateResponse } from "../types/api";
import type { Knowledge } from "../types/knowledge";

export const getKnowledgeList = () =>
  apiFetch<{ items: Knowledge[] }>("/knowledge");

export const createKnowledge = (body: KnowledgeCreateRequest) =>
  apiFetch<KnowledgeCreateResponse>("/knowledge", {
    method: "POST",
    body,
  });

export const updateKnowledge = (id: string, body: {
  category: Knowledge["category"];
  text: string;
}) =>
  apiFetch<{ item: Knowledge }>(`/knowledge/${id}`, {
    method: "PUT",
    body,
  });

export const deleteKnowledge = (id: string) =>
  apiFetch(`/knowledge/${id}`, { method: "DELETE" });
