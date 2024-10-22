import { Controller, Post, Body, Query, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/AuthCredentialsDto';
import { VerifyEmailDto } from './dto/verifyEmailDto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('api/v1/auth/')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() register: AuthCredentialsDto) {
    return this.authService.register(register.email, register.password);
  }

  @Post('login')
  async login(@Body() login: AuthCredentialsDto) {
    return this.authService.login(login.email, login.password);
  }

  @Get('verify-email')
  async verifyEmail(@Query() verify: VerifyEmailDto) {
    return this.authService.verifyEmail(verify.token);
  }
}
