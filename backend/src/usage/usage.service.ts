import { ForbiddenException, Injectable } from "@nestjs/common";
import { PLAN_LIMITS } from "./constants/plan-limits";
import type { Plan } from "./types/plan.types";
import { PrismaService } from "../prisma/prisma.service";
import { ChatMessageDto } from "../chat/dto/send-chat.dto";
import { ChatService } from "../chat/chat.service";

@Injectable()
@Injectable()
export class UsageService {
  constructor(private prisma: PrismaService) {}

  
  async runWithUsage(
    userId: string | null,
    messages: ChatMessageDto[],
    chatService: ChatService
  ) {
    const estimated = this.estimate(messages);
    const ym = this.getCurrentYearMonth();

    let plan: Plan = "guest";
    let used = 0;

    if (userId) {
      await this.prisma.$transaction(async (tx) => {
        await tx.$executeRaw`
          INSERT INTO usage_logs ("userId", "yearMonth", tokens, "createdAt", "updatedAt")
          VALUES (${userId}::uuid, ${ym}, 0, NOW(), NOW())
          ON CONFLICT ("userId", "yearMonth") DO NOTHING
        `;

        const [{ p, t }] = await tx.$queryRaw<{ p: string; t: number }[]>`
          SELECT u.plan AS p, ul.tokens AS t
          FROM users u
          JOIN usage_logs ul
            ON ul."userId" = u.id
            AND ul."yearMonth" = ${ym}
          WHERE u.id = ${userId}::uuid
          FOR UPDATE
        `;

        plan = (p ?? "free") as Plan;
        used = t ?? 0;
      });
    }

    const limit = PLAN_LIMITS[plan];
    if (used + estimated > limit) {
      throw new ForbiddenException({
        code: "AI_QUOTA_EXCEEDED",
        message: "AI usage quota has been exceeded"
      });
    }

    const aiResult = await chatService.run(messages);

    if (userId) {
      await this.prisma.$executeRaw`
        UPDATE usage_logs
        SET tokens = tokens + ${aiResult.tokens},
            "updatedAt" = NOW()
        WHERE "userId" = ${userId}::uuid
          AND "yearMonth" = ${ym}
      `;
    }

    return aiResult;
  }


  private getCurrentYearMonth() {
    const now = new Date();
    return now.getFullYear() * 100 + (now.getMonth() + 1);
  }

  private estimate(messages: ChatMessageDto[]) {
    const text = messages
      .map(m => m.content ?? Object.values(m.sections ?? {}).join(""))
      .join("");
    return Math.ceil(text.replace(/[^\x00-\x7F]/g, "aa").length / 4);
  }
}
