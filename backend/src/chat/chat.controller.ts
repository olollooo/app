import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ChatService } from "./chat.service";
import { UsageService } from "../usage/usage.service";
import { SendChatDto } from "./dto/send-chat.dto";
import { OptionalUserGuard } from "../auth/optional-user.guard"
import { ChatResponseDto } from "./dto/chat-response.dto";

@UseGuards(OptionalUserGuard)
@Controller("chat")
export class ChatController {
  constructor(private chat: ChatService, private usage: UsageService) {}

  @Post()
  async send(@Req() req: any, @Body() body: SendChatDto): Promise<ChatResponseDto> {
    const result = await this.usage.runWithUsage(req.user?.id ?? null, body.messages, this.chat);

    
    return {
      message: {
        role: "ai",
        sections: result.sections,
        tokens: result.tokens,
        createdAt: new Date().toISOString(),
      },
    };
  }
}
