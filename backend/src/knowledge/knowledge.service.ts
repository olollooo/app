import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateKnowledgeDto } from "./dto/create-knowledge.dto";
import { KnowledgeLimitService } from "./knowledge-limit.service";

@Injectable()
export class KnowledgeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly limit: KnowledgeLimitService,
  ) {}

  async create(userId: string, dto: CreateKnowledgeDto) {

    await this.limit.assertCreatable(userId);

    const [created] = await this.prisma.$queryRaw<any[]>`
      INSERT INTO knowledges (id, "userId", category, text, "createdAt", "updatedAt")
      VALUES (
        gen_random_uuid(),
        ${userId}::uuid,
        CAST(${dto.category} AS "KnowledgeCategory"),
        ${dto.text},
        NOW(),
        NOW()
      )
      RETURNING id, category, text, "createdAt", "updatedAt"
    `;

    return created;
  }

  async findByUserId(userId: string) {
    return this.prisma.$queryRaw<any[]>`
      SELECT id, category, text
      FROM knowledges
      WHERE "userId" = ${userId}::uuid
      ORDER BY "createdAt" DESC
    `;
  }

  async update(userId: string, id: string, dto: CreateKnowledgeDto) {
    const [updated] = await this.prisma.$queryRaw<any[]>`
      UPDATE knowledges
      SET category = CAST(${dto.category} AS "KnowledgeCategory"),
          text = ${dto.text},
          "updatedAt" = NOW()
      WHERE id = ${id}::uuid
        AND "userId" = ${userId}::uuid
      RETURNING id, category, text, "createdAt", "updatedAt"
    `;

    return updated;
  }

  async delete(userId: string, id: string) {
    const deleted = await this.prisma.$queryRaw`
      DELETE FROM knowledges
      WHERE id = ${id}::uuid
        AND "userId" = ${userId}::uuid
    `;

    return deleted;
  }
}
