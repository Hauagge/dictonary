import { Controller, Get, Query } from "@nestjs/common"
import { EntriesQueryDto } from "./dto/entries-query.dto"
import { EntriesService } from "./entries.service"

@Controller("entries")
export class EntriesController {
  constructor(private readonly entries: EntriesService) {}

  @Get("en")
  list(@Query() query: EntriesQueryDto) {
    return this.entries.list(query)
  }
}
