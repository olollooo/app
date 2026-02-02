import { IsArray, IsObject, ValidateNested, IsString, IsIn, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class ChatMessageDto {
  @IsIn(["user", "ai"])
  role: "user" | "ai";

  // ユーザ入力情報
  @IsOptional()
  @IsString()
  content?: string;

  // AI応答情報
  @IsOptional()
  @IsObject()
  sections?: {
    rebuttal?: string;
    improve?: string;
    reason?: string;
    risk?: string;
  };
}

export class SendChatDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatMessageDto)
  messages: ChatMessageDto[];
}