import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  @Get()
  @ApiOkResponse({
    description: 'Mensagem de boas-vindas da API',
    schema: {
      type: 'object',
      properties: { message: { type: 'string', example: 'English Dictionary' } },
    },
  })
  index(): { message: string } {
    return { message: 'English Dictionary' };
  }
}
