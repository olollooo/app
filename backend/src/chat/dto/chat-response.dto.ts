import { IsString, IsIn, IsOptional, IsObject, IsISO8601, IsNumber } from "class-validator";

export class MessageDto {
  @IsIn(["ai"])
  role: "ai";

  @IsObject()
  sections: {
    rebuttal?: string;
    improve?: string;
    reason?: string;
    risk?: string;
  };

  @IsISO8601()
  createdAt: string;

  @IsNumber()
  tokens: number;
}

export class ChatResponseDto {
  message: MessageDto;
}
