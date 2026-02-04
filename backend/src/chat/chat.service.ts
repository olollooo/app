import { Injectable } from "@nestjs/common";
import { OpenAIService } from "./openai/openai.service";
import type { ChatMessageDto } from "./dto/send-chat.dto";
import { AiSectionsSchema } from "./schemas/aiSections.schema";


@Injectable()
export class ChatService {
  logger: any;
  constructor(private readonly openai: OpenAIService) { }

  async run(messages: ChatMessageDto[]) {
    const systemPrompt = this.buildSystemPrompt();

    const aiText = await this.openai.chat(systemPrompt, messages);
    const sections = this.extractSections(aiText.content);

    return {
      sections,
      tokens: aiText.tokens,
    };
  }

  private buildSystemPrompt() {
    return `
    You are a senior backend engineer and software architect.

    Your task is to perform technical design reviews based strictly on engineering reasoning.
    Do NOT provide emotional criticism.

    # Objective
    Identify:
    - design weaknesses
    - wrong assumptions
    - production risks
    Then propose practical and implementable improvements.

    # Output Rules (STRICT)
    - Output ONLY valid JSON
    - NO explanations before or after
    - Follow the exact schema
    - Use \\n for line breaks
    - Do NOT break JSON syntax
    - Include concrete implementation code when necessary
    - Wrap code blocks using language-specified markdown fences
    - The response language MUST be Japanese (except JSON syntax and code)

    # JSON Schema
    {
      "rebuttal": string,
      "improve": string,
      "reason": string,
      "risk": string
    }

    # Requirements
    - Challenge assumptions
    - Focus on production operations
    - No abstract or vague advice
    `;
  }


  private extractSections(text: string) {
    const defaultSections = {
      rebuttal: "反論は特にありません。",
      improve: "改善案がありません。",
      reason: "理由がありません。",
      risk: "リスクがありません。"
    };

    let parsed: unknown;

    try {
      parsed = JSON.parse(text);
    } catch (e) {
      this.logger?.warn?.("AI JSON parse failed", { text });

      return {
        rebuttal: defaultSections.rebuttal,
        improve: defaultSections.improve,
        reason: "AIの出力形式が不正でした。",
        risk: "構造化に失敗したためリスク評価が不完全です。",
      };
    }

    const result = AiSectionsSchema.safeParse(parsed);

    if (!result.success) {
      this.logger?.warn?.("AI JSON schema validation failed", {
        errors: result.error,
        parsed,
      });

      return {
        rebuttal: defaultSections.rebuttal,
        improve: defaultSections.improve,
        reason: "JSON構造の検証に失敗しました。",
        risk: "構造不正のためリスク評価が不完全です。",
      };
    }

    const data = result.data;

    return {
      rebuttal: data.rebuttal ?? defaultSections.rebuttal,
      improve: data.improve ?? defaultSections.improve,
      reason: data.reason ?? defaultSections.reason,
      risk: data.risk ?? defaultSections.risk,
    };
  }
}
