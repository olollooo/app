import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { KNOWLEDGE_LIMITS, KnowledgePlan } from "./constants/knowledge-limits";

@Injectable()
export class KnowledgeLimitService {
  constructor(private prisma: PrismaService) {}

  async assertCreatable(userId: string) {
    const plan = await this.getPlan(userId);
    const limit = KNOWLEDGE_LIMITS[plan];

    if (limit === Infinity) return;

    const [{ count }] = await this.prisma.$queryRaw<{ count: number }[]>`
      SELECT COUNT(*)::int AS count
      FROM knowledges
      WHERE "userId" = ${userId}::uuid
    `;

    if (count >= limit) {
      throw new ForbiddenException({
        code: "RESOURCE_LIMIT_EXCEEDED",
        message: "Chat registration limit reached."
      });
    }
  }

  private async getPlan(userId: string | null): Promise<KnowledgePlan> {
    if (!userId) return "guest";

    const [user] = await this.prisma.$queryRaw<{ plan: KnowledgePlan }[]>`
      SELECT plan
      FROM users
      WHERE id = ${userId}::uuid
      LIMIT 1
    `;

    return user.plan;
  }
}
