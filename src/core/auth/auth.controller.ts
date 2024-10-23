import { Controller, Post, Body, Query, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/AuthCredentialsDto';
import { VerifyEmailDto } from './dto/verifyEmailDto';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { LoginDto } from './dto/LoginDto';

@ApiTags('Auth')
@Controller('api/v1/auth/')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() register: AuthCredentialsDto, @Req() req: Request) {
    const protocol = req.protocol;

    return this.authService.register(
      register.email,
      register.password,
      register.name,
      register.username,
      protocol + '://' + req.get('host'),
    );
  }

  @Post('login')
  async login(@Body() login: LoginDto) {
    return this.authService.login(login.email, login.password);
  }

  @Get('verify-email')
  async verifyEmail(@Query() verify: VerifyEmailDto) {
    return this.authService.verifyEmail(verify.token);
  }
}
