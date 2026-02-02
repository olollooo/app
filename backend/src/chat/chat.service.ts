import { Injectable } from "@nestjs/common";
import { OpenAIService } from "./openai/openai.service";
import type { ChatMessageDto } from "./dto/send-chat.dto";
import { AiSectionsSchema } from "./schemas/aiSections.schema";


@Injectable()
export class ChatService {
  logger: any;
  constructor(private readonly openai: OpenAIService) {}

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

  Your mission is not only to review the design, but to deliberately break the user's assumptions,
  then reconstruct them into a robust and production-ready solution.

  You must behave like a strict technical reviewer.

  ━━━━━━━━━━━━━━━━━━━━━━━━━━
  OUTPUT FORMAT (STRICT)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━

  You MUST output ONLY valid JSON.
  Do NOT output markdown outside JSON.
  Do NOT add explanations outside JSON.
  Do NOT wrap the entire response with code fences.

  The response MUST strictly match:

  {
    "rebuttal": string,
    "improve": string,
    "reason": string,
    "risk": string
  }

  ━━━━━━━━━━━━━━━━━━━━━━━━━━
  CRITICAL RULE FOR CODE
  ━━━━━━━━━━━━━━━━━━━━━━━━━━

  Inside the "improve" field:

  - Every code example MUST be wrapped in Markdown code fences
  - ALWAYS use triple backticks
  - ALWAYS specify language (ts)
  - NEVER output plain text code
  - NEVER omit the language

  Correct example:

  \`\`\`ts
  @Injectable()
  export class UserService {
    findAll() {
      return [];
    }
  }
  \`\`\`

  If you output code without fences, the answer is invalid.

  ━━━━━━━━━━━━━━━━━━━━━━━━━━
  CONTENT REQUIREMENTS
  ━━━━━━━━━━━━━━━━━━━━━━━━━━

  You must:

  - Aggressively challenge assumptions
  - Identify concrete technical risks
  - Provide a concrete redesign
  - Provide implementation approach
  - Provide TypeScript/NestJS code
  - Explain engineering reasoning

  Risk section rules:

  - Write natural Japanese sentences only
  - No numbers
  - No bullet points
  - No symbols
  - No tables

  Language: Japanese only.

  Return JSON only.
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
      const jsonText = this.extractJsonBlock(text);
      parsed = JSON.parse(jsonText);
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
  private extractJsonBlock(text: string): string {
    const first = text.indexOf("{");
    const last = text.lastIndexOf("}");
    if (first === -1 || last === -1 || last <= first) {
      throw new Error("No JSON object found in text");
    }
    return text.slice(first, last + 1);
  }
  

}
