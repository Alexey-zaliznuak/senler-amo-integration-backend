import { Body, Controller, HttpCode, Param, Post, Request } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { CustomRequest } from 'src/infrastructure/requests';

@Controller('integration/webhooks')
export class WebhooksController {
  constructor(
    private readonly webhooksService: WebhooksService
  ) {}

  @Post('/bot_step')
  @HttpCode(201)
  async handlePostRequest(
    @Request() req: CustomRequest,
    @Body() body?: any,
  ): Promise<any> {
    req.logger.warn("HEADERS", req.headers)
    return {
      vars: [
        { n:"x-time", v: new Date().getMilliseconds() }
      ]
    }
  }
}
