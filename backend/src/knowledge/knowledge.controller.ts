import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";
import { KnowledgeService } from "./knowledge.service";
import { CreateKnowledgeDto } from "./dto/create-knowledge.dto";
import { RequiredUserGuard } from "../auth/required-user.guard";

@Controller("knowledge")
@UseGuards(RequiredUserGuard)
export class KnowledgeController {
  constructor(private readonly service: KnowledgeService) {}

  @Post()
  async create(@Req() req, @Body() dto: CreateKnowledgeDto) {
    const result = await this.service.create(req.user.id, dto);
    return { result };
  }

  @Get()
  async list(@Req() req) {
    const items = await this.service.findByUserId(req.user.id);
    return { items };
  }

  @Put(":id")
  async update(@Req() req, @Param("id") id: string, @Body() dto: CreateKnowledgeDto) {
    const result = await this.service.update(req.user.id, id, dto);
    return { result };
  }

  @Delete(":id")
  async remove(@Req() req, @Param("id") id: string) {
    const result = await this.service.delete(req.user.id, id);
    return { result };
  }
}
