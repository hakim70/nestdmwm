import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth/auth.guard';

@Controller()
export class AppController {
  @Get('protected')
  @UseGuards(AuthGuard)
  getProtectedResource(): string {
    return 'This is a protected resource.';
  }
}
