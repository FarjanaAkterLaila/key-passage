import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';

type AuthBody = { email?: string; password?: string };

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  register(@Body() body: AuthBody) {
    return this.auth.register(body.email ?? '', body.password ?? '');
  }

  @Post('login')
  login(@Body() body: AuthBody) {
    return this.auth.login(body.email ?? '', body.password ?? '');
  }
}
