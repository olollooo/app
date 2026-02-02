import { Module } from '@nestjs/common';
import { KnowledgeService } from './knowledge.service';
import { KnowledgeController } from './knowledge.controller';
import { KnowledgeLimitService } from './knowledge-limit.service';
import { PrismaService } from '../prisma/prisma.service';


@Module({
  providers: [
    KnowledgeService,
    KnowledgeLimitService,
    PrismaService,
  ],
  controllers: [KnowledgeController],
})
export class KnowledgeModule {}