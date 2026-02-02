// src/chat/openai/openai.service.ts
import { Injectable } from "@nestjs/common";
import OpenAI from "openai";
import type {
  ChatCompletionMessageParam,
  ChatCompletionSystemMessageParam,
  ChatCompletionUserMessageParam,
  ChatCompletionAssistantMessageParam,
} from "openai/resources/chat";
import type { ChatMessageDto } from "../dto/send-chat.dto";

@Injectable()
export class OpenAIService {
  private client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
  });

  async chat(systemPrompt: string, messages: ChatMessageDto[]) {
    // AIメッセージを含む過去の履歴を OpenAI の型に変換
    const toOpenAIMessage = (m: ChatMessageDto): ChatCompletionMessageParam => {
      if (m.role === "user") {
        const msg: ChatCompletionUserMessageParam = {
          role: "user",
          content: m.content ?? "",
        };
        return msg;
      } else {
        const msg: ChatCompletionAssistantMessageParam = {
          role: "assistant",
          content: JSON.stringify(m.sections ?? {}),
        };
        return msg;
      }
    };

    const openAIMessages: ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt } as ChatCompletionSystemMessageParam,
      ...messages.map(toOpenAIMessage),
    ];

    const completion = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: openAIMessages,
    });

    const content = completion.choices[0].message?.content ?? "";
    const tokens =
      completion.usage?.total_tokens ??
      Math.ceil(content.replace(/[^\x00-\x7F]/g, "aa").length / 4);

    return { content, tokens };
  }
}
