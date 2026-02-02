import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export enum KnowledgeCategory {
  rule = "rule",
  policy = "policy",
  decision = "decision",
  memo = "memo",
}

export class CreateKnowledgeDto {
  @IsEnum(KnowledgeCategory)
  category: KnowledgeCategory;

  @IsString()
  @IsNotEmpty()
  text: string;
}
