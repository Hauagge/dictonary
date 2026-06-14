import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('App')
@Controller()
export class AppController {
  @Get()
  index(): { message: string } {
    return { message: 'English Dictionary' };
  }
}
