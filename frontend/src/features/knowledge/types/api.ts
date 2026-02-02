import { Knowledge } from "./knowledge";

export type KnowledgeCreateRequest = {
  category: Knowledge["category"];
  text: string;
};

export type KnowledgeCreateResponse = {
  item: Knowledge;
};

export type KnowledgeListResponse = {
  items: Knowledge[];
};
